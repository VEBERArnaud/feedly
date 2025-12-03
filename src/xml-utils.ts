/**
 * Escapes special XML characters in attribute values.
 * Follows XML 1.0 specification for attribute escaping.
 *
 * @param value - The string to escape
 * @returns The escaped string safe for use in XML attributes
 */
export function escapeXmlAttribute(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
