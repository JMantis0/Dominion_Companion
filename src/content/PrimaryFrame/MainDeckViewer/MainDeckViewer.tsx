import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
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
import FullListCardRow from "./FullListCardRow/FullListCardRow";
import MainDeckViewHeader from "./MainDeckViewHeader/MainDeckViewHeader";
import ViewFooter from "./ViewFooter/ViewFooter";

const MainDeckViewer = () => {
  const [libraryMap, setLibraryMap] = useState<Map<string, CardCounts>>(
    new Map()
  );
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const sortButtonState = useSelector(
    (state: RootState) => state.content.sortButtonState
  );
  const turn = useSelector((state: RootState) => state.content.turn);
  const topCardsLookAmount = useSelector(
    (state: RootState) => state.content.topCardsLookAmount
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
      pd,
      turn
    );
    setLibraryMap(sortedCombinedMap);
  }, [pd, sortButtonState]);

  return (
    <div className="outer-shell">
      <div className={`text-xs text-white`}>
        {pd.playerName}'s Deck: {pd.entireDeck.length} cards.
      </div>
      <MainDeckViewHeader />
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
            hyper5={stringifyProbability(
              getProb(pd, card, turn, 1, topCardsLookAmount).cumulative
            )}
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
