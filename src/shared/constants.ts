export const COLLECTION_LIMIT = 1000;
export const SCROLL_INTERVAL_MS = 1500;
export const SCROLL_STEP_PX = 900;

export const STATUS_LABELS = {
  idle: "未开始",
  collecting: "采集中",
  stopped: "已停止",
  limit_reached: "已达到上限"
} as const;

export const NO_DATA_EXPORT_LABEL = "暂无数据可导出";

export const RESERVED_TWITTER_PATHS = new Set([
  "home",
  "explore",
  "notifications",
  "messages",
  "settings",
  "i",
  "search",
  "compose"
]);

export const TWITTER_USERNAME_PATTERN = /^[A-Za-z0-9_]{1,15}$/;
