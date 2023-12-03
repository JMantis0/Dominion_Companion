import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  getRowColor,
  getCumulativeHyperGeometricProbabilityForCard,
  stringifyProbability,
  stringifiedEqualityFunction,
  useMainDeckViewerSorter,
  mainDeckViewerStateSelectorFunction,
} from "../../../utils/utils";
import FullListCardRow from "./FullListCardRow/FullListCardRow";
import MainDeckViewHeader from "./MainDeckViewHeader/MainDeckViewHeader";
import ViewFooter from "./ViewFooter/ViewFooter";
import CustomSelect from "./TopCardsSelect/TopCardsSelect";
import TurnButton from "./TurnButton/TurnButton";
import {
  SortButtonState,
  CardCounts,
  MainDeckViewerState,
} from "../../../utils";

const MainDeckViewer = () => {
  const mainDeckViewerState: MainDeckViewerState = useSelector(
    mainDeckViewerStateSelectorFunction,
    stringifiedEqualityFunction
  );
  const [libraryMap, setLibraryMap] = useState<Map<string, CardCounts>>(
    new Map()
  );
  const [mainDeckViewerSortButtonSate, setMainDeckViewerSortButtonState] =
    useState<SortButtonState>({
      category: "probability",
      sort: "ascending",
    });
  useMainDeckViewerSorter(
    mainDeckViewerState,
    mainDeckViewerSortButtonSate,
    setLibraryMap
  );
  return (
    <div className="outer-shell">
      <div className={"text-xs text-white pointer-events-none"}>
        {mainDeckViewerState.playerName}&apos;s Deck:{" "}
        {mainDeckViewerState.deck.entireDeck.length} cards.
      </div>
      <div className="grid grid-cols-12">
        <div className={"col-span-10"}>
          <MainDeckViewHeader
            setSortButtonState={setMainDeckViewerSortButtonState}
            sortButtonState={mainDeckViewerSortButtonSate}
          />
          {Array.from(libraryMap.keys()).map((card, idx) => {
            return (
              <FullListCardRow
                key={idx}
                drawProbability={stringifyProbability(
                  getCumulativeHyperGeometricProbabilityForCard(
                    mainDeckViewerState.deck,
                    card,
                    mainDeckViewerState.turnToggleButton,
                    1,
                    mainDeckViewerState.topCardsLookAmount
                  ).cumulative
                )}
                color={getRowColor(card)}
                cardName={card}
                cardAmount={libraryMap.get(card)!.entireDeckCount}
                libraryAmount={libraryMap.get(card)!.zoneCount}
              />
            );
          })}
          <ViewFooter />
        </div>
        <div className={"col-span-2"}>
          <CustomSelect colSpan={12} />
          <TurnButton buttonName="Current" />
          <TurnButton buttonName="Next" />
        </div>
      </div>
    </div>
  );
};
export default MainDeckViewer;
