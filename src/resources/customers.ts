import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const customersResource = new Command("customers")
  .description("Manage customers");

// -- LIST --
customersResource
  .command("list")
  .description("List all customers")
  .option("--fields <cols>", "Comma-separated columns to display")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli customers list\n  dub-cli customers list --json",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const data = await client.get("/customers");
      output(data, {
        json: !!opts.json,
        format: opts.format as string,
        fields: opts.fields ? (opts.fields as string).split(",") : undefined,
      });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- GET --
customersResource
  .command("get")
  .description("Get a customer by ID")
  .argument("<id>", "Customer ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli customers get cust_1234\n  dub-cli customers get cust_1234 --json",
  )
  .action(async (id: string, opts: { json?: boolean; format?: string }) => {
    try {
      const data = await client.get(`/customers/${id}`);
      output(data, { json: opts.json, format: opts.format });
    } catch (err) {
      handleError(err, opts.json);
    }
  });

// -- UPDATE --
customersResource
  .command("update")
  .description("Update a customer")
  .argument("<id>", "Customer ID")
  .option("--name <name>", "New customer name")
  .option("--email <email>", "New customer email")
  .option("--external-id <externalId>", "New external ID")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    '\nExamples:\n  dub-cli customers update cust_1234 --name "John Doe"\n  dub-cli customers update cust_1234 --email john@example.com --json',
  )
  .action(async (id: string, opts: Record<string, string | boolean | undefined>) => {
    try {
      const body: Record<string, unknown> = {};
      if (opts.name) body.name = opts.name;
      if (opts.email) body.email = opts.email;
      if (opts.externalId) body.externalId = opts.externalId;

      const data = await client.patch(`/customers/${id}`, body);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });

// -- DELETE --
customersResource
  .command("delete")
  .description("Delete a customer")
  .argument("<id>", "Customer ID")
  .option("--json", "Output as JSON")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli customers delete cust_1234\n  dub-cli customers delete cust_1234 --json",
  )
  .action(async (id: string, opts: { json?: boolean }) => {
    try {
      const data = await client.delete(`/customers/${id}`);
      output(data ?? { deleted: true, id }, { json: opts.json });
    } catch (err) {
      handleError(err, opts.json);
    }
  });
