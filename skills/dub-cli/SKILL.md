---
name: dub-cli
description: >-
  Manage Dub.co via CLI - links, domains, tags, folders, customers, analytics,
  events, track, partners, commissions, payouts, qr, metatags, tokens.
  Use when user mentions 'dub', 'shorten URL', 'create short link',
  'link analytics', 'short link', 'mlv.sh', 'dub.co', 'tracking link',
  'affiliate partners', 'QR code', or any URL shortening task.
category: analytics
---

# dub-cli

> **DESTRUCTIVE ACTIONS WARNING**
> NEVER execute delete actions without explicit user permission:
> - `links delete`, `links bulk-delete`, `domains delete`, `folders delete`, `customers delete`, `tags delete`
> Always ask for confirmation before deleting.

## Tracking Link Conventions (MUST FOLLOW)

When creating a **tracking link**:

1. **Random slug**: Omit `--key` to let Dub auto-generate a random short slug
2. **Domain**: Always use `--domain mlv.sh`
3. **Tags by context**:
   - YouTube -> `--tag-ids clup4xbrx0008gjmffrqnbhvj`
   - Social media (Typefully) -> `--tag-ids tag_1KDHAHQ1N6PYH3XFHGJAFRSYN`
4. **UTM params**: Always set `--utm-source` and `--utm-medium`:
   - YouTube: `--utm-source youtube --utm-medium description`
   - LinkedIn: `--utm-source linkedin --utm-medium social`
   - Twitter: `--utm-source twitter --utm-medium social`
   - Typefully: `--utm-source typefully --utm-medium social`
5. **Folders**:
   - YouTube CTA links -> `--folder-id fold_1KE5QB4D1GCWZ0SD5FXJ7ETPB`
   - General CTA links -> `--folder-id fold_1KDCFN54RRPWBNQNNXRND6RAX`

## Setup

```bash
bun --version || curl -fsSL https://bun.sh/install | bash
npx api2cli bundle dub
npx api2cli link dub
```

Always use `--json` flag when calling commands programmatically.

## Authentication

```bash
dub-cli auth set "your-token"
dub-cli auth test
dub-cli auth show
dub-cli auth remove
```

## Resources

### links

| Command | Description |
|---------|-------------|
| `dub-cli links list --json` | List all links |
| `dub-cli links list --domain mlv.sh --search blog --json` | Search links by domain |
| `dub-cli links list --tag-ids tag_123 --folder-id fold_123 --json` | Filter by tag and folder |
| `dub-cli links list --sort clicks --sort-order desc --page-size 10 --json` | Sort by clicks |
| `dub-cli links get --link-id clx123 --json` | Get link by ID |
| `dub-cli links get --domain mlv.sh --key my-slug --json` | Get link by domain+key |
| `dub-cli links get --external-id ext_123 --json` | Get link by external ID |
| `dub-cli links create --url "https://example.com" --domain mlv.sh --json` | Create a short link |
| `dub-cli links create --url "https://example.com" --domain mlv.sh --tag-ids tag1,tag2 --utm-source youtube --utm-medium description --json` | Create with tags and UTM |
| `dub-cli links create --url "https://example.com" --track-conversion --json` | Create with conversion tracking |
| `dub-cli links update clx123 --url "https://new-url.com" --json` | Update link URL |
| `dub-cli links update clx123 --key new-slug --archived --json` | Update slug and archive |
| `dub-cli links delete clx123 --json` | Delete a link |
| `dub-cli links upsert --url "https://example.com" --key my-link --json` | Create or update by URL |
| `dub-cli links count --json` | Count all links |
| `dub-cli links count --domain mlv.sh --group-by domain --json` | Count grouped by domain |
| `dub-cli links bulk-create --data '[{"url":"https://a.com"},{"url":"https://b.com"}]' --json` | Bulk create (max 100) |
| `dub-cli links bulk-update --data '{"linkIds":["id1"],"data":{"archived":true}}' --json` | Bulk update |
| `dub-cli links bulk-delete --link-ids id1,id2 --json` | Bulk delete |

### domains

| Command | Description |
|---------|-------------|
| `dub-cli domains list --json` | List all domains |
| `dub-cli domains create --slug example.com --json` | Add a custom domain |
| `dub-cli domains create --slug example.com --expired-url "https://fallback.com" --not-found-url "https://404.com" --json` | Create with redirects |
| `dub-cli domains update example.com --expired-url "https://new.com" --json` | Update domain |
| `dub-cli domains delete example.com --json` | Delete domain (irreversible) |
| `dub-cli domains register --domain myapp.link --json` | Register .link domain (Enterprise) |

