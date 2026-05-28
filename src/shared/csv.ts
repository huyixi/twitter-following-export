import type { FollowingUser } from "./types";

const CSV_HEADER = ["username", "display_name", "profile_url"] as const;

export function serializeUsersToCsv(users: FollowingUser[]): string {
  const rows = users.map((user) => [
    user.username,
    user.displayName,
    user.profileUrl
  ]);

  return `\uFEFF${[CSV_HEADER, ...rows]
    .map((row) => row.map(escapeCsvField).join(","))
    .join("\r\n")}`;
}

export function buildCsvFilename(sourceUsername: string, date = new Date()): string {
  const normalizedSource = sourceUsername.replace(/^@/, "").trim().toLowerCase();
  const yyyyMmDd = date.toISOString().slice(0, 10);
  return `twitter-following-${normalizedSource}-${yyyyMmDd}.csv`;
}

function escapeCsvField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
