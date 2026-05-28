import { describe, expect, it } from "vitest";
import { parseFollowingUrl, parseProfilePath } from "../../src/shared/twitterUrl";

describe("parseFollowingUrl", () => {
  it("accepts x.com following pages", () => {
    expect(parseFollowingUrl("https://x.com/naval/following")).toEqual({
      isFollowingPage: true,
      sourceUsername: "naval"
    });
  });

  it("accepts twitter.com following pages with query strings", () => {
    expect(parseFollowingUrl("https://twitter.com/paulg/following?lang=en")).toEqual({
      isFollowingPage: true,
      sourceUsername: "paulg"
    });
  });

  it("rejects non-following pages and reserved paths", () => {
    expect(parseFollowingUrl("https://x.com/naval")).toEqual({
      isFollowingPage: false,
      sourceUsername: null
    });
    expect(parseFollowingUrl("https://x.com/home/following")).toEqual({
      isFollowingPage: false,
      sourceUsername: null
    });
  });
});

describe("parseProfilePath", () => {
  it("returns normalized usernames from valid profile links", () => {
    expect(parseProfilePath("/sama")).toBe("sama");
    expect(parseProfilePath("https://x.com/jack")).toBe("jack");
  });

  it("filters reserved and invalid paths", () => {
    expect(parseProfilePath("/home")).toBeNull();
    expect(parseProfilePath("/i/flow/login")).toBeNull();
    expect(parseProfilePath("/too-long-username-value")).toBeNull();
    expect(parseProfilePath("https://example.com/naval")).toBeNull();
  });
});
