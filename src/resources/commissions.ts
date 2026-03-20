import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const commissionsResource = new Command("commissions")
  .description("Manage commissions");

// -- LIST --
commissionsResource
  .command("list")
  .description("List all commissions")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli commissions list\n  dub-cli commissions list --json",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const data = await client.get("/commissions");
      output(data, {
        json: !!opts.json,
        format: opts.format as string,
        fields: opts.fields ? (opts.fields as string).split(",") : undefined,
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- UPDATE --
commissionsResource
  .command("update")
  .description("Update a commission")
  .argument("<id>", "Commission ID")
  .option("--status <status>", "New status")
  .option("--amount <amount>", "New amount in cents")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli commissions update com_123 --status approved --json\n  dub-cli commissions update com_123 --amount 1500",
  )
  .action(async (id: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.status) body.status = opts.status;
      if (opts.amount) body.amount = Number(opts.amount);

      const data = await client.patch(`/commissions/${id}`, body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
