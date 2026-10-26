# Oracle migration

- [x] Inventory the website's database, accounts, order tracking, photos, and AI dependencies.
- [x] Prepare non-destructive server diagnostics and a staged migration checklist.
- [x] Confirm existing web services, local ports, and sufficient disk space. (Host Caddy on 80/443, operations-agent on 127.0.0.1:8000, 27 GB free, Compose v2.40.)
- [x] DuckDNS points to 167.234.215.78; Caddy site block a-restaurant.duckdns.org → 127.0.0.1:8090 added, HTTPS works (502 until app is deployed).
- [ ] Make source available on the server. Blocker: GitHub connection or a downloaded codebase, followed by server-side access.
- [ ] Preserve database and accounts. Blocker: user must obtain the Lovable Cloud database export through More → Database → Manage → Settings → Export data.
- [ ] Configure and verify isolated ARM64-compatible backend services and restore data. Blocker: server readiness and database export.
- [ ] Configure restaurant hostname, HTTPS, sign-in email delivery, and replacement meal-suggestion service. Blocker: existing proxy information, destination backend setup, email service configuration, and a replacement AI credential stored on the server.
- [ ] Verify guest and account ordering, admin access, pickup/delivery status, photos, and AI on Oracle before cutover. Blocker: destination deployment.
- [ ] Switch production only after verification and prepare rollback and independent backups. Blocker: verified destination.