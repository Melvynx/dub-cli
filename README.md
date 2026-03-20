# dub-cli

CLI for the [Dub.co](https://dub.co) API - manage short links, domains, analytics, and more. Made with [api2cli.dev](https://api2cli.dev).

## Install

```bash
npm i -g dub-cli
# or
npx dub-cli --help
```

Or via api2cli:

```bash
npx api2cli install Melvynx/dub-cli
```

## Setup

```bash
dub-cli auth set "your-dub-api-token"
dub-cli auth test
```

## Resources

| Resource | Actions |
|----------|---------|
| **links** | list, get, create, update, delete, upsert, count, bulk-create, bulk-update, bulk-delete |
| **domains** | list, create, update, delete, register |
| **tags** | list, create, update, delete |
| **folders** | list, create, update, delete |
| **customers** | list, get, update, delete |
| **analytics** | query (clicks, leads, sales with 20+ groupBy options) |
| **events** | list (clicks, leads, sales) |
| **track** | lead, sale |
| **partners** | list, create |
| **commissions** | list, update |
| **payouts** | list |
| **qr** | get |
| **metatags** | get |
| **tokens** | create-referral |

## Usage

```bash
# List links
dub-cli links list --json

# Create a short link
dub-cli links create --url "https://example.com" --domain mlv.sh --json

# Analytics
dub-cli analytics query --event clicks --group-by countries --interval 7d --json

# Track a sale
dub-cli track sale --customer-external-id usr_456 --amount 4999 --json
```

## Global Flags

All commands support: `--json`, `--format text|json|csv|yaml`, `--verbose`, `--no-color`, `--no-header`

## License

MIT
