import { describe, it, expect } from "vitest";
import { validateFeeds } from "../src/validator.js";

describe("validateFeeds", () => {
  describe("valid input", () => {
    it("should accept valid feed structure", () => {
      const validData = {
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

      const result = validateFeeds(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it("should accept empty categories object", () => {
      const result = validateFeeds({});

      expect(result.success).toBe(true);
    });

    it("should accept empty subcategories", () => {
      const result = validateFeeds({ Tech: {} });

      expect(result.success).toBe(true);
    });

    it("should accept empty feed arrays", () => {
      const result = validateFeeds({ Tech: { Web: [] } });

      expect(result.success).toBe(true);
    });

    it("should accept multiple categories and subcategories", () => {
      const validData = {
        Tech: {
          Web: [
            { title: "Feed 1", xmlUrl: "https://example.com/1", htmlUrl: "https://example.com" },
          ],
          Cloud: [
            { title: "Feed 2", xmlUrl: "https://example.com/2", htmlUrl: "https://example.com" },
          ],
        },
        Business: {
          Finance: [
            { title: "Feed 3", xmlUrl: "https://example.com/3", htmlUrl: "https://example.com" },
          ],
        },
      };

      const result = validateFeeds(validData);

      expect(result.success).toBe(true);
    });
  });

  describe("invalid input", () => {
    it("should reject null", () => {
      const result = validateFeeds(null);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]?.message).toContain("must be an object");
      }
    });

    it("should reject undefined", () => {
      const result = validateFeeds(undefined);

      expect(result.success).toBe(false);
    });

    it("should reject non-object root (string)", () => {
      const result = validateFeeds("string");

      expect(result.success).toBe(false);
    });

    it("should reject non-object root (array)", () => {
      const result = validateFeeds([]);

      expect(result.success).toBe(false);
    });

    it("should reject non-object subcategory", () => {
      const result = validateFeeds({ Tech: "invalid" });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]?.path).toBe("Tech");
      }
    });

    it("should reject non-array feed list", () => {
      const result = validateFeeds({ Tech: { Web: "invalid" } });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]?.path).toBe("Tech / Web");
      }
    });

    it("should reject feed missing title", () => {
      const result = validateFeeds({
        Tech: {
          Web: [{ xmlUrl: "https://example.com/feed", htmlUrl: "https://example.com" }],
        },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.some((e) => e.message.includes("title"))).toBe(true);
      }
    });

    it("should reject feed with empty title", () => {
      const result = validateFeeds({
        Tech: {
          Web: [{ title: "", xmlUrl: "https://example.com/feed", htmlUrl: "https://example.com" }],
        },
      });

      expect(result.success).toBe(false);
    });

    it("should reject feed missing xmlUrl", () => {
      const result = validateFeeds({
        Tech: {
          Web: [{ title: "Test", htmlUrl: "https://example.com" }],
        },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.some((e) => e.message.includes("xmlUrl"))).toBe(true);
      }
    });

    it("should reject feed missing htmlUrl", () => {
      const result = validateFeeds({
        Tech: {
          Web: [{ title: "Test", xmlUrl: "https://example.com/feed" }],
        },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.some((e) => e.message.includes("htmlUrl"))).toBe(true);
      }
    });

    it("should reject non-object feed item", () => {
      const result = validateFeeds({
        Tech: {
          Web: ["not an object"],
        },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]?.message).toBe("Must be an object");
      }
    });

    it("should collect multiple errors", () => {
      const result = validateFeeds({
        Tech: {
          Web: [
            { title: "", xmlUrl: "", htmlUrl: "" },
            { title: "Valid", xmlUrl: "", htmlUrl: "https://example.com" },
          ],
        },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors.length).toBeGreaterThan(1);
      }
    });

    it("should include correct path in error for nested feeds", () => {
      const result = validateFeeds({
        Tech: {
          Web: [
            { title: "Valid", xmlUrl: "https://example.com/feed", htmlUrl: "https://example.com" },
            { title: "", xmlUrl: "https://example.com/feed", htmlUrl: "https://example.com" },
          ],
        },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errors[0]?.path).toBe("Tech / Web[1]");
      }
    });
  });
});
