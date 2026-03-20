import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const metatagsResource = new Command("metatags")
  .description("Retrieve Open Graph metatags for a URL");

// -- GET --
metatagsResource
  .command("get")
  .description("Get OG metatags for a URL")
  .requiredOption("--url <url>", "URL to fetch metatags for")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli metatags get --url https://example.com\n  dub-cli metatags get --url https://example.com --json",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const data = await client.get("/metatags", { url: opts.url as string });
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
