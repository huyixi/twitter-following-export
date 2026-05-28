import { beforeEach, describe, expect, it, vi } from "vitest";
import { COLLECTION_LIMIT } from "../../src/shared/constants";
import { createCollector } from "../../src/content/collector";

describe("createCollector", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = "";
  });

  it("collects current users immediately and scrolls slowly", () => {
    document.body.innerHTML = `
      <div data-testid="UserCell"><a href="/naval"><span>Naval</span><span>@naval</span></a></div>
    `;
    const scrollBy = vi.fn();
    const collector = createCollector({
      root: document,
      sourceUsername: "source",
      scrollBy
    });

    collector.start();

    expect(collector.getSnapshot()).toMatchObject({
      status: "collecting",
      count: 1
    });
    expect(scrollBy).toHaveBeenCalledWith(900);
  });

  it("deduplicates users and stops at the collection limit", () => {
    const cells = Array.from({ length: COLLECTION_LIMIT + 5 }, (_, index) => {
      const username = `u${index}`;
      return `<div data-testid="UserCell"><a href="/${username}"><span>${username}</span><span>@${username}</span></a></div>`;
    }).join("");
    document.body.innerHTML = cells;

    const collector = createCollector({
      root: document,
      sourceUsername: "source",
      scrollBy: vi.fn()
    });

    collector.start();

    expect(collector.getSnapshot().count).toBe(COLLECTION_LIMIT);
    expect(collector.getSnapshot().status).toBe("limit_reached");
  });

  it("keeps collected data after stop", () => {
    document.body.innerHTML = `
      <div data-testid="UserCell"><a href="/sama"><span>Sam Altman</span><span>@sama</span></a></div>
    `;
    const collector = createCollector({
      root: document,
      sourceUsername: "source",
      scrollBy: vi.fn()
    });

    collector.start();
    collector.stop();

    expect(collector.getSnapshot()).toMatchObject({
      status: "stopped",
      count: 1
    });
  });
});
