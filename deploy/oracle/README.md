# Full Oracle hosting: preparation

Destination: `https://a-restaurant.duckdns.org`.

The live website has not been changed. This folder prepares a migration; it does not install services, restore data, or switch traffic.

## First actions

1. In Lovable, open **Project settings → Git** and connect GitHub. Keep the new repository private. Alternatively, use the available **Download codebase** control and transfer it to the server yourself.
2. In **More → Database → Manage → Settings → Export data**, select the Database export and start the export. Download it when ready. Keep it private: it contains customer records and account password hashes. Do not paste its contents into chat or commit it to GitHub.
3. On the Oracle server, run `bash deploy/oracle/preflight.sh` from a transferred copy of the source, or run the equivalent diagnostic commands provided in chat. Share only that diagnostic output, never passwords, tokens, Docker environment values, or the database export.

## Readiness constraints

- Ubuntu ARM64 requires verifying `linux/arm64` availability for every pinned image in the chosen backend release before installation.
- The official self-hosted backend guidance lists 2 CPU cores, 4 GB RAM, and 40 GB SSD as minimums; 4+ cores, 8+ GB RAM, and 80+ GB SSD are recommended. This server's 2 cores and approximately 12 GB RAM meet minimum CPU/RAM requirements, not a guarantee of restaurant capacity. Previously reported 27 GB free warrants more disk headroom before installing the full stack alongside existing services.
- Preserve the existing service on ports 80/443. Do not stop containers, overwrite Caddy configuration, or bind another proxy to those ports.
- Port 8000 is already occupied. Choose separate loopback ports only after examining the diagnostics. Never expose the database, admin console, or internal backend services publicly.
- Point the restaurant's DuckDNS record at the Oracle public address when the server is ready. Check both A and AAAA records; an incorrect IPv6 record can prevent HTTPS from working. No DNS or HTTPS checks have been performed yet.

## Migration sequence

1. Back up the existing server service and its configuration privately; confirm adequate disk and a separate backup destination.
2. Pin and verify an ARM64-compatible self-hosted backend stack, use a separate Compose project/network and persistent volumes, and configure new secrets locally on the server. Keep administration private.
3. Restore the full database export into the isolated destination using the restore procedure appropriate to the delivered export format and database versions. The export includes schema, data, users, and password hashes. Do not blindly replay historical app migrations after restoring schema and data.
4. Preserve `public.user_roles` and test server-validated admin access. Review the existing broad guest order-read policies before exposing the destination: a token-filtered browser query alone does not protect customer records.
5. Configure site URLs, sign-in redirects, email confirmation/recovery delivery, backend API and realtime access, and runtime secrets. Existing hosted configuration and managed secrets are not copied by the export.
6. Package and deploy the meal-suggestion function for the destination runtime. Replace calls to Lovable's AI gateway to achieve independence from Lovable services. Configure the replacement credential server-side; do not commit keys or expose them through Vite variables. No AI provider has been configured for Oracle yet.
7. Build the website on the destination with its own public `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` supplied at build time. The generated client must not be manually edited. Never supply a privileged backend key to frontend build variables.
8. Serve the static website behind the existing proxy and route backend API/realtime paths correctly, including WebSocket upgrades. Select exact hostnames/paths only after inspecting the existing service arrangement; do not assume an additional DuckDNS subdomain exists.
9. Verify actual destination flows: account sign-in, guest pickup and delivery orders, tracking-link readback, signed-in order history, admin status updates and cancellations, menu photos, catering, and meal suggestions. Test order privacy with unrelated accounts and without a session.
10. Cut over only after the destination passes these checks; keep the original website and a rollback path until confirmed. Plan a write freeze or final data synchronization so orders submitted during migration are not lost. Set up database and media backups to an independent location and test recovery.

## Photos and data

The repository has bundled images in `src/assets` and static menu photos in `public/menu`. Menu image references are also stored in the database; inspect those after restoring to detect external dependencies. The current Cloud storage inventory reports no buckets. If buckets are later added, their files must be downloaded separately through **More → Storage**; database exports do not include them.

## Official references

- https://docs.lovable.dev/tips-tricks/external-deployment-hosting
- https://docs.lovable.dev/features/database-backups
- https://docs.lovable.dev/integrations/github
- https://supabase.com/docs/guides/self-hosting/docker