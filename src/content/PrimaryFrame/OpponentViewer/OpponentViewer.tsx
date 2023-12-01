import React from "react";
import { useSelector } from "react-redux";
import { setOpponentSortState } from "../../../redux/contentSlice";
import ZoneViewer from "../ZoneViewer/ZoneViewer";
import {
  opponentViewerStateSelectorFunction,
  stringifiedEqualityFunction,
} from "../../../utils/utils";

const OpponentViewer = () => {
  const opponentViewerState = useSelector(
    opponentViewerStateSelectorFunction,
    stringifiedEqualityFunction
  );
  return (
    <React.Fragment>
      {opponentViewerState.opponentDeckData.map((opponentDeck, idx) => {
        return (
          <React.Fragment key={idx}>
            <div className={"text-xs text-white pointer-events-none"}>
              {opponentDeck.playerName}&apos;s Deck:{" "}
              {opponentDeck.entireDeck.length} cards.
            </div>
            <ZoneViewer
              sortButtonState={opponentViewerState.opponentSortState}
              sortDispatchFunc={setOpponentSortState}
              title={`${opponentDeck.playerName}'s Deck`}
              zone={opponentDeck.entireDeck}
            />
          </React.Fragment>
        );
      })}
    </React.Fragment>
  );
};
export default OpponentViewer;
