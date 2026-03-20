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
  .description("Add a custom domain")
  .requiredOption("--slug <slug>", "Domain name (e.g. example.com)")
  .option("--expired-url <url>", "Redirect URL for expired links")
  .option("--not-found-url <url>", "Redirect URL for non-existent links")
  .option("--archived", "Archive the domain")
  .option("--placeholder <text>", "Example link for teammates (max 100 chars)")
  .option("--logo <url>", "Logo URL or base64 image")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    '\nExamples:\n  dub-cli domains create --slug example.com\n  dub-cli domains create --slug example.com --expired-url https://fallback.com --json',
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = { slug: opts.slug };
      if (opts.expiredUrl) body.expiredUrl = opts.expiredUrl;
      if (opts.notFoundUrl) body.notFoundUrl = opts.notFoundUrl;
      if (opts.archived) body.archived = true;
      if (opts.placeholder) body.placeholder = opts.placeholder;
      if (opts.logo) body.logo = opts.logo;

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
  .argument("<slug>", "Domain name to update")
  .option("--slug <newSlug>", "New domain name")
  .option("--expired-url <url>", "New redirect URL for expired links")
  .option("--not-found-url <url>", "New redirect URL for non-existent links")
  .option("--archived", "Archive the domain")
  .option("--placeholder <text>", "Placeholder text")
  .option("--logo <url>", "Logo URL or base64")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    '\nExamples:\n  dub-cli domains update example.com --expired-url https://new-fallback.com\n  dub-cli domains update example.com --not-found-url https://404.com --json',
  )
  .action(async (slug: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.slug) body.slug = opts.slug;
      if (opts.expiredUrl) body.expiredUrl = opts.expiredUrl;
      if (opts.notFoundUrl) body.notFoundUrl = opts.notFoundUrl;
      if (opts.archived) body.archived = true;
      if (opts.placeholder) body.placeholder = opts.placeholder;
      if (opts.logo) body.logo = opts.logo;

      const data = await client.patch(`/domains/${slug}`, body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- DELETE --
domainsResource
  .command("delete")
  .description("Delete a domain (irreversible, deletes all associated links)")
  .argument("<slug>", "Domain name to delete")
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

// -- REGISTER --
domainsResource
  .command("register")
  .description("Register a new .link domain (Enterprise only)")
  .requiredOption("--domain <domain>", "Domain to register (must be .link)")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli domains register --domain myapp.link --json",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const data = await client.post("/domains/register", { domain: opts.domain });
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
