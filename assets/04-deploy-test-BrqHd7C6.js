const e=`## 1) Deploy as a Web App

1. In Apps Script editor, click **Deploy** → **New deployment**.
2. Choose **Web app** as the deployment type.
3. Set:
   - **Description:** e.g. \`Inventory API v1\`
   - **Execute as:** \`Me\` (this runs under your account so the script can access the spreadsheet)
   - **Who has access:** \`Anyone\` or \`Anyone with link\` (choose according to security requirements)
4. Click **Deploy** and **Authorize** if prompted.
5. Copy the **Web app URL** — this is your API endpoint (example: \`https://script.google.com/macros/s/AKfyc.../exec\`).

### Note on security
If you set access to \`Anyone, even anonymous\`, anyone with the URL can call the API. Consider using a secret API key in the request body or header and validating it server-side if you need simple protection. For production, you may want a proper authentication strategy.

## 2) Quick test with browser

Open in your browser:

\`\`\`
GET https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?sheet=Products
\`\`\`

You should get an empty array \`[]\` (or existing rows) as JSON.

## 3) Example curl test

\`\`\`bash
curl "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?sheet=Products"
\`\`\``;export{e as default};
