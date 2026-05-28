import { describe, expect, it } from "vitest";
import { derivePopupViewState } from "../../src/popup/viewState";

describe("derivePopupViewState", () => {
  it("enables start only before collection starts", () => {
    expect(derivePopupViewState("idle", 0)).toMatchObject({
      statusLabel: "未开始",
      startDisabled: false,
      stopDisabled: true,
      exportDisabled: true
    });
  });

  it("allows stopping while collecting and exporting when data exists", () => {
    expect(derivePopupViewState("collecting", 3)).toMatchObject({
      statusLabel: "采集中",
      startDisabled: true,
      stopDisabled: false,
      exportDisabled: false
    });
  });

  it("keeps export enabled after stop or limit when data exists", () => {
    expect(derivePopupViewState("stopped", 1)).toMatchObject({
      statusLabel: "已停止",
      startDisabled: true,
      stopDisabled: true,
      exportDisabled: false
    });
    expect(derivePopupViewState("limit_reached", 1000)).toMatchObject({
      statusLabel: "已达到上限",
      startDisabled: true,
      stopDisabled: true,
      exportDisabled: false
    });
  });
});
