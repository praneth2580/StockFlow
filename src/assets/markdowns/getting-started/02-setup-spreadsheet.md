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
