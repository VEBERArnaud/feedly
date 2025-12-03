import { describe, it, expect } from "vitest";
import { escapeXmlAttribute } from "../src/xml-utils.js";

describe("escapeXmlAttribute", () => {
  it("should escape ampersand", () => {
    expect(escapeXmlAttribute("A & B")).toBe("A &amp; B");
  });

  it("should escape double quotes", () => {
    expect(escapeXmlAttribute('Say "hello"')).toBe("Say &quot;hello&quot;");
  });

  it("should escape less than", () => {
    expect(escapeXmlAttribute("a < b")).toBe("a &lt; b");
  });

  it("should escape greater than", () => {
    expect(escapeXmlAttribute("a > b")).toBe("a &gt; b");
  });

  it("should escape multiple special characters", () => {
    expect(escapeXmlAttribute('<script>"alert(1)"</script>')).toBe(
      "&lt;script&gt;&quot;alert(1)&quot;&lt;/script&gt;"
    );
  });

  it("should handle empty string", () => {
    expect(escapeXmlAttribute("")).toBe("");
  });

  it("should not modify string without special characters", () => {
    expect(escapeXmlAttribute("Hello World")).toBe("Hello World");
  });

  it("should escape ampersand before other characters to avoid double-escaping", () => {
    expect(escapeXmlAttribute("&quot;")).toBe("&amp;quot;");
  });
});
