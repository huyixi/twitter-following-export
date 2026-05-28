import type { FollowingUser } from "../shared/types";
import { parseProfilePath } from "../shared/twitterUrl";

const USER_CARD_SELECTOR = '[data-testid="UserCell"], div[role="listitem"], article';

export function extractFollowingUsers(root: ParentNode = document): FollowingUser[] {
  const cards = Array.from(root.querySelectorAll<HTMLElement>(USER_CARD_SELECTOR));
  const usersByUsername = new Map<string, FollowingUser>();

  for (const card of cards) {
    const anchors = Array.from(card.querySelectorAll<HTMLAnchorElement>("a[href]"));
    const profileAnchor = anchors.find((anchor) =>
      parseProfilePath(anchor.getAttribute("href") ?? "")
    );
    const username = profileAnchor
      ? parseProfilePath(profileAnchor.getAttribute("href") ?? "")
      : null;

    if (!username || usersByUsername.has(username)) {
      continue;
    }

    usersByUsername.set(username, {
      username,
      displayName: readDisplayName(card, username),
      profileUrl: `https://x.com/${username}`
    });
  }

  return Array.from(usersByUsername.values());
}

function readDisplayName(card: HTMLElement, username: string): string {
  const textNodes = Array.from(card.querySelectorAll("span, div[dir='ltr']"))
    .map((node) => node.textContent?.trim() ?? "")
    .filter(Boolean);

  const displayName = textNodes.find((text) => {
    const lower = text.toLowerCase();
    return lower !== `@${username}` && lower !== "follow" && lower !== "following";
  });

  return displayName ?? username;
}
