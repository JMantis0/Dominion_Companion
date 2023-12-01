import React from "react";
import { useSelector } from "react-redux";
import { setDiscardSortState } from "../../../redux/contentSlice";
import ZoneViewer from "../ZoneViewer/ZoneViewer";
import {
  discardZoneViewerStateSelectorFunction,
  stringifiedEqualityFunction,
} from "../../../utils/utils";

const DiscardZoneViewer = () => {
  const discardZoneViewerState = useSelector(
    discardZoneViewerStateSelectorFunction,
    stringifiedEqualityFunction
  );
  return (
    <React.Fragment>
      <div className={"text-xs text-white pointer-events-none"}>
        {discardZoneViewerState.deckData.playerName}&apos;s discard pile:{" "}
        {discardZoneViewerState.deckData.graveyard.length} cards.
      </div>
      <ZoneViewer
        zone={discardZoneViewerState.deckData.graveyard}
        title="Discard Pile"
        sortButtonState={discardZoneViewerState.discardSortState}
        sortDispatchFunc={setDiscardSortState}
      />
    </React.Fragment>
  );
};
export default DiscardZoneViewer;
