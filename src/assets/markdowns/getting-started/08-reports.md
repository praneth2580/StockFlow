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