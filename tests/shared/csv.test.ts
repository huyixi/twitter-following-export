import { describe, expect, it } from "vitest";
import { buildCsvFilename, serializeUsersToCsv } from "../../src/shared/csv";

describe("serializeUsersToCsv", () => {
  it("writes fields in the required order with a UTF-8 BOM", () => {
    const csv = serializeUsersToCsv([
      { username: "naval", displayName: "Naval", profileUrl: "https://x.com/naval" }
    ]);

    expect(csv).toBe("\uFEFFusername,display_name,profile_url\r\nnaval,Naval,https://x.com/naval");
  });

  it("escapes commas, quotes, and newlines", () => {
    const csv = serializeUsersToCsv([
      {
        username: "example",
        displayName: "Name, with \"quote\"\nand line",
        profileUrl: "https://x.com/example"
      }
    ]);

    expect(csv).toContain("example,\"Name, with \"\"quote\"\"\nand line\",https://x.com/example");
  });
});

describe("buildCsvFilename", () => {
  it("uses the source username and yyyy-mm-dd date", () => {
    expect(buildCsvFilename("Naval", new Date("2026-05-29T10:00:00Z"))).toBe(
      "twitter-following-naval-2026-05-29.csv"
    );
  });
});
