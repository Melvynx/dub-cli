# dub-cli

CLI for the dub API. Made with [api2cli.dev](https://api2cli.dev).

## Install

```bash
npx api2cli install <user>/dub-cli
```

This clones the repo, builds the CLI, links it to your PATH, and installs the AgentSkill to your coding agents.

## Install AgentSkill only

```bash
npx skills add <user>/dub-cli
```

## Usage

```bash
dub-cli auth set "your-token"
dub-cli auth test
dub-cli --help
```

## Resources

Run `dub-cli --help` to see available resources.

## Global Flags

All commands support: `--json`, `--format <text|json|csv|yaml>`, `--verbose`, `--no-color`, `--no-header`
