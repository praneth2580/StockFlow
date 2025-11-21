const e=`## 1) Open Apps Script

1. With your spreadsheet open, go to \`Extensions\` → \`Apps Script\`.
2. A new Apps Script project will open (linked to this spreadsheet). If you prefer a standalone script, create it from script.google.com and use \`SpreadsheetApp.openById(SPREADSHEET_ID)\`.

## 2) Add the code

1. In the Apps Script editor replace the default \`Code.gs\` content with the full code from \`05-full-code.md\`.
2. Replace \`const SPREADSHEET_ID = 'SHEET-ID-HERE';\` with the Spreadsheet ID you copied earlier.

## 3) Manual initialization (optional but recommended)

- Run the \`initializeSheets()\` function from the Apps Script editor (select function, then click ▶ Run). This creates all schema sheets with headers so you can inspect them.

> When you run the first time, Apps Script will ask for authorization. Accept the prompts (the script needs permission to read/write the spreadsheet).
`;export{e as default};
