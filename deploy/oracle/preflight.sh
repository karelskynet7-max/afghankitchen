#!/usr/bin/env bash
# Read-only server checks. No installs, configuration changes, or secret reads.
set -u

section() { printf '\n=== %s ===\n' "$1"; }

# Use existing privileges when possible. Never request a password or change access.
privileged_read() {
  if [ "$(id -u)" -eq 0 ]; then
    "$@"
  elif command -v sudo >/dev/null 2>&1 && sudo -n true 2>/dev/null; then
    sudo -n "$@"
  else
    "$@"
  fi
}

section 'ARCHITECTURE AND AVAILABLE MEMORY'
uname -m
getconf _NPROCESSORS_ONLN
free -h

section 'AVAILABLE DISK SPACE'
df -h / /var/lib/docker 2>/dev/null || df -h /
if command -v lsblk >/dev/null 2>&1; then
  lsblk -o NAME,SIZE,TYPE,MOUNTPOINTS
fi

section 'PORT OWNERS (NO PROCESS COMMAND LINES)'
if command -v ss >/dev/null 2>&1; then
  privileged_read ss -ltnp | grep -E 'State|:(80|443|8000|8080|8443|5432)\b' || true
else
  printf 'ss is unavailable.\n'
fi

section 'DOCKER VERSION AND CURRENT CONTAINER PORTS'
if command -v docker >/dev/null 2>&1; then
  docker --version
  docker compose version 2>/dev/null || printf 'Docker Compose v2 unavailable to this user.\n'
  privileged_read docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}' || printf 'Could not list containers.\n'
  privileged_read docker system df || printf 'Could not read Docker disk usage.\n'
else
  printf 'Docker is not installed.\n'
fi

section 'HOST CADDY STATUS'
if command -v systemctl >/dev/null 2>&1; then
  systemctl is-active caddy 2>/dev/null || true
fi
if command -v caddy >/dev/null 2>&1; then
  caddy version 2>/dev/null || printf 'Could not read Caddy version.\n'
fi

section 'RESTAURANT DNS AS SEEN FROM THIS SERVER'
getent ahostsv4 a-restaurant.duckdns.org || printf 'No IPv4 address resolved.\n'
getent ahostsv6 a-restaurant.duckdns.org || printf 'No IPv6 address resolved.\n'

printf '\nRead-only checks complete. Share this output only; do not share passwords, keys, configuration contents, or database exports.\n'