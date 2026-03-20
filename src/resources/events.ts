import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const eventsResource = new Command("events")
  .description("List and filter events");

// -- LIST --
eventsResource
  .command("list")
  .description("List events (clicks, leads, sales)")
  .option("--event <event>", "Event type: clicks, leads, sales", "clicks")
  .option("--domain <domain>", "Filter by domain")
  .option("--key <key>", "Filter by link key (requires --domain)")
  .option("--link-id <linkId>", "Filter by link ID")
  .option("--external-id <externalId>", "Filter by external ID")
  .option("--interval <interval>", "Time interval: 24h, 7d, 30d, 90d, 1y, mtd, qtd, ytd, all")
  .option("--start <start>", "Start date (ISO 8601)")
  .option("--end <end>", "End date (ISO 8601)")
  .option("--timezone <tz>", "IANA timezone")
  .option("--country <country>", "Filter by country code")
  .option("--device <device>", "Filter by device type")
  .option("--browser <browser>", "Filter by browser")
  .option("--page <n>", "Page number", "1")
  .option("--limit <n>", "Results per page (max 1000)", "100")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli events list --json\n  dub-cli events list --event clicks --interval 7d\n  dub-cli events list --event sales --link-id clx1234 --json",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.event) params.event = opts.event as string;
      if (opts.domain) params.domain = opts.domain as string;
      if (opts.key) params.key = opts.key as string;
      if (opts.linkId) params.linkId = opts.linkId as string;
      if (opts.externalId) params.externalId = opts.externalId as string;
      if (opts.interval) params.interval = opts.interval as string;
      if (opts.start) params.start = opts.start as string;
      if (opts.end) params.end = opts.end as string;
      if (opts.timezone) params.timezone = opts.timezone as string;
      if (opts.country) params.country = opts.country as string;
      if (opts.device) params.device = opts.device as string;
      if (opts.browser) params.browser = opts.browser as string;
      if (opts.page) params.page = opts.page as string;
      if (opts.limit) params.limit = opts.limit as string;

      const data = await client.get("/events", params);
      output(data, {
        json: !!opts.json,
        format: opts.format as string,
        fields: opts.fields ? (opts.fields as string).split(",") : undefined,
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
