import React from "react";
import { useSelector } from "react-redux";
import { setOpponentSortState } from "../../../redux/contentSlice";
import { RootState } from "../../../redux/store";
import ZoneViewer from "../ZoneViewer/ZoneViewer";

const OpponentViewer = () => {
  const ods = useSelector((state: RootState) => state.content.opponentDecks);
  const opponentSortState = useSelector(
    (state: RootState) => state.content.opponentSortState
  );
  return (
    <React.Fragment>
      {ods.map((od, idx) => {
        return (
          <React.Fragment key={idx}>
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
      })}
    </React.Fragment>
  );
};
export default OpponentViewer;
