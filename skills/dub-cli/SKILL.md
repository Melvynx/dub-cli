---
name: dub
description: "Manage Dub via CLI - links, domains, tags, folders, customers, analytics. Use when user mentions 'dub', 'short link', 'shorten url', 'link analytics', 'dub.co', or wants to interact with the Dub API."
category: link-management
---

# dub-cli

## Setup

If `dub-cli` is not found, install and build it:
```bash
bun --version || curl -fsSL https://bun.sh/install | bash
npx api2cli bundle dub
npx api2cli link dub
```

`api2cli link` adds `~/.local/bin` to PATH automatically. The CLI is available in the next command.

Always use `--json` flag when calling commands programmatically.

## Authentication

```bash
dub-cli auth set "your-token"
dub-cli auth test
```

## Resources

### links

| Command | Description |
|---------|-------------|
| `dub-cli links list --json` | List all short links |
| `dub-cli links list --domain dub.sh --json` | List links by domain |
| `dub-cli links list --search blog --page-size 10 --json` | Search and filter links |
| `dub-cli links list --tag-id tag_123 --json` | List links by tag |
| `dub-cli links list --sort clicks --json` | List sorted by clicks |
| `dub-cli links get --link-id clx1234 --json` | Get link details by ID |
| `dub-cli links get --domain dub.sh --key my-link --json` | Get link by domain and slug |
| `dub-cli links get --external-id ext_123 --json` | Get link by external ID |
| `dub-cli links create --url https://example.com --json` | Create short link |
| `dub-cli links create --url https://example.com --domain dub.sh --key my-link --json` | Create with custom slug |
| `dub-cli links create --url https://example.com --tag-ids tag1,tag2 --json` | Create with tags |
| `dub-cli links create --url https://example.com --expires-at 2026-12-31T23:59:59Z --json` | Create with expiration |
| `dub-cli links create --url https://example.com --password secret --json` | Create password-protected |
| `dub-cli links create --url https://example.com --archived --json` | Create archived link |
| `dub-cli links update clx1234 --url https://new-url.com --json` | Update link destination |
| `dub-cli links update clx1234 --key new-slug --json` | Update link slug |
| `dub-cli links update clx1234 --tag-ids tag1,tag2 --json` | Update link tags |
| `dub-cli links delete clx1234 --json` | Delete a link |
| `dub-cli links upsert --url https://example.com --key my-link --json` | Create or update link |
| `dub-cli links count --json` | Count total links |
| `dub-cli links count --domain dub.sh --json` | Count links by domain |
| `dub-cli links count --group-by domain --json` | Count grouped by domain |
| `dub-cli links bulk-create --data '[{"url":"https://example.com"}]' --json` | Bulk create links |
| `dub-cli links bulk-update --data '{"linkIds":["id1"],"url":"https://new.com"}' --json` | Bulk update links |
| `dub-cli links bulk-delete --link-ids id1,id2,id3 --json` | Bulk delete links |

### domains

| Command | Description |
|---------|-------------|
| `dub-cli domains list --json` | List all custom domains |
| `dub-cli domains create --slug example.com --json` | Create custom domain |
| `dub-cli domains create --slug example.com --target https://mysite.com --json` | Create with target URL |
| `dub-cli domains create --slug example.com --type rewrite --json` | Create rewrite domain |
| `dub-cli domains create --slug example.com --placeholder https://fallback.com --json` | Create with placeholder |
| `dub-cli domains update example.com --target https://new-site.com --json` | Update domain target |
| `dub-cli domains update example.com --type rewrite --json` | Update domain type |
| `dub-cli domains delete example.com --json` | Delete domain |

### tags

| Command | Description |
|---------|-------------|
| `dub-cli tags list --json` | List all tags |
| `dub-cli tags create --name "Marketing" --json` | Create new tag |
| `dub-cli tags create --name "Blog" --color blue --json` | Create tag with color |
| `dub-cli tags update clx1234 --name "New Name" --json` | Update tag name |
| `dub-cli tags update clx1234 --color green --json` | Update tag color |

### folders

| Command | Description |
|---------|-------------|
| `dub-cli folders list --json` | List all folders |
| `dub-cli folders create --name "Marketing" --json` | Create new folder |
| `dub-cli folders update fold_1234 --name "Renamed" --json` | Update folder name |
| `dub-cli folders delete fold_1234 --json` | Delete folder |

### customers

| Command | Description |
|---------|-------------|
| `dub-cli customers list --json` | List all customers |
| `dub-cli customers get cust_1234 --json` | Get customer details |
| `dub-cli customers update cust_1234 --name "John Doe" --json` | Update customer name |
| `dub-cli customers update cust_1234 --email john@example.com --json` | Update customer email |
| `dub-cli customers delete cust_1234 --json` | Delete customer |

### analytics

| Command | Description |
|---------|-------------|
| `dub-cli analytics query --event clicks --group-by timeseries --interval 7d --json` | Query analytics by time |
| `dub-cli analytics query --event clicks --group-by country --json` | Query analytics by country |
| `dub-cli analytics query --event clicks --group-by top_links --interval 30d --json` | Get top links by clicks |
| `dub-cli analytics query --event sales --group-by top_urls --json` | Get top URLs by sales |
| `dub-cli analytics query --event clicks --domain dub.sh --json` | Filter by domain |
| `dub-cli analytics query --event clicks --link-id clx1234 --json` | Filter by link ID |
| `dub-cli analytics query --event clicks --tag-id tag_123 --json` | Filter by tag |
| `dub-cli analytics query --event clicks --country US --json` | Filter by country |
| `dub-cli analytics events --event clicks --interval 7d --json` | List events |
| `dub-cli analytics events --link-id clx1234 --limit 10 --json` | List events for link |
| `dub-cli analytics track-lead --click-id clk_123 --event-name "Sign up" --json` | Track lead conversion |
| `dub-cli analytics track-lead --click-id clk_123 --event-name "Sign up" --customer-email user@test.com --json` | Track with customer |
| `dub-cli analytics track-sale --click-id clk_123 --event-name "Purchase" --amount 4999 --json` | Track sale conversion |
| `dub-cli analytics track-sale --click-id clk_123 --event-name "Purchase" --amount 4999 --currency usd --json` | Track with currency |
| `dub-cli analytics track-sale --click-id clk_123 --event-name "Purchase" --amount 4999 --payment-processor stripe --json` | Track with processor |

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
