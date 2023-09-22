import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import {
  CardCounts,
  combineDeckListMapAndZoneListMap,
  getCountsFromArray,
  calculateDrawProbability,
  sortTheView,
  getRowColor,
  getProb,
  stringifyProbability,
} from "../componentFunctions";
import FullListCardRow from "./components/FullListCardRow/FullListCardRow";
import SortViewHeader from "./components/MainDeckViewHeader/MainDeckViewHeader";
import ViewFooter from "./components/ViewFooter/ViewFooter";

const MainDeckViewer = () => {
  const [libraryMap, setLibraryMap] = useState<Map<string, CardCounts>>(
    new Map()
  );
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const sortButtonState = useSelector(
    (state: RootState) => state.content.sortButtonState
  );

  useEffect(() => {
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
    setLibraryMap(sortedCombinedMap);
  }, [pd, sortButtonState]);

  return (
    <div className="outer-shell">
      <div className={`text-xs text-white`}>
        {pd.playerName}'s Deck: {pd.entireDeck.length} cards.
      </div>
      <SortViewHeader />
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
            hyper5={stringifyProbability(getProb(card,pd.library,pd.graveyard,1,5).cumulative)}
            color={getRowColor(card)}
            cardName={card}
            cardAmount={libraryMap.get(card)?.entireDeckCount!}
            libraryAmount={libraryMap.get(card)?.zoneCount!}
          />
        );
      })}
      <ViewFooter />
    </div>
  );
};

export default MainDeckViewer;
