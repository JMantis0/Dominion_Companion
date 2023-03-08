import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  CardCounts,
  combineDeckListMapAndZoneListMap,
  getCountsFromArray,
  getRowColor,
  sortTheView,
} from "./componentFunctions";
import ZoneCardRow from "./ZoneCardRow";

const DiscardZoneViewer = () => {
  const [combinedMap, setCombinedMap] = useState<Map<string, CardCounts>>(
    new Map()
  );
  const pd = useSelector((state: RootState) => state.content.playerDeck);

  useEffect(() => {
    const unsortedCombinedMap = combineDeckListMapAndZoneListMap(
      getCountsFromArray(pd.entireDeck),
      getCountsFromArray(pd.graveyard)
    );
    const sortedCombinedMap = sortTheView(
      "card",
      unsortedCombinedMap,
      "descending",
      pd
    );
    setCombinedMap(sortedCombinedMap);
  }, [pd]);

  return (
    <div className="outer-shell">
      {/* <ViewHeader /> */}

      {pd.graveyard.length !== undefined && pd.graveyard.length !== 0 ? (
        Array.from(combinedMap.keys()).map((card, idx) => {
          return (
            combinedMap.get(card)?.zoneCount! > 0 && (
              <ZoneCardRow
                key={idx}
                cardName={card}
                cardAmountInZone={combinedMap.get(card)?.zoneCount!}
                color={getRowColor(card)}
              />
            )
          );
        })
      ) : (
        <div className = "text-white">Discard Pile is empty.</div>
      )}
    </div>
  );
};

export default DiscardZoneViewer;
