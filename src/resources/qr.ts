import { Command } from "commander";
import { client } from "../lib/client.js";
import { output } from "../lib/output.js";
import { handleError } from "../lib/errors.js";

export const qrResource = new Command("qr")
  .description("Generate QR codes");

// -- GET --
qrResource
  .command("get")
  .description("Generate a QR code for a URL")
  .requiredOption("--url <url>", "URL to generate QR code for")
  .option("--size <n>", "QR code size in pixels", "600")
  .option("--level <level>", "Error correction level: L, M, Q, H", "L")
  .option("--fg-color <color>", "Foreground color (hex)", "#000000")
  .option("--bg-color <color>", "Background color (hex)", "#FFFFFF")
  .option("--json", "Output as JSON")
  .option("--format <fmt>", "Output format: text, json, csv, yaml")
  .addHelpText(
    "after",
    "\nExamples:\n  dub-cli qr get --url https://dub.sh/github --json\n  dub-cli qr get --url https://example.com --size 300",
  )
  .action(async (opts: Record<string, string | boolean | undefined>) => {
    try {
      const params: Record<string, string> = {
        url: opts.url as string,
      };
      if (opts.size) params.size = opts.size as string;
      if (opts.level) params.level = opts.level as string;
      if (opts.fgColor) params.fgColor = opts.fgColor as string;
      if (opts.bgColor) params.bgColor = opts.bgColor as string;

      const data = await client.get("/qr", params);
      output(data, { json: !!opts.json, format: opts.format as string });
    } catch (err) {
      handleError(err, !!opts.json);
    }
  });
