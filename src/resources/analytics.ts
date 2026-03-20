import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const analyticsResource = new Command("analytics")
  .description("Retrieve analytics data");

// -- QUERY --
analyticsResource
  .command("query")
  .description("Query analytics data")
  .option("--event <event>", "Event type: clicks, leads, sales, composite", "clicks")
  .option("--group-by <groupBy>", "Group by: count, timeseries, continents, countries, regions, cities, devices, browsers, os, triggers, referers, referer_urls, top_links, top_urls, top_domains, top_folders, top_partners, top_groups, utm_sources, utm_mediums, utm_campaigns, utm_terms, utm_contents", "count")
  .option("--interval <interval>", "Time interval: 24h, 7d, 30d, 90d, 1y, mtd, qtd, ytd, all")
  .option("--start <start>", "Start date (ISO 8601)")
  .option("--end <end>", "End date (ISO 8601)")
  .option("--timezone <tz>", "IANA timezone (default: UTC)")
  .option("--domain <domain>", "Filter by domain")
  .option("--key <key>", "Filter by link key")
  .option("--link-id <linkId>", "Filter by link ID")
  .option("--external-id <externalId>", "Filter by external ID")
  .option("--tenant-id <tenantId>", "Filter by tenant ID")
  .option("--tag-id <tagId>", "Filter by tag ID")
  .option("--folder-id <folderId>", "Filter by folder ID")
  .option("--country <country>", "Filter by country code")
  .option("--city <city>", "Filter by city")
  .option("--region <region>", "Filter by region")
  .option("--continent <continent>", "Filter by continent")
  .option("--device <device>", "Filter by device type")
  .option("--browser <browser>", "Filter by browser")
  .option("--os <os>", "Filter by OS")
  .option("--trigger <trigger>", "Filter by trigger")
  .option("--referer <referer>", "Filter by referer")
  .option("--url <url>", "Filter by destination URL")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli analytics query --event clicks --group-by timeseries --interval 7d --json\n  dub-cli analytics query --group-by countries --interval 30d\n  dub-cli analytics query --event sales --group-by top_links",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.event) params.event = opts.event as string;
      if (opts.groupBy) params.groupBy = opts.groupBy as string;
      if (opts.interval) params.interval = opts.interval as string;
      if (opts.start) params.start = opts.start as string;
      if (opts.end) params.end = opts.end as string;
      if (opts.timezone) params.timezone = opts.timezone as string;
      if (opts.domain) params.domain = opts.domain as string;
      if (opts.key) params.key = opts.key as string;
      if (opts.linkId) params.linkId = opts.linkId as string;
      if (opts.externalId) params.externalId = opts.externalId as string;
      if (opts.tenantId) params.tenantId = opts.tenantId as string;
      if (opts.tagId) params.tagId = opts.tagId as string;
      if (opts.folderId) params.folderId = opts.folderId as string;
      if (opts.country) params.country = opts.country as string;
      if (opts.city) params.city = opts.city as string;
      if (opts.region) params.region = opts.region as string;
      if (opts.continent) params.continent = opts.continent as string;
      if (opts.device) params.device = opts.device as string;
      if (opts.browser) params.browser = opts.browser as string;
      if (opts.os) params.os = opts.os as string;
      if (opts.trigger) params.trigger = opts.trigger as string;
      if (opts.referer) params.referer = opts.referer as string;
      if (opts.url) params.url = opts.url as string;

      const data = await client.get("/analytics", params);
      output(data, {
        json: !!opts.json,
        format: opts.format as string,
        fields: opts.fields ? (opts.fields as string).split(",") : undefined,
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
