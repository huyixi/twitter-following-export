import { describe, expect, it } from "vitest";
import { extractFollowingUsers } from "../../src/content/extractUsers";

describe("extractFollowingUsers", () => {
  it("extracts username, display name, and canonical profile URL from user cells", () => {
    document.body.innerHTML = `
      <main>
        <div data-testid="UserCell">
          <a href="/naval">
            <div dir="ltr"><span>Naval</span></div>
            <div dir="ltr"><span>@naval</span></div>
          </a>
        </div>
        <div data-testid="UserCell">
          <a href="https://x.com/paulg">
            <div dir="ltr"><span>Paul Graham</span></div>
            <div dir="ltr"><span>@paulg</span></div>
          </a>
        </div>
      </main>
    `;

    expect(extractFollowingUsers(document)).toEqual([
      { username: "naval", displayName: "Naval", profileUrl: "https://x.com/naval" },
      { username: "paulg", displayName: "Paul Graham", profileUrl: "https://x.com/paulg" }
    ]);
  });

  it("deduplicates usernames and ignores navigation links outside user cells", () => {
    document.body.innerHTML = `
      <nav><a href="/home">Home</a><a href="/messages">Messages</a></nav>
      <div data-testid="UserCell"><a href="/sama"><span>Sam Altman</span><span>@sama</span></a></div>
      <div data-testid="UserCell"><a href="/sama"><span>Sam Altman</span><span>@sama</span></a></div>
      <div data-testid="UserCell"><a href="/i/flow/login"><span>Login</span></a></div>
    `;

    expect(extractFollowingUsers(document)).toEqual([
      { username: "sama", displayName: "Sam Altman", profileUrl: "https://x.com/sama" }
    ]);
  });
});
