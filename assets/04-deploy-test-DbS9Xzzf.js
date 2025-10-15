const e=`## 1) Deploy as a Web App\r
\r
1. In Apps Script editor, click **Deploy** → **New deployment**.\r
2. Choose **Web app** as the deployment type.\r
3. Set:\r
   - **Description:** e.g. \`Inventory API v1\`\r
   - **Execute as:** \`Me\` (this runs under your account so the script can access the spreadsheet)\r
   - **Who has access:** \`Anyone\` or \`Anyone with link\` (choose according to security requirements)\r
4. Click **Deploy** and **Authorize** if prompted.\r
5. Copy the **Web app URL** — this is your API endpoint (example: \`https://script.google.com/macros/s/AKfyc.../exec\`).\r
\r
### Note on security\r
If you set access to \`Anyone, even anonymous\`, anyone with the URL can call the API. Consider using a secret API key in the request body or header and validating it server-side if you need simple protection. For production, you may want a proper authentication strategy.\r
\r
## 2) Quick test with browser\r
\r
Open in your browser:\r
\r
\`\`\`\r
GET https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?sheet=Products\r
\`\`\`\r
\r
You should get an empty array \`[]\` (or existing rows) as JSON.\r
\r
## 3) Example curl test\r
\r
\`\`\`bash\r
curl "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?sheet=Products"\r
\`\`\``;export{e as default};
