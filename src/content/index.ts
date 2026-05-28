import { createCollector } from "./collector";
import { parseFollowingUrl } from "../shared/twitterUrl";
import type { ContentMessage, ContentResponse } from "../shared/messages";

const pageInfo = parseFollowingUrl(window.location.href);
const collector = createCollector({
  sourceUsername: pageInfo.sourceUsername
});

chrome.runtime.onMessage.addListener(
  (message: ContentMessage, _sender, sendResponse: (response: ContentResponse) => void) => {
    if (message.type === "GET_STATE") {
      sendResponse({ ok: true, snapshot: collector.getSnapshot(), pageInfo });
      return true;
    }

    if (message.type === "START_COLLECTION") {
      sendResponse({ ok: true, snapshot: collector.start(), pageInfo });
      return true;
    }

    if (message.type === "STOP_COLLECTION") {
      sendResponse({ ok: true, snapshot: collector.stop(), pageInfo });
      return true;
    }

    sendResponse({ ok: false, error: "Unsupported content message" });
    return true;
  }
);
