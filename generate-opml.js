// generate-opml.js
// Génère un fichier OPML pour Feedly avec une architecture à 2 niveaux.

const fs = require("fs");
const path = require("path");

const OPML_TITLE = "Feedly Arnaud 2-level architecture";

const feeds = require("./feeds.json");

// Validate feeds.json structure
function validateFeeds(data) {
  const errors = [];

  if (typeof data !== "object" || data === null) {
    errors.push("feeds.json must be an object");
    return errors;
  }

  for (const [category, subcategories] of Object.entries(data)) {
    if (typeof subcategories !== "object" || subcategories === null) {
      errors.push(`Category "${category}" must contain subcategories object`);
      continue;
    }

    for (const [subcategory, feedList] of Object.entries(subcategories)) {
      if (!Array.isArray(feedList)) {
        errors.push(`"${category} / ${subcategory}" must be an array of feeds`);
        continue;
      }

      feedList.forEach((feed, index) => {
        const path = `"${category} / ${subcategory}"[${index}]`;

        if (typeof feed !== "object" || feed === null) {
          errors.push(`${path}: must be an object`);
          return;
        }

        if (typeof feed.title !== "string" || !feed.title) {
          errors.push(`${path}: missing or invalid "title"`);
        }
        if (typeof feed.xmlUrl !== "string" || !feed.xmlUrl) {
          errors.push(`${path}: missing or invalid "xmlUrl"`);
        }
        if (typeof feed.htmlUrl !== "string" || !feed.htmlUrl) {
          errors.push(`${path}: missing or invalid "htmlUrl"`);
        }
      });
    }
  }

  return errors;
}

// Petite fonction pour échapper correctement les attributs XML
function escapeAttr(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildOpml(title, tree) {
  const lines = [];

  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<opml version="2.0">');
  lines.push("  <head>");
  lines.push(`    <title>${escapeAttr(title)}</title>`);
  lines.push("  </head>");
  lines.push("  <body>");

  // Structure aplatie : "Catégorie / Sous-catégorie"
  for (const [topName, subfolders] of Object.entries(tree)) {
    for (const [subName, feedList] of Object.entries(subfolders)) {
      const folderName = `${topName} / ${subName}`;
      lines.push(
        `    <outline text="${escapeAttr(folderName)}" title="${escapeAttr(folderName)}">`
      );

      for (const feed of feedList) {
        lines.push(
          `      <outline type="rss" text="${escapeAttr(
            feed.title
          )}" title="${escapeAttr(feed.title)}" xmlUrl="${escapeAttr(
            feed.xmlUrl
          )}" htmlUrl="${escapeAttr(feed.htmlUrl)}"/>`
        );
      }

      lines.push("    </outline>");
    }
  }

  lines.push("  </body>");
  lines.push("</opml>");

  return lines.join("\n");
}

function main() {
  const validationErrors = validateFeeds(feeds);
  if (validationErrors.length > 0) {
    console.error("❌ Invalid feeds.json:");
    validationErrors.forEach((err) => console.error(`   - ${err}`));
    process.exit(1);
  }

  const opml = buildOpml(OPML_TITLE, feeds);
  const outPath = path.join(process.cwd(), "feedly.opml");

  fs.writeFileSync(outPath, opml, "utf8");
  console.log(`✅ Fichier OPML généré : ${outPath}`);
}

main();

