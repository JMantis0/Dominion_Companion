import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  CardCounts,
  combineDeckListMapAndZoneListMap,
  getCountsFromArray,
  calculateDrawProbability,
  sortTheView,
} from "../../utils/utilityFunctions";
import FullListCardRow from "./FullListCardRow";
import ViewHeader from "./SortViewHeader";

const SortableView = () => {
  const firstRender = useRef(true);
  const [combinedMap, setCombinedMap] = useState<Map<string, CardCounts>>(
    new Map()
  );
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const sortButtonState = useSelector(
    (state: RootState) => state.content.sortButtonState
  );

  useEffect(() => {
    console.log("useEffect Sortable Viewer");
    console.log(pd);
    const unsortedCombinedMap = combineDeckListMapAndZoneListMap(
      getCountsFromArray(pd.entireDeck),
      getCountsFromArray(pd.library)
    );
    const sortedCombinedMap = sortTheView(
      sortButtonState.category,
      unsortedCombinedMap,
      sortButtonState.sort
    );
    console.log("sortedCombinedMap", sortedCombinedMap);
    setCombinedMap(sortedCombinedMap);
  }, [pd]);

  useEffect(() => {
    if (firstRender.current) {
      // prevents this useEffect from doing anything on first render.
      firstRender.current = false;
      return;
    }
    setCombinedMap(
      sortTheView(sortButtonState.category, combinedMap, sortButtonState.sort)
    );
  }, [sortButtonState]);

  return (
    <div className="outer-shell">
      <ViewHeader />
      {Array.from(combinedMap.keys()).map((card, idx) => {
        return (
          <FullListCardRow
            key={idx}
            drawProbability={calculateDrawProbability(
              combinedMap.get(card)?.zoneCount!,
              pd.library.length,
              getCountsFromArray(pd.graveyard).get(card)!,
              pd.graveyard.length
            )}
            cardName={card}
            cardAmount={combinedMap.get(card)?.entireDeckCount!}
            libraryAmount={combinedMap.get(card)?.zoneCount!}
          />
        );
      })}
    </div>
  );
};

export default SortableView;
