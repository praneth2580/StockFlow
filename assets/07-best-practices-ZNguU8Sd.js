const e=`## Security\r
\r
- **Protect your endpoint**: Use a shared secret query param or header and validate it in the script for write operations. Example: expect \`x-api-key\` header or \`?key=...\` param.\r
- **Do not set "Anyone on the internet" in production** unless you secure it.\r
\r
## Data integrity\r
\r
- Avoid concurrent writes from many clients; Sheets isn't designed for heavy concurrent writes.\r
- Consider batching updates when possible.\r
\r
## Backups\r
\r
- Periodically export the spreadsheet (manually or with Apps Script) to CSV/JSON and store offsite.\r
- Use \`DriveApp\` to copy the spreadsheet programmatically for snapshots.\r
\r
## Performance\r
\r
- Minimize calls to \`getRange().setValue()\` in loops. Batch writes using \`setValues()\` when updating many cells.\r
\r
## Pagination & Indexes\r
\r
- Implement \`limit\` and \`offset\` (already present in example) to avoid huge payloads.\r
- If you need fast lookups by \`id\`, maintain an index sheet mapping id -> rowNumber to avoid scanning all rows.\r
`;export{e as default};
