import type { Feed, FeedsData, ValidationError, ValidationResult } from "./types.js";

/**
 * Type guard to check if an unknown value is a valid Feed object
 */
function isValidFeed(feed: unknown): feed is Feed {
  if (typeof feed !== "object" || feed === null) {
    return false;
  }

  const f = feed as Record<string, unknown>;

  return (
    typeof f.title === "string" &&
    f.title.length > 0 &&
    typeof f.xmlUrl === "string" &&
    f.xmlUrl.length > 0 &&
    typeof f.htmlUrl === "string" &&
    f.htmlUrl.length > 0
  );
}

/**
 * Validates the feeds.json data structure.
 *
 * @param data - Unknown data to validate
 * @returns ValidationResult with either the validated data or an array of errors
 */
export function validateFeeds(data: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (typeof data !== "object" || data === null) {
    return {
      success: false,
      errors: [{ path: "root", message: "feeds.json must be an object" }],
    };
  }

  for (const [category, subcategories] of Object.entries(data)) {
    if (typeof subcategories !== "object" || subcategories === null) {
      errors.push({
        path: category,
        message: `Category "${category}" must contain subcategories object`,
      });
      continue;
    }

    for (const [subcategory, feedList] of Object.entries(
      subcategories as Record<string, unknown>
    )) {
      const feedPath = `${category} / ${subcategory}`;

      if (!Array.isArray(feedList)) {
        errors.push({
          path: feedPath,
          message: "Must be an array of feeds",
        });
        continue;
      }

      feedList.forEach((feed: unknown, index: number) => {
        const itemPath = `${feedPath}[${String(index)}]`;

        if (!isValidFeed(feed)) {
          if (typeof feed !== "object" || feed === null) {
            errors.push({ path: itemPath, message: "Must be an object" });
          } else {
            const f = feed as Record<string, unknown>;

            if (typeof f.title !== "string" || f.title.length === 0) {
              errors.push({ path: itemPath, message: 'Missing or invalid "title"' });
            }
            if (typeof f.xmlUrl !== "string" || f.xmlUrl.length === 0) {
              errors.push({ path: itemPath, message: 'Missing or invalid "xmlUrl"' });
            }
            if (typeof f.htmlUrl !== "string" || f.htmlUrl.length === 0) {
              errors.push({ path: itemPath, message: 'Missing or invalid "htmlUrl"' });
            }
          }
        }
      });
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: data as FeedsData };
}
