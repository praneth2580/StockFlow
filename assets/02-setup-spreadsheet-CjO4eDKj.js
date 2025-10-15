const e=`## 1) Create a new Google Spreadsheet\r
\r
1. Go to Google Drive → New → Google Sheets → Blank spreadsheet.\r
2. Rename the spreadsheet (e.g., \`Inventory-DB\`).\r
\r
## 2) Get the Spreadsheet ID\r
\r
The sheet URL looks like:\r
\r
\`\`\`\r
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit#gid=0\r
\`\`\`\r
\r
Copy the part labeled \`SPREADSHEET_ID\` — you'll paste it into the Apps Script code later.\r
\r
## 3) (Optional) Add a default sheet named \`Products\`\r
\r
You can optionally add a sheet tab \`Products\` to visually inspect data while developing. The code has an \`initializeSheets()\` helper that will create and populate any missing sheets for you.\r
`;export{e as default};
