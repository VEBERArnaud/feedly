import type { Feed, FeedsData } from "./types.js";
import { escapeXmlAttribute } from "./xml-utils.js";

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';
const OPML_VERSION = "2.0";

const FOLDER_INDENT = "    ";
const INDENT_STEP = "  ";

/**
 * Builds an OPML outline element for a single feed
 */
function buildFeedOutline(feed: Feed, indent: string): string {
  const text = escapeXmlAttribute(feed.title);
  const xmlUrl = escapeXmlAttribute(feed.xmlUrl);
  const htmlUrl = escapeXmlAttribute(feed.htmlUrl);

  return `${indent}<outline type="rss" text="${text}" title="${text}" xmlUrl="${xmlUrl}" htmlUrl="${htmlUrl}"/>`;
}

/**
 * Builds an OPML folder outline around already built child lines
 */
function buildFolderOutline(name: string, children: readonly string[], indent: string): string[] {
  const escapedName = escapeXmlAttribute(name);

  return [
    `${indent}<outline text="${escapedName}" title="${escapedName}">`,
    ...children,
    `${indent}</outline>`,
  ];
}

/**
 * Builds an OPML folder outline containing feeds
 */
function buildFeedFolder(name: string, feeds: readonly Feed[], indent: string): string[] {
  const children = feeds.map((feed) => buildFeedOutline(feed, indent + INDENT_STEP));

  return buildFolderOutline(name, children, indent);
}

/**
 * Wraps body lines in a complete OPML 2.0 document
 */
function buildDocument(title: string, body: readonly string[]): string {
  return [
    XML_DECLARATION,
    `<opml version="${OPML_VERSION}">`,
    "  <head>",
    `    <title>${escapeXmlAttribute(title)}</title>`,
    "  </head>",
    "  <body>",
    ...body,
    "  </body>",
    "</opml>",
  ].join("\n");
}

/**
 * Builds a flat OPML 2.0 document from feeds data: one `Category / Subcategory`
 * folder per subcategory, as Feedly only supports one level of folders.
 *
 * @param title - The title for the OPML document
 * @param feeds - The validated feeds data structure
 * @returns Complete OPML XML string
 */
export function buildOpml(title: string, feeds: FeedsData): string {
  const body = Object.entries(feeds).flatMap(([category, subcategories]) =>
    Object.entries(subcategories).flatMap(([subcategory, feedList]) =>
      buildFeedFolder(`${category} / ${subcategory}`, feedList, FOLDER_INDENT)
    )
  );

  return buildDocument(title, body);
}

/**
 * Builds a nested OPML 2.0 document from feeds data: each category is a folder
 * containing its subcategories, which contain the feeds.
 *
 * @param title - The title for the OPML document
 * @param feeds - The validated feeds data structure
 * @returns Complete OPML XML string
 */
export function buildNestedOpml(title: string, feeds: FeedsData): string {
  const body = Object.entries(feeds).flatMap(([category, subcategories]) => {
    const children = Object.entries(subcategories).flatMap(([subcategory, feedList]) =>
      buildFeedFolder(subcategory, feedList, FOLDER_INDENT + INDENT_STEP)
    );

    return buildFolderOutline(category, children, FOLDER_INDENT);
  });

  return buildDocument(title, body);
}
