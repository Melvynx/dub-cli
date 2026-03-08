import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const analyticsResource = new Command("analytics")
  .description("Analytics, event tracking, and conversion management");

// -- QUERY --
analyticsResource
  .command("query")
  .description("Query analytics data")
  .option("--event <event>", "Event type: clicks, leads, sales, composite")
  .option("--group-by <groupBy>", "Group by: timeseries, country, city, device, browser, os, referer, top_links, top_urls, trigger")
  .option("--interval <interval>", "Time interval: 1h, 24h, 7d, 30d, 90d, ytd, 1y, all")
  .option("--start <start>", "Start date (ISO 8601)")
  .option("--end <end>", "End date (ISO 8601)")
  .option("--domain <domain>", "Filter by domain")
  .option("--key <key>", "Filter by link key")
  .option("--link-id <linkId>", "Filter by link ID")
  .option("--tag-id <tagId>", "Filter by tag ID")
  .option("--folder-id <folderId>", "Filter by folder ID")
  .option("--country <country>", "Filter by country code")
  .option("--city <city>", "Filter by city")
  .option("--device <device>", "Filter by device type")
  .option("--browser <browser>", "Filter by browser")
  .option("--os <os>", "Filter by OS")
  .option("--referer <referer>", "Filter by referer")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli analytics query --event clicks --group-by timeseries --interval 7d\n  dub-cli analytics query --event clicks --group-by country --json\n  dub-cli analytics query --event sales --group-by top_links --interval 30d",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.event) body.event = opts.event;
      if (opts.groupBy) body.groupBy = opts.groupBy;
      if (opts.interval) body.interval = opts.interval;
      if (opts.start) body.start = opts.start;
      if (opts.end) body.end = opts.end;
      if (opts.domain) body.domain = opts.domain;
      if (opts.key) body.key = opts.key;
      if (opts.linkId) body.linkId = opts.linkId;
      if (opts.tagId) body.tagId = opts.tagId;
      if (opts.folderId) body.folderId = opts.folderId;
      if (opts.country) body.country = opts.country;
      if (opts.city) body.city = opts.city;
      if (opts.device) body.device = opts.device;
      if (opts.browser) body.browser = opts.browser;
      if (opts.os) body.os = opts.os;
      if (opts.referer) body.referer = opts.referer;

      const data = await client.post("/analytics", body);
      output(data, {
        json: !!opts.json,
        format: opts.format as string,
        fields: opts.fields ? (opts.fields as string).split(",") : undefined,
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- TRACK-LEAD --
analyticsResource
  .command("track-lead")
  .description("Track a lead conversion")
  .requiredOption("--click-id <clickId>", "Click ID from Dub")
  .requiredOption("--event-name <eventName>", "Event name (e.g. 'Sign up')")
  .option("--customer-id <customerId>", "Customer ID")
  .option("--customer-name <customerName>", "Customer name")
  .option("--customer-email <customerEmail>", "Customer email")
  .option("--customer-avatar <customerAvatar>", "Customer avatar URL")
  .option("--metadata <metadata>", "JSON metadata string")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    `\nExamples:\n  dub-cli analytics track-lead --click-id clk_123 --event-name "Sign up"\n  dub-cli analytics track-lead --click-id clk_123 --event-name "Sign up" --customer-email user@test.com --json`,
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = {
        clickId: opts.clickId,
        eventName: opts.eventName,
      };
      if (opts.customerId) body.customerId = opts.customerId;
      if (opts.customerName) body.customerName = opts.customerName;
      if (opts.customerEmail) body.customerEmail = opts.customerEmail;
      if (opts.customerAvatar) body.customerAvatar = opts.customerAvatar;
      if (opts.metadata) body.metadata = JSON.parse(opts.metadata as string);

      const data = await client.post("/track/lead", body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- TRACK-SALE --
analyticsResource
  .command("track-sale")
  .description("Track a sale conversion")
  .requiredOption("--click-id <clickId>", "Click ID from Dub")
  .requiredOption("--event-name <eventName>", "Event name (e.g. 'Purchase')")
  .requiredOption("--amount <amount>", "Sale amount in cents")
  .option("--currency <currency>", "Currency code (default: usd)", "usd")
  .option("--customer-id <customerId>", "Customer ID")
  .option("--customer-name <customerName>", "Customer name")
  .option("--customer-email <customerEmail>", "Customer email")
  .option("--customer-avatar <customerAvatar>", "Customer avatar URL")
  .option("--payment-processor <processor>", "Payment processor: stripe, shopify, paddle")
  .option("--invoice-id <invoiceId>", "Invoice ID")
  .option("--metadata <metadata>", "JSON metadata string")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    `\nExamples:\n  dub-cli analytics track-sale --click-id clk_123 --event-name "Purchase" --amount 4999\n  dub-cli analytics track-sale --click-id clk_123 --event-name "Purchase" --amount 4999 --currency usd --json`,
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = {
        clickId: opts.clickId,
        eventName: opts.eventName,
        amount: Number(opts.amount),
      };
      if (opts.currency) body.currency = opts.currency;
      if (opts.customerId) body.customerId = opts.customerId;
      if (opts.customerName) body.customerName = opts.customerName;
      if (opts.customerEmail) body.customerEmail = opts.customerEmail;
      if (opts.customerAvatar) body.customerAvatar = opts.customerAvatar;
      if (opts.paymentProcessor) body.paymentProcessor = opts.paymentProcessor;
      if (opts.invoiceId) body.invoiceId = opts.invoiceId;
      if (opts.metadata) body.metadata = JSON.parse(opts.metadata as string);

      const data = await client.post("/track/sale", body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- EVENTS --
analyticsResource
  .command("events")
  .description("List events")
  .option("--domain <domain>", "Filter by domain")
  .option("--key <key>", "Filter by link key")
  .option("--link-id <linkId>", "Filter by link ID")
  .option("--interval <interval>", "Time interval: 1h, 24h, 7d, 30d, 90d, ytd, 1y, all")
  .option("--start <start>", "Start date (ISO 8601)")
  .option("--end <end>", "End date (ISO 8601)")
  .option("--event <event>", "Event type: clicks, leads, sales")
  .option("--page <n>", "Page number", "1")
  .option("--limit <n>", "Results per page", "50")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli analytics events\n  dub-cli analytics events --event clicks --interval 7d --json\n  dub-cli analytics events --link-id clx1234 --limit 10",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.domain) params.domain = opts.domain as string;
      if (opts.key) params.key = opts.key as string;
      if (opts.linkId) params.linkId = opts.linkId as string;
      if (opts.interval) params.interval = opts.interval as string;
      if (opts.start) params.start = opts.start as string;
      if (opts.end) params.end = opts.end as string;
      if (opts.event) params.event = opts.event as string;
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