### tags

| Command | Description |
|---------|-------------|
| `dub-cli tags list --json` | List all tags |
| `dub-cli tags list --search marketing --sort createdAt --json` | Search and sort tags |
| `dub-cli tags create --name "Marketing" --color blue --json` | Create a tag |
| `dub-cli tags update tag_123 --name "New Name" --color green --json` | Update a tag |
| `dub-cli tags delete tag_123 --json` | Delete a tag |

### folders

| Command | Description |
|---------|-------------|
| `dub-cli folders list --json` | List all folders |
| `dub-cli folders list --search campaign --json` | Search folders |
| `dub-cli folders create --name "Campaign" --description "Q1 links" --access-level write --json` | Create a folder |
| `dub-cli folders update fold_123 --name "New Name" --json` | Update a folder |
| `dub-cli folders delete fold_123 --json` | Delete a folder |

### customers

| Command | Description |
|---------|-------------|
| `dub-cli customers list --json` | List all customers |
| `dub-cli customers get cust_123 --json` | Get customer by ID |
| `dub-cli customers update cust_123 --name "John" --email "john@test.com" --json` | Update customer |
| `dub-cli customers delete cust_123 --json` | Delete customer |

### analytics

| Command | Description |
|---------|-------------|
| `dub-cli analytics query --event clicks --group-by count --json` | Total click count |
| `dub-cli analytics query --event clicks --group-by timeseries --interval 7d --json` | Click timeseries (7 days) |
| `dub-cli analytics query --event clicks --group-by countries --interval 30d --json` | Clicks by country |
| `dub-cli analytics query --event clicks --group-by devices --json` | Clicks by device |
| `dub-cli analytics query --event clicks --group-by top_links --interval 30d --json` | Top links by clicks |
| `dub-cli analytics query --event sales --group-by top_links --json` | Top links by sales |
| `dub-cli analytics query --event clicks --group-by utm_sources --json` | Clicks by UTM source |
| `dub-cli analytics query --link-id clx123 --group-by browsers --json` | Analytics for specific link |

### events

| Command | Description |
|---------|-------------|
| `dub-cli events list --json` | List recent click events |
| `dub-cli events list --event sales --interval 30d --json` | List sale events |
| `dub-cli events list --event leads --link-id clx123 --json` | Lead events for a link |

### track

| Command | Description |
|---------|-------------|
| `dub-cli track lead --click-id clk_123 --event-name "Sign up" --customer-external-id usr_456 --json` | Track a lead |
| `dub-cli track sale --customer-external-id usr_456 --amount 4999 --json` | Track a sale |
| `dub-cli track sale --customer-external-id usr_456 --amount 9900 --currency usd --payment-processor stripe --json` | Track sale with processor |

### partners

| Command | Description |
|---------|-------------|
| `dub-cli partners list --json` | List all partners |
| `dub-cli partners list --status approved --sort totalClicks --json` | Filter approved partners |
| `dub-cli partners create --email "john@test.com" --name "John" --country US --json` | Create/upsert partner |

### commissions

| Command | Description |
|---------|-------------|
| `dub-cli commissions list --json` | List all commissions |
| `dub-cli commissions update com_123 --status approved --json` | Update commission status |

### payouts

| Command | Description |
|---------|-------------|
| `dub-cli payouts list --json` | List all payouts |

### qr

| Command | Description |
|---------|-------------|
| `dub-cli qr get --url "https://dub.sh/github" --json` | Generate QR code |
| `dub-cli qr get --url "https://example.com" --size 300 --json` | QR code with custom size |

### metatags

| Command | Description |
|---------|-------------|
| `dub-cli metatags get --url "https://example.com" --json` | Get OG metatags for URL |

### tokens

| Command | Description |
|---------|-------------|
| `dub-cli tokens create-referral --json` | Create referrals embed token |

## Quick Reference

```bash
dub-cli --help                        # List all resources
dub-cli <resource> --help             # List actions for a resource
dub-cli <resource> <action> --help    # Show flags for an action
```

## Output Format

`--json` returns a standardized envelope:
```json
{ "ok": true, "data": { ... }, "meta": { "total": 42 } }
```

On error: `{ "ok": false, "error": { "message": "...", "status": 401 } }`

## Global Flags

All commands support: `--json`, `--format text|json|csv|yaml`, `--verbose`, `--no-color`, `--no-header`

Exit codes: 0 = success, 1 = API error, 2 = usage error
