import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  CardCounts,
  combineDeckListMapAndZoneListMap,
  getCountsFromArray,
  sortMainViewer,
  getRowColor,
  getProb,
  stringifyProbability,
} from "../componentFunctions";
import FullListCardRow from "./FullListCardRow/FullListCardRow";
import MainDeckViewHeader from "./MainDeckViewHeader/MainDeckViewHeader";
import ViewFooter from "./ViewFooter/ViewFooter";
import CustomSelect from "./MainDeckViewHeader/CustomSelect/CustomSelect";
import TurnButton from "./ViewFooter/TurnButton/TurnButton";

const MainDeckViewer = () => {
  const [libraryMap, setLibraryMap] = useState<Map<string, CardCounts>>(
    new Map()
  );
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const sortButtonState = useSelector(
    (state: RootState) => state.content.sortButtonState
  );
  const turnToggleButton = useSelector(
    (state: RootState) => state.content.turnToggleButton
  );
  const topCardsLookAmount = useSelector(
    (state: RootState) => state.content.topCardsLookAmount
  );

  useEffect(() => {
    const unsortedCombinedMap = combineDeckListMapAndZoneListMap(
      getCountsFromArray(pd.entireDeck),
      getCountsFromArray(pd.library)
    );
    const sortedCombinedMap = sortMainViewer(
      sortButtonState.category,
      unsortedCombinedMap,
      sortButtonState.sort,
      pd,
      topCardsLookAmount,
      turnToggleButton
    );
    setLibraryMap(sortedCombinedMap);
  }, [pd, sortButtonState, turnToggleButton, topCardsLookAmount]);

  return (
    <div className="outer-shell">
      <div className={`text-xs text-white`}>
        {pd.playerName}'s Deck: {pd.entireDeck.length} cards.
      </div>
      <MainDeckViewHeader />
      <div className="grid grid-cols-12">
        <div className={"col-span-10"}>
          {Array.from(libraryMap.keys()).map((card, idx) => {
            return (
              <FullListCardRow
                key={idx}
                drawProbability={stringifyProbability(
                  getProb(pd, card, turnToggleButton, 1, topCardsLookAmount)
                    .cumulative
                )}
                color={getRowColor(card)}
                cardName={card}
                cardAmount={libraryMap.get(card)?.entireDeckCount!}
                libraryAmount={libraryMap.get(card)?.zoneCount!}
              />
            );
          })}
          <ViewFooter />;
        </div>
        <div className={"col-span-2"}>
          <TurnButton buttonName="Current" />
          <TurnButton buttonName="Next" />
          <CustomSelect colSpan={12} />
        </div>
      </div>
    </div>
  );
};

export default MainDeckViewer;
