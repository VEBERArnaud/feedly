import type { Feed, FeedsData } from "./types.js";
import { escapeXmlAttribute } from "./xml-utils.js";

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';
const OPML_VERSION = "2.0";

/**
 * Builds an OPML outline element for a single feed
 */
function buildFeedOutline(feed: Feed): string {
  const text = escapeXmlAttribute(feed.title);
  const xmlUrl = escapeXmlAttribute(feed.xmlUrl);
  const htmlUrl = escapeXmlAttribute(feed.htmlUrl);

  return `      <outline type="rss" text="${text}" title="${text}" xmlUrl="${xmlUrl}" htmlUrl="${htmlUrl}"/>`;
}

/**
 * Builds an OPML folder outline containing feeds
 */
function buildFolderOutline(folderName: string, feeds: readonly Feed[]): string[] {
  const escapedName = escapeXmlAttribute(folderName);
  const lines: string[] = [];

  lines.push(`    <outline text="${escapedName}" title="${escapedName}">`);

  for (const feed of feeds) {
    lines.push(buildFeedOutline(feed));
  }

  lines.push("    </outline>");

  return lines;
}

/**
 * Builds a complete OPML 2.0 document from feeds data.
 *
 * @param title - The title for the OPML document
 * @param feeds - The validated feeds data structure
 * @returns Complete OPML XML string
 */
export function buildOpml(title: string, feeds: FeedsData): string {
  const lines: string[] = [];

  lines.push(XML_DECLARATION);
  lines.push(`<opml version="${OPML_VERSION}">`);
  lines.push("  <head>");
  lines.push(`    <title>${escapeXmlAttribute(title)}</title>`);
  lines.push("  </head>");
  lines.push("  <body>");

  for (const [category, subcategories] of Object.entries(feeds)) {
    for (const [subcategory, feedList] of Object.entries(subcategories)) {
      const folderName = `${category} / ${subcategory}`;
      lines.push(...buildFolderOutline(folderName, feedList));
    }
  }

  lines.push("  </body>");
  lines.push("</opml>");

  return lines.join("\n");
}
