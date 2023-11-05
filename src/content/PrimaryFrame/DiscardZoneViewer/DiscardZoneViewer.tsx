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
    <React.Fragment>
      <div className={`text-xs text-white`}>
        {pd.playerName}'s discard pile: {pd.entireDeck.length} cards.
      </div>
      <ZoneViewer
        deck={pd}
        zone={discardZone}
        title="Discard Pile"
        sortButtonState={dzSortState}
        sortDispatchFunc={setDiscardSortState}
      />
    </React.Fragment>
  );
};
export default DiscardZoneViewer;
