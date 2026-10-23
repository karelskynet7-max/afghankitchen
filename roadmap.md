# Oracle migration

- [x] Inventory the website's database, accounts, order tracking, photos, and AI dependencies.
- [x] Prepare non-destructive server diagnostics and a staged migration checklist.
- [ ] Confirm existing web services, local ports, and sufficient disk space. Blocker: user must run the server diagnostics and provide their output.
- [ ] Make source available on the server. Blocker: GitHub connection or a downloaded codebase, followed by server-side access.
- [ ] Preserve database and accounts. Blocker: user must obtain the Lovable Cloud database export through More → Database → Manage → Settings → Export data.
- [ ] Configure and verify isolated ARM64-compatible backend services and restore data. Blocker: server readiness and database export.
- [ ] Configure restaurant hostname, HTTPS, sign-in email delivery, and replacement meal-suggestion service. Blocker: existing proxy information, destination backend setup, email service configuration, and a replacement AI credential stored on the server.
- [ ] Verify guest and account ordering, admin access, pickup/delivery status, photos, and AI on Oracle before cutover. Blocker: destination deployment.
- [ ] Switch production only after verification and prepare rollback and independent backups. Blocker: verified destination.