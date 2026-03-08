import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const domainsResource = new Command("domains")
  .description("Manage custom domains");

// -- LIST --
domainsResource
  .command("list")
  .description("List all domains")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli domains list\n  dub-cli domains list --json",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const data = await client.get("/domains");
      output(data, {
        json: !!opts.json,
        format: opts.format as string,
        fields: opts.fields ? (opts.fields as string).split(",") : undefined,
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- CREATE --
domainsResource
  .command("create")
  .description("Create a custom domain")
  .requiredOption("--slug <slug>", "Domain slug (e.g. example.com)")
  .option("--type <type>", "Domain type: redirect or rewrite", "redirect")
  .option("--target <target>", "Target URL for the domain root")
  .option("--expired-url <expiredUrl>", "URL for expired links")
  .option("--placeholder <url>", "Placeholder URL")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    '\nExamples:\n  dub-cli domains create --slug example.com\n  dub-cli domains create --slug example.com --target https://mysite.com --json',
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = { slug: opts.slug };
      if (opts.type) body.type = opts.type;
      if (opts.target) body.target = opts.target;
      if (opts.expiredUrl) body.expiredUrl = opts.expiredUrl;
      if (opts.placeholder) body.placeholder = opts.placeholder;

      const data = await client.post("/domains", body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- UPDATE --
domainsResource
  .command("update")
  .description("Update a domain")
  .argument("<slug>", "Domain slug to update")
  .option("--target <target>", "New target URL")
  .option("--type <type>", "Domain type: redirect or rewrite")
  .option("--expired-url <expiredUrl>", "URL for expired links")
  .option("--placeholder <url>", "Placeholder URL")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    '\nExamples:\n  dub-cli domains update example.com --target https://new-site.com\n  dub-cli domains update example.com --type rewrite --json',
  )
  .action(async (slug: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.target) body.target = opts.target;
      if (opts.type) body.type = opts.type;
      if (opts.expiredUrl) body.expiredUrl = opts.expiredUrl;
      if (opts.placeholder) body.placeholder = opts.placeholder;

      const data = await client.patch(`/domains/${slug}`, body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- DELETE --
domainsResource
  .command("delete")
  .description("Delete a domain")
  .argument("<slug>", "Domain slug to delete")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli domains delete example.com\n  dub-cli domains delete example.com --json",
  )
  .action(async (slug: string, opts: { json?: boolean }) => {
    try {
      const data = await client.delete(`/domains/${slug}`);
      output(data ?? { deleted: true, slug }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
