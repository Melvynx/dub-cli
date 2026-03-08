import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const foldersResource = new Command("folders")
  .description("Manage folders");

// -- LIST --
foldersResource
  .command("list")
  .description("List all folders")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli folders list\n  dub-cli folders list --json",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const data = await client.get("/folders");
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
foldersResource
  .command("create")
  .description("Create a new folder")
  .requiredOption("--name <name>", "Folder name")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    '\nExamples:\n  dub-cli folders create --name "Marketing"\n  dub-cli folders create --name "Blog Links" --json',
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = { name: opts.name };
      const data = await client.post("/folders", body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- UPDATE --
foldersResource
  .command("update")
  .description("Update a folder")
  .argument("<id>", "Folder ID")
  .option("--name <name>", "New folder name")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    '\nExamples:\n  dub-cli folders update fold_1234 --name "New Name"\n  dub-cli folders update fold_1234 --name "Renamed" --json',
  )
  .action(async (id: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;

      const data = await client.patch(`/folders/${id}`, body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- DELETE --
foldersResource
  .command("delete")
  .description("Delete a folder")
  .argument("<id>", "Folder ID")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli folders delete fold_1234\n  dub-cli folders delete fold_1234 --json",
  )
  .action(async (id: string, opts: { json?: boolean }) => {
    try {
      const data = await client.delete(`/folders/${id}`);
      output(data ?? { deleted: true, id }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
