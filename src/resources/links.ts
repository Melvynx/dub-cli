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
  .option("--tag-ids <tagIds>", "Comma-separated tag IDs")
  .option("--tag-names <tagNames>", "Comma-separated tag names")
  .option("--search <query>", "Search by slug or URL")
  .option("--user-id <userId>", "Filter by user ID")
  .option("--tenant-id <tenantId>", "Filter by tenant ID")
  .option("--folder-id <folderId>", "Filter by folder ID")
  .option("--show-archived", "Include archived links")
  .option("--sort <sort>", "Sort by: createdAt, clicks, saleAmount, lastClicked", "createdAt")
  .option("--sort-order <order>", "Sort order: asc, desc", "desc")
  .option("--page <n>", "Page number", "1")
  .option("--page-size <n>", "Results per page (max 100)", "100")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli links list\n  dub-cli links list --domain mlv.sh --json\n  dub-cli links list --search blog --page-size 10",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.domain) params.domain = opts.domain as string;
      if (opts.tagIds) params.tagIds = opts.tagIds as string;
      if (opts.tagNames) params.tagNames = opts.tagNames as string;
      if (opts.search) params.search = opts.search as string;
      if (opts.userId) params.userId = opts.userId as string;
      if (opts.tenantId) params.tenantId = opts.tenantId as string;
      if (opts.folderId) params.folderId = opts.folderId as string;
      if (opts.showArchived) params.showArchived = "true";
      if (opts.sort) params.sortBy = opts.sort as string;
      if (opts.sortOrder) params.sortOrder = opts.sortOrder as string;
      if (opts.page) params.page = opts.page as string;
      if (opts.pageSize) params.pageSize = opts.pageSize as string;

      const data = await client.get("/links", params);
      output(data, {
        json: !!opts.json,
        format: opts.format as string,
        fields: opts.fields ? (opts.fields as string).split(",") : undefined,
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

function buildLinkBody(opts: Record<string, string | boolean | undefined>): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (opts.url) body.url = opts.url;
  if (opts.domain) body.domain = opts.domain;
  if (opts.key) body.key = opts.key;
  if (opts.externalId) body.externalId = opts.externalId;
  if (opts.prefix) body.prefix = opts.prefix;
  if (opts.tagIds) body.tagIds = (opts.tagIds as string).split(",");
  if (opts.tagNames) body.tagNames = (opts.tagNames as string).split(",");
  if (opts.folderId) body.folderId = opts.folderId;
  if (opts.tenantId) body.tenantId = opts.tenantId;
  if (opts.programId) body.programId = opts.programId;
  if (opts.comments) body.comments = opts.comments;
  if (opts.expiresAt) body.expiresAt = opts.expiresAt;
  if (opts.expiredUrl) body.expiredUrl = opts.expiredUrl;
  if (opts.password) body.password = opts.password;
  if (opts.title) body.title = opts.title;
  if (opts.description) body.description = opts.description;
  if (opts.image) body.image = opts.image;
  if (opts.video) body.video = opts.video;
  if (opts.proxy) body.proxy = true;
  if (opts.rewrite) body.rewrite = true;
  if (opts.doIndex) body.doIndex = true;
  if (opts.archived) body.archived = true;
  if (opts.trackConversion) body.trackConversion = true;
  if (opts.ios) body.ios = opts.ios;
  if (opts.android) body.android = opts.android;
  if (opts.geo) body.geo = JSON.parse(opts.geo as string);
  if (opts.webhookIds) body.webhookIds = (opts.webhookIds as string).split(",");
  // UTM params
  if (opts.utmSource) body.utm_source = opts.utmSource;
  if (opts.utmMedium) body.utm_medium = opts.utmMedium;
  if (opts.utmCampaign) body.utm_campaign = opts.utmCampaign;
  if (opts.utmTerm) body.utm_term = opts.utmTerm;
  if (opts.utmContent) body.utm_content = opts.utmContent;
  return body;
}

function addLinkOptions(cmd: Command): Command {
  return cmd
    .option("--domain <domain>", "Short link domain")
    .option("--key <key>", "Short link slug")
    .option("--external-id <externalId>", "External ID")
    .option("--prefix <prefix>", "Key prefix")
    .option("--tag-ids <tagIds>", "Comma-separated tag IDs")
    .option("--tag-names <tagNames>", "Comma-separated tag names")
    .option("--folder-id <folderId>", "Folder ID")
    .option("--tenant-id <tenantId>", "Tenant ID")
    .option("--program-id <programId>", "Program ID")
    .option("--comments <comments>", "Comments")
    .option("--expires-at <expiresAt>", "Expiration date (ISO 8601)")
    .option("--expired-url <expiredUrl>", "URL after expiration")
    .option("--password <password>", "Password protect the link")
    .option("--title <title>", "OG title")
    .option("--description <desc>", "OG description")
    .option("--image <image>", "OG image URL")
    .option("--video <video>", "OG video URL")
    .option("--proxy", "Enable custom link previews")
    .option("--rewrite", "Enable link cloaking")
    .option("--do-index", "Allow search engine indexing")
    .option("--archived", "Archive the link")
    .option("--track-conversion", "Enable conversion tracking")
    .option("--ios <url>", "iOS redirect URL")
    .option("--android <url>", "Android redirect URL")
    .option("--geo <json>", "Geo-targeting JSON object")
    .option("--webhook-ids <ids>", "Comma-separated webhook IDs")
    .option("--utm-source <source>", "UTM source")
    .option("--utm-medium <medium>", "UTM medium")
    .option("--utm-campaign <campaign>", "UTM campaign")
    .option("--utm-term <term>", "UTM term")
    .option("--utm-content <content>", "UTM content")
    .option("--json", "Output as JSON")
    .option("--format <fmt>", "Output format: text, json, csv, yaml");
}

// -- CREATE --
addLinkOptions(
  linksResource
    .command("create")
    .description("Create a new short link")
    .requiredOption("--url <url>", "Destination URL"),
)
  .addHelpText(
    "after",
    '\nExamples:\n  dub-cli links create --url https://example.com\n  dub-cli links create --url https://example.com --domain mlv.sh --utm-source youtube --json',
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const body = buildLinkBody(opts);
      const data = await client.post("/links", body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- UPDATE --
addLinkOptions(
  linksResource
    .command("update")
    .description("Update an existing link")
    .argument("<link-id>", "Link ID (or ext_<externalId>)")
    .option("--url <url>", "New destination URL"),
)
  .addHelpText(
    "after",
    '\nExamples:\n  dub-cli links update clx1234 --url https://new-url.com\n  dub-cli links update ext_my-id --key new-slug --json',
  )
  .action(async (linkId: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const body = buildLinkBody(opts);
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
  .argument("<link-id>", "Link ID (or ext_<externalId>)")
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
addLinkOptions(
  linksResource
    .command("upsert")
    .description("Create or update a link by URL")
    .requiredOption("--url <url>", "Destination URL"),
)
  .addHelpText(
    "after",
    '\nExamples:\n  dub-cli links upsert --url https://example.com\n  dub-cli links upsert --url https://example.com --key my-link --json',
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const body = buildLinkBody(opts);
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
  .option("--tag-ids <tagIds>", "Comma-separated tag IDs")
  .option("--tag-names <tagNames>", "Comma-separated tag names")
  .option("--search <query>", "Search links")
  .option("--user-id <userId>", "Filter by user ID")
  .option("--tenant-id <tenantId>", "Filter by tenant ID")
  .option("--folder-id <folderId>", "Filter by folder ID")
  .option("--show-archived", "Include archived links")
  .option("--group-by <groupBy>", "Group by: domain, tagId, userId, folderId")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli links count\n  dub-cli links count --domain mlv.sh --json\n  dub-cli links count --group-by domain",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.domain) params.domain = opts.domain as string;
      if (opts.tagIds) params.tagIds = opts.tagIds as string;
      if (opts.tagNames) params.tagNames = opts.tagNames as string;
      if (opts.search) params.search = opts.search as string;
      if (opts.userId) params.userId = opts.userId as string;
      if (opts.tenantId) params.tenantId = opts.tenantId as string;
      if (opts.folderId) params.folderId = opts.folderId as string;
      if (opts.showArchived) params.showArchived = "true";
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
    `\nExamples:\n  dub-cli links bulk-create --data '[{"url":"https://a.com"},{"url":"https://b.com"}]' --json`,
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
  .requiredOption("--data <json>", "JSON with linkIds/externalIds and update fields")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    `\nExamples:\n  dub-cli links bulk-update --data '{"linkIds":["id1","id2"],"data":{"archived":true}}' --json`,
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
  .description("Bulk delete links (max 100)")
  .requiredOption("--link-ids <ids>", "Comma-separated link IDs to delete")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli links bulk-delete --link-ids id1,id2,id3\n  dub-cli links bulk-delete --link-ids id1,id2 --json",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const linkIds = (opts.linkIds as string).split(",").map((id) => id.trim());
      const data = await client.delete("/links/bulk", { linkIds: linkIds.join(",") });
      output(data ?? { deleted: true, linkIds }, { json: !!opts.json });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
