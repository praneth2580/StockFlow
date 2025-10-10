# Google Sheets Inventory API — Multi-file Guide

This collection contains multiple Markdown "files" (sections) to help you add the **Dynamic Google Sheets DB API** into Google Apps Script, step‑by‑step. Each section below is presented like an individual `.md` file so you can copy/paste or export them separately.

---

# File: 01-README.md

## What this is

A lightweight **REST-like API** built with Google Apps Script that uses a single Google Spreadsheet as a multi-table database. Each table/entity (Products, Sales, Purchases, Suppliers, Settings) lives in its own sheet (tab). The API supports automatic sheet creation, CRUD operations, auto timestamps, and simple filters.

## Files in this guide

- `01-README.md` — This overview.
- `02-setup-spreadsheet.md` — Create the spreadsheet and get its ID.
- `03-apps-script-project.md` — Create Apps Script project and paste code.
- `04-deploy-test.md` — Deploy web app and test endpoints.
- `05-full-code.md` — The full Apps Script source code.
- `06-examples.md` — cURL / fetch / Node examples.
- `07-best-practices.md` — Security, backups, pagination, etc.
- `08-reports.md` — How to add a report endpoint.

---

# File: 02-setup-spreadsheet.md

## 1) Create a new Google Spreadsheet

1. Go to Google Drive → New → Google Sheets → Blank spreadsheet.
2. Rename the spreadsheet (e.g., `Inventory-DB`).

## 2) Get the Spreadsheet ID

The sheet URL looks like:

```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0
```

Copy the part labeled `SPREADSHEET_ID` — you'll paste it into the Apps Script code later.

## 3) (Optional) Add a default sheet named `Products`

You can optionally add a sheet tab `Products` to visually inspect data while developing. The code has an `initializeSheets()` helper that will create and populate any missing sheets for you.

---

# File: 03-apps-script-project.md

## 1) Open Apps Script

1. With your spreadsheet open, go to `Extensions` → `Apps Script`.
2. A new Apps Script project will open (linked to this spreadsheet). If you prefer a standalone script, create it from script.google.com and use `SpreadsheetApp.openById(SPREADSHEET_ID)`.

## 2) Add the code

1. In the Apps Script editor replace the default `Code.gs` content with the full code from `05-full-code.md`.
2. Replace `const SPREADSHEET_ID = 'SHEET-ID-HERE';` with the Spreadsheet ID you copied earlier.

## 3) Manual initialization (optional but recommended)

- Run the `initializeSheets()` function from the Apps Script editor (select function, then click ▶ Run). This creates all schema sheets with headers so you can inspect them.

> When you run the first time, Apps Script will ask for authorization. Accept the prompts (the script needs permission to read/write the spreadsheet).

---

# File: 04-deploy-test.md

## 1) Deploy as a Web App

1. In Apps Script editor, click **Deploy** → **New deployment**.
2. Choose **Web app** as the deployment type.
3. Set:
   - **Description:** e.g. `Inventory API v1`
   - **Execute as:** `Me` (this runs under your account so the script can access the spreadsheet)
   - **Who has access:** `Anyone` or `Anyone with link` (choose according to security requirements)
4. Click **Deploy** and **Authorize** if prompted.
5. Copy the **Web app URL** — this is your API endpoint (example: `https://script.google.com/macros/s/AKfyc.../exec`).

### Note on security
If you set access to `Anyone, even anonymous`, anyone with the URL can call the API. Consider using a secret API key in the request body or header and validating it server-side if you need simple protection. For production, you may want a proper authentication strategy.

## 2) Quick test with browser

Open in your browser:

```
GET https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?sheet=Products
```

You should get an empty array `[]` (or existing rows) as JSON.

## 3) Example curl test

```bash
curl "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?sheet=Products"
```

---

# File: 05-full-code.md

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

---

# File: 06-examples.md

## cURL examples

### List products

```bash
curl "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?sheet=Products"
```

### Create a product

```bash
curl -X POST "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec" \
  -H 'Content-Type: application/json' \
  -d '{"sheet":"Products","name":"Silk Saree","category":"Sarees","quantity":10,"costPrice":500,"sellingPrice":900}'
```

### Update a product

```bash
curl -X PUT "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec" \
  -H 'Content-Type: application/json' \
  -d '{"sheet":"Products","id":"<UUID>","quantity":8}'
```

### Delete a product

```bash
curl -X DELETE "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?sheet=Products&id=<UUID>"
```

## Fetch from browser (GET)

```js
// GET all products
fetch('https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?sheet=Products')
  .then(r => r.json())
  .then(data => console.log(data));
```

### POST from fetch (server-to-server recommended for CORS reasons)

```js
fetch('https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ sheet: 'Products', name: 'Cotton Saree', quantity: 5, costPrice: 300, sellingPrice: 600 })
})
  .then(r => r.json())
  .then(res => console.log(res));
```

> Note: Browser `fetch` sometimes runs into CORS issues calling Apps Script web apps. If you see CORS errors, either call the Apps Script endpoint server-side (Node), or use JSONP for GET requests (`?callback=cbName`) — the script supports JSONP for GET.

---

# File: 07-best-practices.md

## Security

- **Protect your endpoint**: Use a shared secret query param or header and validate it in the script for write operations. Example: expect `x-api-key` header or `?key=...` param.
- **Do not set "Anyone on the internet" in production** unless you secure it.

## Data integrity

- Avoid concurrent writes from many clients; Sheets isn't designed for heavy concurrent writes.
- Consider batching updates when possible.

## Backups

- Periodically export the spreadsheet (manually or with Apps Script) to CSV/JSON and store offsite.
- Use `DriveApp` to copy the spreadsheet programmatically for snapshots.

## Performance

- Minimize calls to `getRange().setValue()` in loops. Batch writes using `setValues()` when updating many cells.

## Pagination & Indexes

- Implement `limit` and `offset` (already present in example) to avoid huge payloads.
- If you need fast lookups by `id`, maintain an index sheet mapping id -> rowNumber to avoid scanning all rows.

---

# File: 08-reports.md

## Adding a summary report endpoint

You can add a `?action=report&type=summary` query to `doGet` and compute totals:

- `totalProducts` — number of product rows
- `totalStockValue` — sum(quantity * costPrice)
- `totalSales` — sum of sales totals
- `totalPurchases` — sum of purchase totals
- `topSellingProducts` — aggregate sales by productId
- `lowStockItems` — products where `quantity <= lowStockThreshold`

### Example stub (to add into the main code)

```javascript
function generateSummaryReport() {
  // read Products, Sales, Purchases sheets, aggregate values and return report object
}
```

Call it from `doGet` when `e.parameter.action === 'report'` and `e.parameter.type === 'summary'`.

---


---

*End of multi-file guide.*

If you want, I can now:

- Export each section as separate `.md` files and provide them in a zip.
- Add an `API key` check to the code.
- Implement the `generateSummaryReport()` function and wire a `/report` query.

Tell me which of the above you'd like next.

