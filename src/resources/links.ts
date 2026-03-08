import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const linksResource = new Command("links")
  .description("Manage short links");

// -- LIST --
linksResource
  .command("list")
  .description("List all links")
  .option("--domain <domain>", "Filter by domain")
  .option("--tag-id <tagId>", "Filter by tag ID")
  .option("--search <query>", "Search links")
  .option("--sort <sort>", "Sort by: createdAt, clicks, lastClicked", "createdAt")
  .option("--page <n>", "Page number", "1")
  .option("--page-size <n>", "Results per page (max 100)", "50")
  .option("--folder-id <folderId>", "Filter by folder ID")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli links list\n  dub-cli links list --domain example.com --json\n  dub-cli links list --search blog --page-size 10",
  )
  .action(async (opts: Record<string, string | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.domain) params.domain = opts.domain;
      if (opts.tagId) params.tagId = opts.tagId;
      if (opts.search) params.search = opts.search;
      if (opts.sort) params.sort = opts.sort;
      if (opts.page) params.page = opts.page;
      if (opts.pageSize) params.pageSize = opts.pageSize;
      if (opts.folderId) params.folderId = opts.folderId;

      const data = await client.get("/links", params);
      output(data, {
        json: opts.json === "" || opts.json === "true" ? true : !!opts.json,
        format: opts.format,
        fields: opts.fields?.split(","),
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- GET --
linksResource
  .command("get")
  .description("Get link info by linkId, domain+key, or externalId")
  .option("--link-id <linkId>", "Link ID")
  .option("--domain <domain>", "Link domain")
  .option("--key <key>", "Link key (slug)")
  .option("--external-id <externalId>", "External ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli links get --link-id clx1234\n  dub-cli links get --domain dub.sh --key my-link\n  dub-cli links get --external-id ext_123 --json",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.linkId) params.linkId = opts.linkId as string;
      if (opts.domain) params.domain = opts.domain as string;
      if (opts.key) params.key = opts.key as string;
      if (opts.externalId) params.externalId = opts.externalId as string;

      const data = await client.get("/links/info", params);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- CREATE --
linksResource
  .command("create")
  .description("Create a new short link")
  .requiredOption("--url <url>", "Destination URL")
  .option("--domain <domain>", "Short link domain")
  .option("--key <key>", "Short link slug")
  .option("--external-id <externalId>", "External ID for reference")
  .option("--prefix <prefix>", "Key prefix")
  .option("--tag-ids <tagIds>", "Comma-separated tag IDs")
  .option("--folder-id <folderId>", "Folder ID")
  .option("--comments <comments>", "Comments for the link")
  .option("--expires-at <expiresAt>", "Expiration date (ISO 8601)")
  .option("--expired-url <expiredUrl>", "URL to redirect to after expiration")
  .option("--password <password>", "Password to access the link")
  .option("--archived", "Archive the link")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    '\nExamples:\n  dub-cli links create --url https://example.com\n  dub-cli links create --url https://example.com --domain dub.sh --key my-link\n  dub-cli links create --url https://example.com --tag-ids tag1,tag2 --json',
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = { url: opts.url };
      if (opts.domain) body.domain = opts.domain;
      if (opts.key) body.key = opts.key;
      if (opts.externalId) body.externalId = opts.externalId;
      if (opts.prefix) body.prefix = opts.prefix;
      if (opts.tagIds) body.tagIds = (opts.tagIds as string).split(",");
      if (opts.folderId) body.folderId = opts.folderId;
      if (opts.comments) body.comments = opts.comments;
      if (opts.expiresAt) body.expiresAt = opts.expiresAt;
      if (opts.expiredUrl) body.expiredUrl = opts.expiredUrl;
      if (opts.password) body.password = opts.password;
      if (opts.archived) body.archived = true;

      const data = await client.post("/links", body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- UPDATE --
linksResource
  .command("update")
  .description("Update an existing link")
  .argument("<link-id>", "Link ID")
  .option("--url <url>", "New destination URL")
  .option("--domain <domain>", "New domain")
  .option("--key <key>", "New slug")
  .option("--external-id <externalId>", "New external ID")
  .option("--tag-ids <tagIds>", "Comma-separated tag IDs")
  .option("--folder-id <folderId>", "Folder ID")
  .option("--comments <comments>", "Comments")
  .option("--expires-at <expiresAt>", "Expiration date (ISO 8601)")
  .option("--expired-url <expiredUrl>", "URL after expiration")
  .option("--password <password>", "Password")
  .option("--archived", "Archive the link")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    '\nExamples:\n  dub-cli links update clx1234 --url https://new-url.com\n  dub-cli links update clx1234 --key new-slug --json',
  )
  .action(async (linkId: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.url) body.url = opts.url;
      if (opts.domain) body.domain = opts.domain;
      if (opts.key) body.key = opts.key;
      if (opts.externalId) body.externalId = opts.externalId;
      if (opts.tagIds) body.tagIds = (opts.tagIds as string).split(",");
      if (opts.folderId) body.folderId = opts.folderId;
      if (opts.comments) body.comments = opts.comments;
      if (opts.expiresAt) body.expiresAt = opts.expiresAt;
      if (opts.expiredUrl) body.expiredUrl = opts.expiredUrl;
      if (opts.password) body.password = opts.password;
      if (opts.archived) body.archived = true;

      const data = await client.patch(`/links/${linkId}`, body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- DELETE --
linksResource
  .command("delete")
  .description("Delete a link")
  .argument("<link-id>", "Link ID")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli links delete clx1234\n  dub-cli links delete clx1234 --json",
  )
  .action(async (linkId: string, opts: { json?: boolean }) => {
    try {
      const data = await client.delete(`/links/${linkId}`);
      output(data ?? { deleted: true, linkId }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// -- UPSERT --
linksResource
  .command("upsert")
  .description("Create or update a link by URL")
  .requiredOption("--url <url>", "Destination URL")
  .option("--domain <domain>", "Short link domain")
  .option("--key <key>", "Short link slug")
  .option("--external-id <externalId>", "External ID")
  .option("--tag-ids <tagIds>", "Comma-separated tag IDs")
  .option("--folder-id <folderId>", "Folder ID")
  .option("--comments <comments>", "Comments")
  .option("--expires-at <expiresAt>", "Expiration date (ISO 8601)")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    '\nExamples:\n  dub-cli links upsert --url https://example.com\n  dub-cli links upsert --url https://example.com --key my-link --json',
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = { url: opts.url };
      if (opts.domain) body.domain = opts.domain;
      if (opts.key) body.key = opts.key;
      if (opts.externalId) body.externalId = opts.externalId;
      if (opts.tagIds) body.tagIds = (opts.tagIds as string).split(",");
      if (opts.folderId) body.folderId = opts.folderId;
      if (opts.comments) body.comments = opts.comments;
      if (opts.expiresAt) body.expiresAt = opts.expiresAt;

      const data = await client.put("/links/upsert", body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- COUNT --
linksResource
  .command("count")
  .description("Count links with optional filters")
  .option("--domain <domain>", "Filter by domain")
  .option("--tag-id <tagId>", "Filter by tag ID")
  .option("--search <query>", "Search links")
  .option("--folder-id <folderId>", "Filter by folder ID")
  .option("--group-by <groupBy>", "Group by: domain, tagId")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli links count\n  dub-cli links count --domain example.com --json\n  dub-cli links count --group-by domain",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.domain) params.domain = opts.domain as string;
      if (opts.tagId) params.tagId = opts.tagId as string;
      if (opts.search) params.search = opts.search as string;
      if (opts.folderId) params.folderId = opts.folderId as string;
      if (opts.groupBy) params.groupBy = opts.groupBy as string;

      const data = await client.get("/links/count", params);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- BULK-CREATE --
linksResource
  .command("bulk-create")
  .description("Bulk create links (max 100)")
  .requiredOption("--data <json>", "JSON array of link objects")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    `\nExamples:\n  dub-cli links bulk-create --data '[{"url":"https://example.com"},{"url":"https://other.com"}]' --json`,
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const links = JSON.parse(opts.data as string);
      const data = await client.post("/links/bulk", links);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- BULK-UPDATE --
linksResource
  .command("bulk-update")
  .description("Bulk update links")
  .requiredOption("--data <json>", "JSON object with linkIds array and update data")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    `\nExamples:\n  dub-cli links bulk-update --data '{"linkIds":["id1","id2"],"url":"https://new.com"}' --json`,
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const body = JSON.parse(opts.data as string);
      const data = await client.patch("/links/bulk", body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- BULK-DELETE --
linksResource
  .command("bulk-delete")
  .description("Bulk delete links")
  .requiredOption("--link-ids <ids>", "Comma-separated link IDs to delete")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli links bulk-delete --link-ids id1,id2,id3\n  dub-cli links bulk-delete --link-ids id1,id2 --json",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const linkIds = (opts.linkIds as string).split(",").map((id) => id.trim());
      const params: Record<string, string> = { linkIds: linkIds.join(",") };
      const data = await client.delete("/links/bulk", params);
      output(data ?? { deleted: true, linkIds }, { json: !!opts.json });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
