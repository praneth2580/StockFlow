## Security

- **Protect your endpoint**: Use a shared secret query param or header and validate it in the script for write operations. Example: expect `x-api-key` header or `?key=...` param.
- **Do not set "Anyone on the internet" in production** unless you secure it.

## Data integrity

- Avoid concurrent writes from many clients; Sheets isn't designed for heavy concurrent writes.
- Consider batching updates when possible.

## Backups

- Periodically export the spreadsheet (manually or with Apps Script) to CSV/JSON and store offsite.
- Use `DriveApp` to copy the spreadsheet programmatically for snapshots.

## Performance

- Minimize calls to `getRange().setValue()` in loops. Batch writes using `setValues()` when updating many cells.

## Pagination & Indexes

- Implement `limit` and `offset` (already present in example) to avoid huge payloads.
- If you need fast lookups by `id`, maintain an index sheet mapping id -> rowNumber to avoid scanning all rows.
