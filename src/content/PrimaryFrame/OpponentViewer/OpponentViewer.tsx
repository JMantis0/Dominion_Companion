import React from "react";
import { useSelector } from "react-redux";
import { setOpponentSortState } from "../../../redux/contentSlice";
import { RootState } from "../../../redux/store";
import ZoneViewer from "../ZoneViewer/ZoneViewer";

const OpponentViewer = () => {
  const od = useSelector((state: RootState) => state.content.opponentDeck);
  const opponentSortState = useSelector(
    (state: RootState) => state.content.opponentSortState
  );
  return (
    <React.Fragment>
      <div className={"text-xs text-white pointer-events-none"}>
        {od.playerName}&apos;s Deck: {od.entireDeck.length} cards.
      </div>
      <ZoneViewer
        deck={od}
        sortButtonState={opponentSortState}
        sortDispatchFunc={setOpponentSortState}
        title={`${od.playerName}'s Deck`}
        zone={od.entireDeck}
      />
    </React.Fragment>
  );
};
export default OpponentViewer;
