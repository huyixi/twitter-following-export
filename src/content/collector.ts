import { COLLECTION_LIMIT, SCROLL_INTERVAL_MS, SCROLL_STEP_PX } from "../shared/constants";
import type { CollectionSnapshot, CollectionStatus, FollowingUser } from "../shared/types";
import { extractFollowingUsers } from "./extractUsers";

interface CollectorOptions {
  root?: ParentNode;
  sourceUsername: string | null;
  scrollBy?: (pixels: number) => void;
  onUpdate?: (snapshot: CollectionSnapshot) => void;
}

export interface Collector {
  start: () => CollectionSnapshot;
  stop: () => CollectionSnapshot;
  getSnapshot: () => CollectionSnapshot;
}

export function createCollector(options: CollectorOptions): Collector {
  const root = options.root ?? document;
  const scrollBy = options.scrollBy ?? ((pixels) => window.scrollBy({ top: pixels, behavior: "smooth" }));
  const usersByUsername = new Map<string, FollowingUser>();
  let status: CollectionStatus = "idle";
  let intervalId: number | null = null;

  const snapshot = (): CollectionSnapshot => ({
    sourceUsername: options.sourceUsername,
    status,
    users: Array.from(usersByUsername.values()),
    count: usersByUsername.size,
    limit: COLLECTION_LIMIT
  });

  const emit = () => {
    const current = snapshot();
    options.onUpdate?.(current);
    return current;
  };

  const clearTimer = () => {
    if (intervalId !== null) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  };

  const collectOnce = () => {
    for (const user of extractFollowingUsers(root)) {
      if (usersByUsername.size >= COLLECTION_LIMIT) {
        break;
      }
      usersByUsername.set(user.username, user);
    }

    if (usersByUsername.size >= COLLECTION_LIMIT) {
      status = "limit_reached";
      clearTimer();
      return emit();
    }

    scrollBy(SCROLL_STEP_PX);
    return emit();
  };

  return {
    start() {
      if (status !== "idle") {
        return snapshot();
      }
      status = "collecting";
      collectOnce();
      if (status === "collecting") {
        intervalId = window.setInterval(collectOnce, SCROLL_INTERVAL_MS);
      }
      return snapshot();
    },
    stop() {
      if (status === "collecting") {
        status = "stopped";
        clearTimer();
      }
      return emit();
    },
    getSnapshot() {
      return snapshot();
    }
  };
}
