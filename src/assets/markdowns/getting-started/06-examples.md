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
