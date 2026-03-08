import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const tagsResource = new Command("tags")
  .description("Manage tags");

// -- LIST --
tagsResource
  .command("list")
  .description("List all tags")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli tags list\n  dub-cli tags list --json",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const data = await client.get("/tags");
      output(data, {
        json: !!opts.json,
        format: opts.format as string,
        fields: opts.fields ? (opts.fields as string).split(",") : undefined,
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- CREATE --
tagsResource
  .command("create")
  .description("Create a new tag")
  .requiredOption("--name <name>", "Tag name")
  .option("--color <color>", "Tag color: red, yellow, green, blue, purple, pink, brown")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    '\nExamples:\n  dub-cli tags create --name "Marketing"\n  dub-cli tags create --name "Blog" --color blue --json',
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = { name: opts.name };
      if (opts.color) body.color = opts.color;

      const data = await client.post("/tags", body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- UPDATE --
tagsResource
  .command("update")
  .description("Update a tag")
  .argument("<id>", "Tag ID")
  .option("--name <name>", "New tag name")
  .option("--color <color>", "New tag color: red, yellow, green, blue, purple, pink, brown")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    '\nExamples:\n  dub-cli tags update clx1234 --name "New Name"\n  dub-cli tags update clx1234 --color green --json',
  )
  .action(async (id: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;
      if (opts.color) body.color = opts.color;

      const data = await client.patch(`/tags/${id}`, body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
