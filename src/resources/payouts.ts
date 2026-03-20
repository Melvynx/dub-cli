import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const payoutsResource = new Command("payouts")
  .description("View payouts");

// -- LIST --
payoutsResource
  .command("list")
  .description("List all payouts")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli payouts list\n  dub-cli payouts list --json",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const data = await client.get("/payouts");
      output(data, {
        json: !!opts.json,
        format: opts.format as string,
        fields: opts.fields ? (opts.fields as string).split(",") : undefined,
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
