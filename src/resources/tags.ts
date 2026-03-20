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
  .option("--sort <sort>", "Sort by: name, createdAt", "name")
  .option("--sort-order <order>", "Sort order: asc, desc", "asc")
  .option("--search <query>", "Search by tag name")
  .option("--ids <ids>", "Comma-separated tag IDs to filter")
  .option("--page <n>", "Page number", "1")
  .option("--page-size <n>", "Results per page (max 100)", "100")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli tags list\n  dub-cli tags list --search marketing --json\n  dub-cli tags list --sort createdAt --sort-order desc",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const params: Record<string, string> = {};
      if (opts.sort) params.sortBy = opts.sort as string;
      if (opts.sortOrder) params.sortOrder = opts.sortOrder as string;
      if (opts.search) params.search = opts.search as string;
      if (opts.ids) params.ids = opts.ids as string;
      if (opts.page) params.page = opts.page as string;
      if (opts.pageSize) params.pageSize = opts.pageSize as string;

      const data = await client.get("/tags", params);
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
  .requiredOption("--name <name>", "Tag name (1-50 chars)")
  .option("--color <color>", "Tag color: red, yellow, green, blue, purple, brown, gray, pink")
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
  .option("--color <color>", "New color: red, yellow, green, blue, purple, brown, gray, pink")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    '\nExamples:\n  dub-cli tags update tag_123 --name "New Name"\n  dub-cli tags update tag_123 --color green --json',
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

// -- DELETE --
tagsResource
  .command("delete")
  .description("Delete a tag")
  .argument("<id>", "Tag ID")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli tags delete tag_123\n  dub-cli tags delete tag_123 --json",
  )
  .action(async (id: string, opts: { json?: boolean }) => {
    try {
      const data = await client.delete(`/tags/${id}`);
      output(data ?? { deleted: true, id }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
