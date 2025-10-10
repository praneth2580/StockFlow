> Paste the code below into your Apps Script `Code.gs` (or the script editor of a standalone project). Replace `SHEET-ID-HERE` with your spreadsheet ID.

```javascript
/**
 * Google Sheets Inventory DB API
 * - Dynamic sheets per entity
 * - Auto-create schema headers
 * - CRUD: GET, POST, PUT, DELETE
 * - Simple filters, optional JSONP for GET (callback param)
 */

const SPREADSHEET_ID = 'SHEET-ID-HERE'; // <-- replace this
const DEFAULT_SHEET = 'Products';

const SCHEMAS = {
  Products: [
    'id', 'name', 'category', 'description', 'sku', 'barcode',
    'quantity', 'costPrice', 'sellingPrice', 'supplierId', 'lowStockThreshold',
    'createdAt', 'updatedAt'
  ],
  Sales: [
    'id', 'productId', 'quantity', 'sellingPrice', 'total', 'date', 'customerName', 'paymentMethod'
  ],
  Purchases: [
    'id', 'productId', 'supplierId', 'quantity', 'costPrice', 'total', 'date', 'invoiceNumber'
  ],
  Suppliers: [
    'id', 'name', 'contactPerson', 'phone', 'email', 'address', 'notes', 'createdAt', 'updatedAt'
  ],
  Settings: [
    'shopName', 'currency', 'lowStockGlobalThreshold', 'googleSheetId', 'theme', 'offlineMode', 'updatedAt'
  ]
};

/** Ensure sheet exists and has required headers. Returns the sheet. */
function getOrCreateSheet(sheetName) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(sheetName);
  const headers = SCHEMAS[sheetName] || ['id', 'name'];

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    Logger.log(`Created new sheet: ${sheetName}`);
    return sheet;
  }

  // If sheet exists but headers are missing or different, fix them.
  const existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (existingHeaders.length < headers.length || !arraysEqual(existingHeaders, headers)) {
    // Overwrite header row with canonical headers from SCHEMAS
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    Logger.log(`Updated headers for sheet: ${sheetName}`);
  }
  return sheet;
}

function arraysEqual(a, b) {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (String(a[i]) !== String(b[i])) return false;
  return true;
}

/** Initialize all schema sheets (run manually once) */
function initializeSheets() {
  Object.keys(SCHEMAS).forEach(name => getOrCreateSheet(name));
  Logger.log('Initialization complete');
}

/** Parse JSON body safely */
function parseBody(e) {
  try {
    return e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};
  } catch (err) {
    return {};
  }
}

/** Respond JSON or JSONP if ?callback=... provided (GET only) */
function respond(obj, e) {
  const json = JSON.stringify(obj);
  const callback = e && e.parameter && e.parameter.callback;
  if (callback) {
    return ContentService.createTextOutput(`${callback}(${json})`).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

/** GET: read rows, optional filters, limit, offset */
function doGet(e) {
  const sheetName = e.parameter.sheet || DEFAULT_SHEET;
  const sheet = getOrCreateSheet(sheetName);

  const range = sheet.getDataRange();
  const values = range.getValues();
  if (values.length <= 1) return respond([], e);

  const headers = values[0];
  const rows = values.slice(1).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i]])));

  // Simple filtering: any query param (except sheet, callback, limit, offset)
  const reserved = ['sheet', 'callback', 'limit', 'offset'];
  const filters = Object.entries(e.parameter || {}).filter(([k]) => reserved.indexOf(k) === -1);

  let result = rows;
  if (filters.length) {
    result = rows.filter(row => filters.every(([k, v]) => String(row[k]) === String(v)));
  }

  // pagination
  const limit = e.parameter.limit ? parseInt(e.parameter.limit, 10) : null;
  const offset = e.parameter.offset ? parseInt(e.parameter.offset, 10) : 0;
  if (limit != null) result = result.slice(offset, offset + limit);
  else if (offset) result = result.slice(offset);

  return respond(result, e);
}

/** POST: create new record */
function doPost(e) {
  const body = parseBody(e);
  const sheetName = body.sheet || DEFAULT_SHEET;
  const sheet = getOrCreateSheet(sheetName);

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Generate UUID for id if not provided
  body.id = body.id || Utilities.getUuid();

  const now = new Date().toISOString();
  if (headers.indexOf('createdAt') !== -1) body.createdAt = body.createdAt || now;
  if (headers.indexOf('updatedAt') !== -1) body.updatedAt = body.updatedAt || now;

  const newRow = headers.map(h => body[h] !== undefined ? body[h] : '');
  sheet.appendRow(newRow);

  return respond({ status: 'success', id: body.id, sheet: sheetName }, e);
}

/** PUT: update record by id (expects JSON body with id) */
function doPut(e) {
  const body = parseBody(e);
  const sheetName = body.sheet || DEFAULT_SHEET;
  const sheet = getOrCreateSheet(sheetName);
  const id = String(body.id || '');
  if (!id) return respond({ error: 'Missing id in request body' }, e);

  const range = sheet.getDataRange();
  const values = range.getValues();
  const headers = values[0];
  const rows = values.slice(1);
  const now = new Date().toISOString();

  for (let i = 0; i < rows.length; i++) {
    if (String(rows[i][0]) === id) {
      headers.forEach((h, j) => {
        if (h === 'updatedAt') {
          sheet.getRange(i + 2, j + 1).setValue(now);
        } else if (body[h] !== undefined) {
          sheet.getRange(i + 2, j + 1).setValue(body[h]);
        }
      });
      return respond({ status: 'updated', id, sheet: sheetName }, e);
    }
  }

  return respond({ error: 'ID not found', sheet: sheetName }, e);
}

/** DELETE: remove row by id (query param) */
function doDelete(e) {
  const sheetName = e.parameter.sheet || DEFAULT_SHEET;
  const sheet = getOrCreateSheet(sheetName);
  const id = String(e.parameter.id || '');
  if (!id) return respond({ error: 'Missing id parameter' }, e);

  const range = sheet.getDataRange();
  const values = range.getValues();

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === id) {
      sheet.deleteRow(i + 1);
      return respond({ status: 'deleted', id, sheet: sheetName }, e);
    }
  }

  return respond({ error: 'ID not found', sheet: sheetName }, e);
}

/** Example: how you could add a report endpoint (not enabled by default)
 * function generateReport() { ... }
 * Call via doGet with ?sheet=Products&__report=summary and implement logic.
 */
```
