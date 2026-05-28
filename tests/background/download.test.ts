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

    const base64 = options.url.split(";base64,")[1];
    const csv = atob(base64);
    expect(csv).toContain("username,display_name,profile_url");
    expect(csv).toContain("paulg,Paul Graham,https://x.com/paulg");
  });
});
