const r=`## cURL examples\r
\r
### List products\r
\r
\`\`\`bash\r
curl "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?sheet=Products"\r
\`\`\`\r
\r
### Create a product\r
\r
\`\`\`bash\r
curl -X POST "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec" \\\r
  -H 'Content-Type: application/json' \\\r
  -d '{"sheet":"Products","name":"Silk Saree","category":"Sarees","quantity":10,"costPrice":500,"sellingPrice":900}'\r
\`\`\`\r
\r
### Update a product\r
\r
\`\`\`bash\r
curl -X PUT "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec" \\\r
  -H 'Content-Type: application/json' \\\r
  -d '{"sheet":"Products","id":"<UUID>","quantity":8}'\r
\`\`\`\r
\r
### Delete a product\r
\r
\`\`\`bash\r
curl -X DELETE "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?sheet=Products&id=<UUID>"\r
\`\`\`\r
\r
## Fetch from browser (GET)\r
\r
\`\`\`js\r
// GET all products\r
fetch('https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?sheet=Products')\r
  .then(r => r.json())\r
  .then(data => console.log(data));\r
\`\`\`\r
\r
### POST from fetch (server-to-server recommended for CORS reasons)\r
\r
\`\`\`js\r
fetch('https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec', {\r
  method: 'POST',\r
  headers: { 'Content-Type': 'application/json' },\r
  body: JSON.stringify({ sheet: 'Products', name: 'Cotton Saree', quantity: 5, costPrice: 300, sellingPrice: 600 })\r
})\r
  .then(r => r.json())\r
  .then(res => console.log(res));\r
\`\`\`\r
\r
> Note: Browser \`fetch\` sometimes runs into CORS issues calling Apps Script web apps. If you see CORS errors, either call the Apps Script endpoint server-side (Node), or use JSONP for GET requests (\`?callback=cbName\`) — the script supports JSONP for GET.\r
`;export{r as default};
