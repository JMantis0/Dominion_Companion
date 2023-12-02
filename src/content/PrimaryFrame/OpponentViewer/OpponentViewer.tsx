import React from "react";
import { useSelector } from "react-redux";
import ZoneViewer from "../ZoneViewer/ZoneViewer";
import {
  opponentViewerStateSelectorFunction,
  stringifiedEqualityFunction,
} from "../../../utils/utils";
import { OpponentViewerState } from "../../../utils";

const OpponentViewer = () => {
  const opponentViewerState: OpponentViewerState = useSelector(
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
