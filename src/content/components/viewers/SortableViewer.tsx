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
  const [libraryMap, setLibraryMap] = useState<Map<string, CardCounts>>(
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
      sortButtonState.sort,
      pd
    );
    console.log("sortedCombinedMap", sortedCombinedMap);
    setLibraryMap(sortedCombinedMap);
  }, [pd]);

  useEffect(() => {
    if (firstRender.current) {
      // prevents this useEffect from doing anything on first render.
      firstRender.current = false;
      return;
    }
    setLibraryMap(
      sortTheView(
        sortButtonState.category,
        libraryMap,
        sortButtonState.sort,
        pd
      )
    );
  }, [sortButtonState]);

  return (
    <div className="outer-shell">
      <ViewHeader />
      {Array.from(libraryMap.keys()).map((card, idx) => {
        return (
          <FullListCardRow
            key={idx}
            drawProbability={calculateDrawProbability(
              libraryMap.get(card)?.zoneCount!,
              pd.library.length,
              getCountsFromArray(pd.graveyard).get(card)!,
              pd.graveyard.length
            )}
            cardName={card}
            cardAmount={libraryMap.get(card)?.entireDeckCount!}
            libraryAmount={libraryMap.get(card)?.zoneCount!}
          />
        );
      })}
    </div>
  );
};

export default SortableView;
