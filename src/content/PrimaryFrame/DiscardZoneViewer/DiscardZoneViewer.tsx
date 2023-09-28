import React from "react";
import { useSelector } from "react-redux";
import { setDiscardSortState } from "../../../redux/contentSlice";
import { RootState } from "../../../redux/store";
import ZoneViewer from "../ZoneViewer/ZoneViewer";

const DiscardZoneViewer = () => {
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const discardZone = useSelector(
    (state: RootState) => state.content.playerDeck.graveyard
  );
  const dzSortState = useSelector(
    (state: RootState) => state.content.discardSortState
  );
  return (
    <ZoneViewer
      deck={pd}
      zone={discardZone}
      title="Discard Pile"
      sortButtonState={dzSortState}
      sortDispatchFunc={setDiscardSortState}
    />
  );
};
export default DiscardZoneViewer;
