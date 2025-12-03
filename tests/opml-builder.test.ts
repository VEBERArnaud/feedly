import { describe, it, expect } from "vitest";
import { buildOpml } from "../src/opml-builder.js";
import type { FeedsData } from "../src/types.js";

describe("buildOpml", () => {
  it("should generate valid OPML structure", () => {
    const feeds: FeedsData = {
      Tech: {
        Web: [
          {
            title: "CSS-Tricks",
            xmlUrl: "https://css-tricks.com/feed/",
            htmlUrl: "https://css-tricks.com/",
          },
        ],
      },
    };

    const opml = buildOpml("Test OPML", feeds);

    expect(opml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(opml).toContain('<opml version="2.0">');
    expect(opml).toContain("<head>");
    expect(opml).toContain("<title>Test OPML</title>");
    expect(opml).toContain("</head>");
    expect(opml).toContain("<body>");
    expect(opml).toContain("</body>");
    expect(opml).toContain("</opml>");
  });

  it("should create folder with category/subcategory name", () => {
    const feeds: FeedsData = {
      Tech: {
        Web: [
          {
            title: "Test Feed",
            xmlUrl: "https://example.com/feed",
            htmlUrl: "https://example.com",
          },
        ],
      },
    };

    const opml = buildOpml("Test", feeds);

    expect(opml).toContain('text="Tech / Web"');
    expect(opml).toContain('title="Tech / Web"');
  });

  it("should include feed with all attributes", () => {
    const feeds: FeedsData = {
      Category: {
        Sub: [
          {
            title: "My Feed",
            xmlUrl: "https://example.com/feed.xml",
            htmlUrl: "https://example.com",
          },
        ],
      },
    };

    const opml = buildOpml("Test", feeds);

    expect(opml).toContain('type="rss"');
    expect(opml).toContain('text="My Feed"');
    expect(opml).toContain('title="My Feed"');
    expect(opml).toContain('xmlUrl="https://example.com/feed.xml"');
    expect(opml).toContain('htmlUrl="https://example.com"');
  });

  it("should escape special characters in title", () => {
    const opml = buildOpml("Test & <Demo>", {});

    expect(opml).toContain("<title>Test &amp; &lt;Demo&gt;</title>");
  });

  it("should escape special characters in folder name", () => {
    const feeds: FeedsData = {
      "Tech & More": {
        'Web "Dev"': [],
      },
    };

    const opml = buildOpml("Test", feeds);

    expect(opml).toContain("Tech &amp; More / Web &quot;Dev&quot;");
  });

  it("should escape special characters in feed data", () => {
    const feeds: FeedsData = {
      Tech: {
        Web: [
          {
            title: "Feed <1>",
            xmlUrl: "https://example.com/feed?a=1&b=2",
            htmlUrl: "https://example.com",
          },
        ],
      },
    };

    const opml = buildOpml("Test", feeds);

    expect(opml).toContain("Feed &lt;1&gt;");
    expect(opml).toContain("a=1&amp;b=2");
  });

  it("should handle empty feeds object", () => {
    const opml = buildOpml("Empty", {});

    expect(opml).toContain("<body>");
    expect(opml).toContain("</body>");
    expect(opml).not.toContain("<outline");
  });

  it("should handle multiple categories and subcategories", () => {
    const feeds: FeedsData = {
      Tech: {
        Web: [{ title: "Web Feed", xmlUrl: "https://web.com/feed", htmlUrl: "https://web.com" }],
        Cloud: [
          { title: "Cloud Feed", xmlUrl: "https://cloud.com/feed", htmlUrl: "https://cloud.com" },
        ],
      },
      Business: {
        Finance: [
          {
            title: "Finance Feed",
            xmlUrl: "https://finance.com/feed",
            htmlUrl: "https://finance.com",
          },
        ],
      },
    };

    const opml = buildOpml("Test", feeds);

    expect(opml).toContain("Tech / Web");
    expect(opml).toContain("Tech / Cloud");
    expect(opml).toContain("Business / Finance");
    expect(opml).toContain("Web Feed");
    expect(opml).toContain("Cloud Feed");
    expect(opml).toContain("Finance Feed");
  });

  it("should handle multiple feeds in same subcategory", () => {
    const feeds: FeedsData = {
      Tech: {
        Web: [
          { title: "Feed 1", xmlUrl: "https://example.com/1", htmlUrl: "https://example.com" },
          { title: "Feed 2", xmlUrl: "https://example.com/2", htmlUrl: "https://example.com" },
          { title: "Feed 3", xmlUrl: "https://example.com/3", htmlUrl: "https://example.com" },
        ],
      },
    };

    const opml = buildOpml("Test", feeds);

    expect(opml).toContain("Feed 1");
    expect(opml).toContain("Feed 2");
    expect(opml).toContain("Feed 3");
  });
});
