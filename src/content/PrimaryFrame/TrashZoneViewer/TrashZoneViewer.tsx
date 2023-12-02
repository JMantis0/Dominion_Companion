import React from "react";
import { useSelector } from "react-redux";
import ZoneViewer from "../ZoneViewer/ZoneViewer";
import {
  stringifiedEqualityFunction,
  trashZoneViewerStateSelectorFunction,
} from "../../../utils/utils";
import { TrashZoneViewerState } from "../../../utils";

const TrashZoneViewer = () => {
  const trashZoneViewerState: TrashZoneViewerState = useSelector(
    trashZoneViewerStateSelectorFunction,
    stringifiedEqualityFunction
  );
  return (
    <div className="text-xs outer-shell">
      <div className={"text-white pointer-events-none"}>
        {trashZoneViewerState.playerName}&apos;s trash:
      </div>
      <ZoneViewer title={"Trash"} zone={trashZoneViewerState.playerTrash} />
      {trashZoneViewerState.opponentTrashData.map((opponentTrashData, idx) => {
        return (
          <React.Fragment key={idx}>
            <div className={"text-white pointer-events-none"}>
              {opponentTrashData.playerName}&apos;s trash:
            </div>
            <ZoneViewer title={"Trash"} zone={opponentTrashData.trashZone} />
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default TrashZoneViewer;
