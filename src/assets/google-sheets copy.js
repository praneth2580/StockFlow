/**
 * Dynamic Google Sheets DB API
 * Supports multiple sheets (auto-create) and CRUD operations.
 */

const SPREADSHEET_ID = 'SHEET-ID-HERE'; // put your sheet id here
const DEFAULT_SHEET = 'Sheet1'; // fallback if no sheet param

// Utility: Get or create a sheet
function getOrCreateSheet(sheetName, headers = ['id', 'name', 'email']) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
    Logger.log(`Created new sheet: ${sheetName}`);
  }
  return sheet;
}

function doGet(e) {
  const sheetName = e.parameter.sheet || DEFAULT_SHEET;
  const sheet = getOrCreateSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const rows = data.map(r => Object.fromEntries(headers.map((h, i) => [h, r[i]])));

  if (e.parameter.id) {
    const record = rows.find(r => String(r.id) === String(e.parameter.id));
    return respond(record || {});
  }

  // Optional filter by field, e.g., ?name=Bob
  const filters = Object.entries(e.parameter).filter(([k]) => k !== 'sheet' && k !== 'id');
  let filtered = rows;
  if (filters.length) {
    filtered = rows.filter(r => filters.every(([key, val]) => String(r[key]) === String(val)));
  }

  return respond(filtered);
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  const sheetName = body.sheet || DEFAULT_SHEET;
  const sheet = getOrCreateSheet(sheetName);

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const lastRow = sheet.getLastRow();
  const nextId = lastRow >= 2 ? sheet.getRange(lastRow, 1).getValue() + 1 : 1;
  body.id = body.id || nextId;

  const newRow = headers.map(h => body[h] || '');
  sheet.appendRow(newRow);
  return respond({ status: 'success', id: body.id, sheet: sheetName });
}

function doPut(e) {
  const body = JSON.parse(e.postData.contents);
  const sheetName = body.sheet || DEFAULT_SHEET;
  const sheet = getOrCreateSheet(sheetName);
  const id = String(body.id);

  const data = sheet.getDataRange().getValues();
  const headers = data.shift();

  for (let i = 0; i < data.length; i++) {
    if (String(data[i][0]) === id) {
      headers.forEach((h, j) => {
        if (body[h] !== undefined) sheet.getRange(i + 2, j + 1).setValue(body[h]);
      });
      return respond({ status: 'updated', id, sheet: sheetName });
    }
  }

  return respond({ error: 'ID not found', sheet: sheetName });
}

function doDelete(e) {
  const sheetName = e.parameter.sheet || DEFAULT_SHEET;
  const sheet = getOrCreateSheet(sheetName);
  const id = String(e.parameter.id);

  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === id) {
      sheet.deleteRow(i + 1);
      return respond({ status: 'deleted', id, sheet: sheetName });
    }
  }

  return respond({ error: 'ID not found', sheet: sheetName });
}

// Utility: respond with JSON
function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
