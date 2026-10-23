# Project conventions

- Keep external Oracle deployment preparation under `deploy/oracle`, separate from the running website and managed Cloud configuration, so preparing a migration cannot switch or disrupt the current service.