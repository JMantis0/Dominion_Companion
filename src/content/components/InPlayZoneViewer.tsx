import React, { useState, useEffect, useRef } from "react";
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

const InPlayZoneViewer = () => {
  const firstRender = useRef(true);
  const [combinedMap, setCombinedMap] = useState<Map<string, CardCounts>>(
    new Map()
  );
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const sortButtonState = useSelector(
    (state: RootState) => state.content.sortButtonState
  );

  useEffect(() => {
    const unsortedCombinedMap = combineDeckListMapAndZoneListMap(
      getCountsFromArray(pd.entireDeck),
      getCountsFromArray(pd.inPlay)
    );
    const sortedCombinedMap = sortTheView(
      sortButtonState.category,
      unsortedCombinedMap,
      sortButtonState.sort,
      pd
    );
    setCombinedMap(sortedCombinedMap);
  }, [pd]);

  useEffect(() => {
    if (firstRender.current) {
      // prevents this useEffect from doing anything on first render.
      firstRender.current = false;
      return;
    }
    setCombinedMap(
      sortTheView(
        sortButtonState.category,
        combinedMap,
        sortButtonState.sort,
        pd
      )
    );
  }, [sortButtonState]);

  return (
    <div>
      {Array.from(combinedMap.keys()).map((card, idx) => {
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
      })}
    </div>
  );
};

export default InPlayZoneViewer;