import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { validateFeeds } from "./validator.js";
import { buildNestedOpml, buildOpml } from "./opml-builder.js";

const OPML_TITLE = "Feedly Arnaud 2-level architecture";
const FLAT_OUTPUT = "feedly.opml";
const NESTED_OUTPUT = "feedme-nested.opml";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

/**
 * Loads and parses the feeds.json file
 */
function loadFeeds(): unknown {
  const feedsPath = join(__dirname, "..", "feeds.json");
  const content = readFileSync(feedsPath, "utf-8");

  return JSON.parse(content) as unknown;
}

/**
 * Writes an OPML document in the current directory
 */
function writeOpml(fileName: string, opml: string): void {
  const outputPath = join(process.cwd(), fileName);

  writeFileSync(outputPath, opml, "utf-8");
  console.log(`OPML file generated: ${outputPath}`);
}

/**
 * Main entry point
 */
function main(): void {
  const rawFeeds = loadFeeds();
  const validationResult = validateFeeds(rawFeeds);

  if (!validationResult.success) {
    console.error("Invalid feeds.json:");

    for (const error of validationResult.errors) {
      console.error(`  - ${error.path}: ${error.message}`);
    }

    process.exit(1);
  }

  writeOpml(FLAT_OUTPUT, buildOpml(OPML_TITLE, validationResult.data));
  writeOpml(NESTED_OUTPUT, buildNestedOpml(OPML_TITLE, validationResult.data));
}

main();
