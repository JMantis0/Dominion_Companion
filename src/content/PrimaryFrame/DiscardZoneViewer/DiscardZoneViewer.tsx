import React from "react";
import { useSelector } from "react-redux";
import ZoneViewer from "../ZoneViewer/ZoneViewer";
import {
  discardZoneViewerStateSelectorFunction,
  stringifiedEqualityFunction,
} from "../../../utils/utils";
import { DiscardZoneViewerState } from "../../../utils";

const DiscardZoneViewer = () => {
  const discardZoneViewerState: DiscardZoneViewerState = useSelector(
    discardZoneViewerStateSelectorFunction,
    stringifiedEqualityFunction
  );
  return (
    <React.Fragment>
      <div className={"text-xs text-white pointer-events-none"}>
        {discardZoneViewerState.playerName}&apos;s discard pile:{" "}
        {discardZoneViewerState.graveyard.length} cards.
      </div>
      <ZoneViewer
        zone={discardZoneViewerState.graveyard}
        title="Discard Pile"
      />
    </React.Fragment>
  );
};
export default DiscardZoneViewer;
