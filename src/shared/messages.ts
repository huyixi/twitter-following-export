import type { CollectionSnapshot, FollowingUser, PageInfo } from "./types";

export type ContentMessage =
  | { type: "GET_STATE" }
  | { type: "START_COLLECTION" }
  | { type: "STOP_COLLECTION" };

export type ContentResponse =
  | { ok: true; snapshot: CollectionSnapshot; pageInfo: PageInfo }
  | { ok: false; error: string };

export type BackgroundMessage = {
  type: "DOWNLOAD_CSV";
  payload: {
    sourceUsername: string;
    users: FollowingUser[];
  };
};

export type BackgroundResponse =
  | { ok: true; downloadId?: number }
  | { ok: false; error: string };
