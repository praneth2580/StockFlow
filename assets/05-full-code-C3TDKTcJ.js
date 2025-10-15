const e=`> Paste the code below into your Apps Script \`Code.gs\` (or the script editor of a standalone project). Replace \`SHEET-ID-HERE\` with your spreadsheet ID.\r
\r
\`\`\`javascript\r
/**\r
 * Google Sheets Inventory DB API\r
 * - Dynamic sheets per entity\r
 * - Auto-create schema headers\r
 * - CRUD: GET, POST, PUT, DELETE\r
 * - Simple filters, optional JSONP for GET (callback param)\r
 */\r
\r
const SPREADSHEET_ID = 'SHEET-ID-HERE'; // <-- replace this\r
const DEFAULT_SHEET = 'Products';\r
\r
const SCHEMAS = {\r
  Products: [\r
    'id', 'name', 'category', 'description', 'sku', 'barcode',\r
    'quantity', 'costPrice', 'sellingPrice', 'supplierId', 'lowStockThreshold',\r
    'createdAt', 'updatedAt'\r
  ],\r
  Sales: [\r
    'id', 'productId', 'quantity', 'sellingPrice', 'total', 'date', 'customerName', 'paymentMethod'\r
  ],\r
  Purchases: [\r
    'id', 'productId', 'supplierId', 'quantity', 'costPrice', 'total', 'date', 'invoiceNumber'\r
  ],\r
  Suppliers: [\r
    'id', 'name', 'contactPerson', 'phone', 'email', 'address', 'notes', 'createdAt', 'updatedAt'\r
  ],\r
  Settings: [\r
    'shopName', 'currency', 'lowStockGlobalThreshold', 'googleSheetId', 'theme', 'offlineMode', 'updatedAt'\r
  ]\r
};\r
\r
/** Ensure sheet exists and has required headers. Returns the sheet. */\r
function getOrCreateSheet(sheetName) {\r
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);\r
  let sheet = ss.getSheetByName(sheetName);\r
  const headers = SCHEMAS[sheetName] || ['id', 'name'];\r
\r
  if (!sheet) {\r
    sheet = ss.insertSheet(sheetName);\r
    sheet.appendRow(headers);\r
    Logger.log(\`Created new sheet: \${sheetName}\`);\r
    return sheet;\r
  }\r
\r
  // If sheet exists but headers are missing or different, fix them.\r
  const existingHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];\r
  if (existingHeaders.length < headers.length || !arraysEqual(existingHeaders, headers)) {\r
    // Overwrite header row with canonical headers from SCHEMAS\r
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);\r
    Logger.log(\`Updated headers for sheet: \${sheetName}\`);\r
  }\r
  return sheet;\r
}\r
\r
function arraysEqual(a, b) {\r
  if (!a || !b) return false;\r
  if (a.length !== b.length) return false;\r
  for (let i = 0; i < a.length; i++) if (String(a[i]) !== String(b[i])) return false;\r
  return true;\r
}\r
\r
/** Initialize all schema sheets (run manually once) */\r
function initializeSheets() {\r
  Object.keys(SCHEMAS).forEach(name => getOrCreateSheet(name));\r
  Logger.log('Initialization complete');\r
}\r
\r
/** Parse JSON body safely */\r
function parseBody(e) {\r
  try {\r
    return e && e.postData && e.postData.contents ? JSON.parse(e.postData.contents) : {};\r
  } catch (err) {\r
    return {};\r
  }\r
}\r
\r
/** Respond JSON or JSONP if ?callback=... provided (GET only) */\r
function respond(obj, e) {\r
  const json = JSON.stringify(obj);\r
  const callback = e && e.parameter && e.parameter.callback;\r
  if (callback) {\r
    return ContentService.createTextOutput(\`\${callback}(\${json})\`).setMimeType(ContentService.MimeType.JAVASCRIPT);\r
  }\r
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);\r
}\r
\r
/** GET: read rows, optional filters, limit, offset */\r
function doGet(e) {\r
  const sheetName = e.parameter.sheet || DEFAULT_SHEET;\r
  const sheet = getOrCreateSheet(sheetName);\r
\r
  const range = sheet.getDataRange();\r
  const values = range.getValues();\r
  if (values.length <= 1) return respond([], e);\r
\r
  const headers = values[0];\r
  const rows = values.slice(1).map(r => Object.fromEntries(headers.map((h, i) => [h, r[i]])));\r
\r
  // Simple filtering: any query param (except sheet, callback, limit, offset)\r
  const reserved = ['sheet', 'callback', 'limit', 'offset'];\r
  const filters = Object.entries(e.parameter || {}).filter(([k]) => reserved.indexOf(k) === -1);\r
\r
  let result = rows;\r
  if (filters.length) {\r
    result = rows.filter(row => filters.every(([k, v]) => String(row[k]) === String(v)));\r
  }\r
\r
  // pagination\r
  const limit = e.parameter.limit ? parseInt(e.parameter.limit, 10) : null;\r
  const offset = e.parameter.offset ? parseInt(e.parameter.offset, 10) : 0;\r
  if (limit != null) result = result.slice(offset, offset + limit);\r
  else if (offset) result = result.slice(offset);\r
\r
  return respond(result, e);\r
}\r
\r
/** POST: create new record */\r
function doPost(e) {\r
  const body = parseBody(e);\r
  const sheetName = body.sheet || DEFAULT_SHEET;\r
  const sheet = getOrCreateSheet(sheetName);\r
\r
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];\r
\r
  // Generate UUID for id if not provided\r
  body.id = body.id || Utilities.getUuid();\r
\r
  const now = new Date().toISOString();\r
  if (headers.indexOf('createdAt') !== -1) body.createdAt = body.createdAt || now;\r
  if (headers.indexOf('updatedAt') !== -1) body.updatedAt = body.updatedAt || now;\r
\r
  const newRow = headers.map(h => body[h] !== undefined ? body[h] : '');\r
  sheet.appendRow(newRow);\r
\r
  return respond({ status: 'success', id: body.id, sheet: sheetName }, e);\r
}\r
\r
/** PUT: update record by id (expects JSON body with id) */\r
function doPut(e) {\r
  const body = parseBody(e);\r
  const sheetName = body.sheet || DEFAULT_SHEET;\r
  const sheet = getOrCreateSheet(sheetName);\r
  const id = String(body.id || '');\r
  if (!id) return respond({ error: 'Missing id in request body' }, e);\r
\r
  const range = sheet.getDataRange();\r
  const values = range.getValues();\r
  const headers = values[0];\r
  const rows = values.slice(1);\r
  const now = new Date().toISOString();\r
\r
  for (let i = 0; i < rows.length; i++) {\r
    if (String(rows[i][0]) === id) {\r
      headers.forEach((h, j) => {\r
        if (h === 'updatedAt') {\r
          sheet.getRange(i + 2, j + 1).setValue(now);\r
        } else if (body[h] !== undefined) {\r
          sheet.getRange(i + 2, j + 1).setValue(body[h]);\r
        }\r
      });\r
      return respond({ status: 'updated', id, sheet: sheetName }, e);\r
    }\r
  }\r
\r
  return respond({ error: 'ID not found', sheet: sheetName }, e);\r
}\r
\r
/** DELETE: remove row by id (query param) */\r
function doDelete(e) {\r
  const sheetName = e.parameter.sheet || DEFAULT_SHEET;\r
  const sheet = getOrCreateSheet(sheetName);\r
  const id = String(e.parameter.id || '');\r
  if (!id) return respond({ error: 'Missing id parameter' }, e);\r
\r
  const range = sheet.getDataRange();\r
  const values = range.getValues();\r
\r
  for (let i = 1; i < values.length; i++) {\r
    if (String(values[i][0]) === id) {\r
      sheet.deleteRow(i + 1);\r
      return respond({ status: 'deleted', id, sheet: sheetName }, e);\r
    }\r
  }\r
\r
  return respond({ error: 'ID not found', sheet: sheetName }, e);\r
}\r
\r
/** Example: how you could add a report endpoint (not enabled by default)\r
 * function generateReport() { ... }\r
 * Call via doGet with ?sheet=Products&__report=summary and implement logic.\r
 */\r
\`\`\`\r
`;export{e as default};
