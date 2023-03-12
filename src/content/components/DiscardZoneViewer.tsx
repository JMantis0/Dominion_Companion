import React from "react";
import { useSelector } from "react-redux";
import { setDiscardSortState } from "../../redux/contentSlice";
import { RootState } from "../../redux/store";
import ZoneViewer from "./ZoneViewer";

const DiscardZoneViewer = () => {
  const discardZone = useSelector(
    (state: RootState) => state.content.playerDeck.graveyard
  );
  const dzSortState = useSelector(
    (state: RootState) => state.content.discardSortState
  );
  return (
    <ZoneViewer
      zone={discardZone}
      title="Discard Pile"
      sortButtonState={dzSortState}
      sortDispatchFunc={setDiscardSortState}
    />
  );
};
export default DiscardZoneViewer;
