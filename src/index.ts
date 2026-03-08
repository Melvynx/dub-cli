#!/usr/bin/env bun
import { Command } from "commander";
import { globalFlags } from "./lib/config.js";
import { authCommand } from "./commands/auth.js";
import { linksResource } from "./resources/links.js";
import { domainsResource } from "./resources/domains.js";
import { tagsResource } from "./resources/tags.js";
import { foldersResource } from "./resources/folders.js";
import { customersResource } from "./resources/customers.js";
import { analyticsResource } from "./resources/analytics.js";

const program = new Command();

program
  .name("dub-cli")
  .description("CLI for the Dub.co API - manage short links, domains, tags, and analytics")
  .version("0.1.0")
  .option("--json", "Output as JSON", false)
  .option("--format <fmt>", "Output format: text, json, csv, yaml", "text")
  .option("--verbose", "Enable debug logging", false)
  .option("--no-color", "Disable colored output")
  .option("--no-header", "Omit table/csv headers (for piping)")
  .hook("preAction", (_thisCmd, actionCmd) => {
    const root = actionCmd.optsWithGlobals();
    globalFlags.json = root.json ?? false;
    globalFlags.format = root.format ?? "text";
    globalFlags.verbose = root.verbose ?? false;
    globalFlags.noColor = root.color === false;
    globalFlags.noHeader = root.header === false;
  });

program.addCommand(authCommand);
program.addCommand(linksResource);
program.addCommand(domainsResource);
program.addCommand(tagsResource);
program.addCommand(foldersResource);
program.addCommand(customersResource);
program.addCommand(analyticsResource);

program.parse();
