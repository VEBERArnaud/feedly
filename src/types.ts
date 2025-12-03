/**
 * A single RSS/Atom feed entry
 */
export interface Feed {
  readonly title: string;
  readonly xmlUrl: string;
  readonly htmlUrl: string;
}

/**
 * Subcategory containing an array of feeds
 */
export type Subcategory = readonly Feed[];

/**
 * Category containing subcategories
 */
export type Category = Readonly<Record<string, Subcategory>>;

/**
 * Root structure: nested categories with subcategories
 */
export type FeedsData = Readonly<Record<string, Category>>;

/**
 * Validation error with path information
 */
export interface ValidationError {
  readonly path: string;
  readonly message: string;
}

/**
 * Result of feed validation
 */
export type ValidationResult =
  | { readonly success: true; readonly data: FeedsData }
  | { readonly success: false; readonly errors: readonly ValidationError[] };
