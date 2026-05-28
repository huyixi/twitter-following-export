import "./style.css";
import { COLLECTION_LIMIT, NO_DATA_EXPORT_LABEL } from "../shared/constants";
import type { BackgroundMessage, ContentMessage, ContentResponse } from "../shared/messages";
import { parseFollowingUrl } from "../shared/twitterUrl";
import type { CollectionSnapshot, PageInfo } from "../shared/types";
import { derivePopupViewState } from "./viewState";

const pageLabel = document.querySelector<HTMLSpanElement>("#page-label")!;
const statusLabel = document.querySelector<HTMLSpanElement>("#status-label")!;
const countLabel = document.querySelector<HTMLSpanElement>("#count-label")!;
const messageLabel = document.querySelector<HTMLParagraphElement>("#message")!;
const startButton = document.querySelector<HTMLButtonElement>("#start-button")!;
const stopButton = document.querySelector<HTMLButtonElement>("#stop-button")!;
const exportButton = document.querySelector<HTMLButtonElement>("#export-button")!;

let activeTabId: number | null = null;
let pageInfo: PageInfo = { isFollowingPage: false, sourceUsername: null };
let snapshot: CollectionSnapshot = {
  sourceUsername: null,
  status: "idle",
  users: [],
  count: 0,
  limit: COLLECTION_LIMIT
};
let refreshTimer: number | null = null;

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  activeTabId = tab?.id ?? null;
  pageInfo = parseFollowingUrl(tab?.url ?? "");
  render();

  startButton.addEventListener("click", () => sendContentMessage({ type: "START_COLLECTION" }));
  stopButton.addEventListener("click", () => sendContentMessage({ type: "STOP_COLLECTION" }));
  exportButton.addEventListener("click", exportCsv);

  if (activeTabId !== null && pageInfo.isFollowingPage) {
    await sendContentMessage({ type: "GET_STATE" });
  }
}

async function sendContentMessage(message: ContentMessage) {
  if (activeTabId === null || !pageInfo.isFollowingPage) {
    messageLabel.textContent = "请先打开 x.com 或 twitter.com 的 following 页面";
    return;
  }

  let response: ContentResponse;
  try {
    response = await chrome.tabs.sendMessage(activeTabId, message) as ContentResponse;
  } catch {
    messageLabel.textContent = "页面未就绪，请刷新 x.com 的 following 页面后重试";
    return;
  }

  if (!response.ok) {
    messageLabel.textContent = response.error;
    return;
  }

  snapshot = response.snapshot;
  pageInfo = response.pageInfo;
  render();
  updateRefreshTimer();
}

async function exportCsv() {
  if (snapshot.users.length === 0) {
    messageLabel.textContent = NO_DATA_EXPORT_LABEL;
    return;
  }

  const sourceUsername = snapshot.sourceUsername ?? pageInfo.sourceUsername;
  if (!sourceUsername) {
    messageLabel.textContent = "无法识别当前 following 页面";
    return;
  }

  const message: BackgroundMessage = {
    type: "DOWNLOAD_CSV",
    payload: { sourceUsername, users: snapshot.users }
  };
  await chrome.runtime.sendMessage(message);
}

function render() {
  const sourceUsername = snapshot.sourceUsername ?? pageInfo.sourceUsername;
  pageLabel.textContent = pageInfo.isFollowingPage && sourceUsername
    ? `@${sourceUsername} / following`
    : "不支持的页面";

  const viewState = derivePopupViewState(snapshot.status, snapshot.count);
  statusLabel.textContent = viewState.statusLabel;
  countLabel.textContent = `${snapshot.count} / ${snapshot.limit}`;
  startButton.disabled = viewState.startDisabled || !pageInfo.isFollowingPage;
  stopButton.disabled = viewState.stopDisabled || !pageInfo.isFollowingPage;
  exportButton.disabled = viewState.exportDisabled || !pageInfo.isFollowingPage;
}

function updateRefreshTimer() {
  if (refreshTimer !== null) {
    window.clearInterval(refreshTimer);
    refreshTimer = null;
  }

  if (snapshot.status === "collecting") {
    refreshTimer = window.setInterval(() => {
      void sendContentMessage({ type: "GET_STATE" });
    }, 1000);
  }
}

void init();
