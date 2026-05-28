export type CollectionStatus = "idle" | "collecting" | "stopped" | "limit_reached";

export interface FollowingUser {
  username: string;
  displayName: string;
  profileUrl: string;
}

export interface PageInfo {
  isFollowingPage: boolean;
  sourceUsername: string | null;
}

export interface CollectionSnapshot {
  sourceUsername: string | null;
  status: CollectionStatus;
  users: FollowingUser[];
  count: number;
  limit: number;
}
