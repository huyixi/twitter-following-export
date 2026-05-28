import { RESERVED_TWITTER_PATHS, TWITTER_USERNAME_PATTERN } from "./constants";
import type { PageInfo } from "./types";

const SUPPORTED_HOSTS = new Set(["x.com", "twitter.com", "www.x.com", "www.twitter.com"]);

export function normalizeUsername(value: string): string | null {
  const username = value.replace(/^@/, "").trim().toLowerCase();
  if (!TWITTER_USERNAME_PATTERN.test(username)) {
    return null;
  }
  if (RESERVED_TWITTER_PATHS.has(username)) {
    return null;
  }
  return username;
}

export function parseProfilePath(rawHref: string): string | null {
  try {
    const url = rawHref.startsWith("http")
      ? new URL(rawHref)
      : new URL(rawHref, "https://x.com");
    if (!SUPPORTED_HOSTS.has(url.hostname)) {
      return null;
    }

    const [firstSegment] = url.pathname.split("/").filter(Boolean);
    if (!firstSegment) {
      return null;
    }

    return normalizeUsername(firstSegment);
  } catch {
    return null;
  }
}

export function parseFollowingUrl(rawUrl: string): PageInfo {
  try {
    const url = new URL(rawUrl);
    if (!SUPPORTED_HOSTS.has(url.hostname)) {
      return { isFollowingPage: false, sourceUsername: null };
    }

    const [usernameSegment, section] = url.pathname.split("/").filter(Boolean);
    const sourceUsername = usernameSegment ? normalizeUsername(usernameSegment) : null;
    if (!sourceUsername || section !== "following") {
      return { isFollowingPage: false, sourceUsername: null };
    }

    return { isFollowingPage: true, sourceUsername };
  } catch {
    return { isFollowingPage: false, sourceUsername: null };
  }
}
