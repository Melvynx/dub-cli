import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const trackResource = new Command("track")
  .description("Track conversions (leads and sales)");

// -- LEAD --
trackResource
  .command("lead")
  .description("Track a lead conversion")
  .requiredOption("--click-id <clickId>", "Click ID from dub_id cookie")
  .requiredOption("--event-name <eventName>", "Event name (e.g. 'Sign up')")
  .requiredOption("--customer-external-id <customerExternalId>", "Unique customer ID in your system")
  .option("--customer-name <customerName>", "Customer name")
  .option("--customer-email <customerEmail>", "Customer email")
  .option("--customer-avatar <customerAvatar>", "Customer avatar URL")
  .option("--mode <mode>", "Mode: async, wait, deferred", "async")
  .option("--event-quantity <n>", "How many times to track")
  .option("--metadata <json>", "JSON metadata object")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    `\nExamples:\n  dub-cli track lead --click-id clk_123 --event-name "Sign up" --customer-external-id usr_456 --json`,
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = {
        clickId: opts.clickId,
        eventName: opts.eventName,
        customerExternalId: opts.customerExternalId,
      };
      if (opts.customerName) body.customerName = opts.customerName;
      if (opts.customerEmail) body.customerEmail = opts.customerEmail;
      if (opts.customerAvatar) body.customerAvatar = opts.customerAvatar;
      if (opts.mode) body.mode = opts.mode;
      if (opts.eventQuantity) body.eventQuantity = Number(opts.eventQuantity);
      if (opts.metadata) body.metadata = JSON.parse(opts.metadata as string);

      const data = await client.post("/track/lead", body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- SALE --
trackResource
  .command("sale")
  .description("Track a sale conversion")
  .requiredOption("--customer-external-id <customerExternalId>", "Unique customer ID in your system")
  .requiredOption("--amount <amount>", "Sale amount in cents")
  .option("--currency <currency>", "ISO 4217 currency code", "usd")
  .option("--event-name <eventName>", "Event name", "Purchase")
  .option("--payment-processor <processor>", "Processor: stripe, shopify, polar, paddle, revenuecat, custom", "custom")
  .option("--invoice-id <invoiceId>", "Invoice ID (idempotency key)")
  .option("--click-id <clickId>", "Click ID from dub_id cookie")
  .option("--customer-name <customerName>", "Customer name")
  .option("--customer-email <customerEmail>", "Customer email")
  .option("--customer-avatar <customerAvatar>", "Customer avatar URL")
  .option("--lead-event-name <leadEventName>", "Associated lead event name")
  .option("--metadata <json>", "JSON metadata object")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    `\nExamples:\n  dub-cli track sale --customer-external-id usr_456 --amount 4999 --json\n  dub-cli track sale --customer-external-id usr_456 --amount 9900 --currency usd --payment-processor stripe`,
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = {
        customerExternalId: opts.customerExternalId,
        amount: Number(opts.amount),
      };
      if (opts.currency) body.currency = opts.currency;
      if (opts.eventName) body.eventName = opts.eventName;
      if (opts.paymentProcessor) body.paymentProcessor = opts.paymentProcessor;
      if (opts.invoiceId) body.invoiceId = opts.invoiceId;
      if (opts.clickId) body.clickId = opts.clickId;
      if (opts.customerName) body.customerName = opts.customerName;
      if (opts.customerEmail) body.customerEmail = opts.customerEmail;
      if (opts.customerAvatar) body.customerAvatar = opts.customerAvatar;
      if (opts.leadEventName) body.leadEventName = opts.leadEventName;
      if (opts.metadata) body.metadata = JSON.parse(opts.metadata as string);

      const data = await client.post("/track/sale", body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
