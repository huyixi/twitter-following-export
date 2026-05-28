import { describe, expect, it } from "vitest";
import { createDownloadOptions } from "../../src/background/index";

describe("createDownloadOptions", () => {
  it("creates a CSV data URL and required filename", () => {
    const options = createDownloadOptions({
      sourceUsername: "naval",
      users: [{ username: "paulg", displayName: "Paul Graham", profileUrl: "https://x.com/paulg" }],
      now: new Date("2026-05-29T00:00:00Z")
    });

    expect(options.filename).toBe("twitter-following-naval-2026-05-29.csv");
    expect(options.saveAs).toBe(true);
    expect(decodeURIComponent(options.url)).toContain("username,display_name,profile_url");
    expect(decodeURIComponent(options.url)).toContain("paulg,Paul Graham,https://x.com/paulg");
  });
});
