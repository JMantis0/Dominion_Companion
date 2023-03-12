import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { setDiscardSortState } from "../../redux/contentSlice";
import { RootState } from "../../redux/store";
import {
  getCountsFromArray,
  getRowColor,
  sortZoneView,
} from "./componentFunctions";
import ZoneCardRow from "./ZoneCardRow";
import ZoneViewHeader from "./ZoneViewHeader";

const DiscardZoneViewer = () => {
  const [map, setMap] = useState<Map<string, number>>(new Map());
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const dzSortState = useSelector(
    (state: RootState) => state.content.discardSortState
  );
  useEffect(() => {
    const unsortedMap = getCountsFromArray(pd.graveyard);
    const sortedMap = sortZoneView(
      dzSortState.category,
      unsortedMap,
      dzSortState.sort
    );
    setMap(sortedMap);
  }, [pd, dzSortState]);
  return (
    <div className="outer-shell">
      <ZoneViewHeader
        dispatchFunc={setDiscardSortState}
        reduxState={dzSortState}
      />

      {pd.graveyard.length !== undefined && pd.graveyard.length !== 0 ? (
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
        <div className="text-white">Discard Pile is empty.</div>
      )}
    </div>
  );
};
export default DiscardZoneViewer;
