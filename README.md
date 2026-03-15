# dub-cli

CLI for the [Dub.co](https://dub.co) API - manage short links, domains, tags, and analytics. Made with [api2cli.dev](https://api2cli.dev).

## Install

```bash
npx api2cli install Melvynx/dub-cli
```

This clones the repo, builds the CLI, links it to your PATH, and installs the AgentSkill to your coding agents.

## Install AgentSkill only

```bash
npx skills add Melvynx/dub-cli
```

## Auth

```bash
dub-cli auth set <token>       # Save your API token
dub-cli auth show              # Display current token (masked)
dub-cli auth show --raw        # Display full unmasked token
dub-cli auth remove            # Delete saved token
dub-cli auth test              # Verify token with a test API call
```

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`

## Links

```bash
# List links
dub-cli links list
dub-cli links list --domain example.com --search blog --sort clicks --page-size 10

# Get a link
dub-cli links get --link-id clx1234
dub-cli links get --domain dub.sh --key my-link
dub-cli links get --external-id ext_123

# Create a link
dub-cli links create --url https://example.com
dub-cli links create --url https://example.com --domain dub.sh --key my-link --tag-ids tag1,tag2

# Update a link
dub-cli links update clx1234 --url https://new-url.com
dub-cli links update clx1234 --key new-slug --archived

# Delete a link
dub-cli links delete clx1234

# Upsert (create or update by URL)
dub-cli links upsert --url https://example.com --key my-link

# Count links
dub-cli links count --domain example.com --group-by domain

# Bulk operations
dub-cli links bulk-create --data '[{"url":"https://example.com"},{"url":"https://other.com"}]'
dub-cli links bulk-update --data '{"linkIds":["id1","id2"],"url":"https://new.com"}'
dub-cli links bulk-delete --link-ids id1,id2,id3
```

## Domains

```bash
# List domains
dub-cli domains list

# Create a domain
dub-cli domains create --slug example.com
dub-cli domains create --slug example.com --target https://mysite.com --type redirect

# Update a domain
dub-cli domains update example.com --target https://new-site.com
dub-cli domains update example.com --type rewrite --expired-url https://fallback.com

# Delete a domain
dub-cli domains delete example.com
```

## Tags

```bash
# List tags
dub-cli tags list

# Create a tag
dub-cli tags create --name "Marketing"
dub-cli tags create --name "Blog" --color blue

# Update a tag
dub-cli tags update clx1234 --name "New Name" --color green
```

## Folders

```bash
# List folders
dub-cli folders list

# Create a folder
dub-cli folders create --name "Marketing"

# Update a folder
dub-cli folders update fold_1234 --name "Renamed"

# Delete a folder
dub-cli folders delete fold_1234
```

## Customers

```bash
# List customers
dub-cli customers list

# Get a customer
dub-cli customers get cust_1234

# Update a customer
dub-cli customers update cust_1234 --name "John Doe" --email john@example.com

# Delete a customer
dub-cli customers delete cust_1234
```

## Analytics

```bash
# Query analytics
dub-cli analytics query --event clicks --group-by timeseries --interval 7d
dub-cli analytics query --event sales --group-by top_links --interval 30d
dub-cli analytics query --event clicks --group-by country --domain example.com

# Track a lead
dub-cli analytics track-lead --click-id clk_123 --event-name "Sign up"
dub-cli analytics track-lead --click-id clk_123 --event-name "Sign up" --customer-email user@test.com

# Track a sale
dub-cli analytics track-sale --click-id clk_123 --event-name "Purchase" --amount 4999
dub-cli analytics track-sale --click-id clk_123 --event-name "Purchase" --amount 4999 --currency usd --payment-processor stripe

# List events
dub-cli analytics events
dub-cli analytics events --event clicks --interval 7d --limit 10
dub-cli analytics events --link-id clx1234
```
