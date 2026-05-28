import { buildCsvFilename, serializeUsersToCsv } from "../shared/csv";
import type { BackgroundMessage, BackgroundResponse } from "../shared/messages";
import type { FollowingUser } from "../shared/types";

interface DownloadOptionsInput {
  sourceUsername: string;
  users: FollowingUser[];
  now?: Date;
}

function toBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  const chunks: string[] = [];
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    chunks.push(String.fromCharCode(...bytes.subarray(i, i + chunkSize)));
  }
  return btoa(chunks.join(""));
}

export function createDownloadOptions(input: DownloadOptionsInput): chrome.downloads.DownloadOptions {
  const csv = serializeUsersToCsv(input.users);
  return {
    url: `data:text/csv;charset=utf-8;base64,${toBase64(csv)}`,
    filename: buildCsvFilename(input.sourceUsername, input.now ?? new Date()),
    saveAs: true,
    conflictAction: "uniquify"
  };
}

if (typeof chrome !== "undefined" && chrome.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener(
    (message: BackgroundMessage, _sender, sendResponse: (response: BackgroundResponse) => void) => {
      if (message.type !== "DOWNLOAD_CSV") {
        sendResponse({ ok: false, error: "Unsupported background message" });
        return true;
      }

      chrome.downloads.download(createDownloadOptions(message.payload), (downloadId) => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          sendResponse({ ok: false, error: lastError.message ?? "Download failed" });
          return;
        }
        sendResponse({ ok: true, downloadId });
      });

      return true;
    }
  );
}
