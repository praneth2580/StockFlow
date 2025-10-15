const e=`## 1) Open Apps Script\r
\r
1. With your spreadsheet open, go to \`Extensions\` → \`Apps Script\`.\r
2. A new Apps Script project will open (linked to this spreadsheet). If you prefer a standalone script, create it from script.google.com and use \`SpreadsheetApp.openById(SPREADSHEET_ID)\`.\r
\r
## 2) Add the code\r
\r
1. In the Apps Script editor replace the default \`Code.gs\` content with the full code from \`05-full-code.md\`.\r
2. Replace \`const SPREADSHEET_ID = 'SHEET-ID-HERE';\` with the Spreadsheet ID you copied earlier.\r
\r
## 3) Manual initialization (optional but recommended)\r
\r
- Run the \`initializeSheets()\` function from the Apps Script editor (select function, then click ▶ Run). This creates all schema sheets with headers so you can inspect them.\r
\r
> When you run the first time, Apps Script will ask for authorization. Accept the prompts (the script needs permission to read/write the spreadsheet).\r
`;export{e as default};
