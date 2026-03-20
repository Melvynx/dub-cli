import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const partnersResource = new Command("partners")
  .description("Manage partners (affiliate program)");

// -- LIST --
partnersResource
  .command("list")
  .description("List all partners")
  .option("--status <status>", "Filter by status: pending, approved, rejected, invited, declined, deactivated, banned, archived")
  .option("--country <country>", "Filter by 2-letter country code")
  .option("--sort <sort>", "Sort by: createdAt, totalClicks, totalLeads, totalConversions, totalSaleAmount, totalCommissions, netRevenue", "totalSaleAmount")
  .option("--sort-order <order>", "Sort order: asc, desc", "desc")
  .option("--email <email>", "Filter by email")
  .option("--tenant-id <tenantId>", "Filter by tenant ID")
  .option("--search <query>", "Search partners")
  .option("--page <n>", "Page number", "1")
  .option("--page-size <n>", "Results per page (max 100)", "100")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli partners list --json\n  dub-cli partners list --status approved --sort totalClicks\n  dub-cli partners list --country US --json",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.status) params.status = opts.status as string;
      if (opts.country) params.country = opts.country as string;
      if (opts.sort) params.sortBy = opts.sort as string;
      if (opts.sortOrder) params.sortOrder = opts.sortOrder as string;
      if (opts.email) params.email = opts.email as string;
      if (opts.tenantId) params.tenantId = opts.tenantId as string;
      if (opts.search) params.search = opts.search as string;
      if (opts.page) params.page = opts.page as string;
      if (opts.pageSize) params.pageSize = opts.pageSize as string;

      const data = await client.get("/partners", params);
      output(data, {
        json: !!opts.json,
        format: opts.format as string,
        fields: opts.fields ? (opts.fields as string).split(",") : undefined,
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- CREATE (upsert) --
partnersResource
  .command("create")
  .description("Create or update a partner")
  .requiredOption("--email <email>", "Partner email")
  .option("--name <name>", "Partner name")
  .option("--username <username>", "Partner username")
  .option("--image <url>", "Partner image URL")
  .option("--tenant-id <tenantId>", "Tenant ID")
  .option("--group-id <groupId>", "Group ID")
  .option("--country <country>", "2-letter country code")
  .option("--description <desc>", "Partner description")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    '\nExamples:\n  dub-cli partners create --email john@example.com --name "John Doe" --json\n  dub-cli partners create --email jane@test.com --country US',
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = { email: opts.email };
      if (opts.name) body.name = opts.name;
      if (opts.username) body.username = opts.username;
      if (opts.image) body.image = opts.image;
      if (opts.tenantId) body.tenantId = opts.tenantId;
      if (opts.groupId) body.groupId = opts.groupId;
      if (opts.country) body.country = opts.country;
      if (opts.description) body.description = opts.description;

      const data = await client.post("/partners", body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
