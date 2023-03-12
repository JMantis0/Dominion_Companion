import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { setOpponentSortState } from "../../redux/contentSlice";
import { RootState } from "../../redux/store";
import {
  getCountsFromArray,
  getRowColor,
  sortZoneView,
} from "./componentFunctions";
import ZoneCardRow from "./ZoneCardRow";
import ZoneViewHeader from "./ZoneViewHeader";

const OpponentViewer = () => {
  const [map, setMap] = useState<Map<string, number>>(new Map());
  const od = useSelector((state: RootState) => state.content.opponentDeck);
  const opponentSortState = useSelector(
    (state: RootState) => state.content.opponentSortState
  );
  useEffect(() => {
    const unsortedMap = getCountsFromArray(od.entireDeck);
    const sortedMap = sortZoneView(
      opponentSortState.category,
      unsortedMap,
      opponentSortState.sort
    );
    setMap(sortedMap);
  }, [od, opponentSortState]);
  return (
    <div className="outer-shell">
      <div className={`text-xs text-white`}>
        {od.playerName}'s Deck: {od.entireDeck.length} cards
      </div>
      <ZoneViewHeader
        dispatchFunc={setOpponentSortState}
        reduxState={opponentSortState}
      />
      {od.entireDeck.length !== undefined && od.entireDeck.length !== 0 ? (
        Array.from(map.entries()).map((entry, idx) => {
          const card = entry[0];
          const cardAmount = entry[1];
          return (
            cardAmount > 0 && (
              <ZoneCardRow
                key={idx}
                cardName={card}
                cardAmountInZone={cardAmount}
                color={getRowColor(card)}
              />
            )
          );
        })
      ) : (
        <div className="text-white">Opponent Deck is empty.</div>
      )}
    </div>
  );
};
export default OpponentViewer;
