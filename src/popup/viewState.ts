import { STATUS_LABELS } from "../shared/constants";
import type { CollectionStatus } from "../shared/types";

export interface PopupViewState {
  statusLabel: string;
  startDisabled: boolean;
  stopDisabled: boolean;
  exportDisabled: boolean;
}

export function derivePopupViewState(status: CollectionStatus, count: number): PopupViewState {
  return {
    statusLabel: STATUS_LABELS[status],
    startDisabled: status !== "idle",
    stopDisabled: status !== "collecting",
    exportDisabled: count === 0
  };
}
