import React, { useState, useEffect, BaseSyntheticEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { setTurn } from "../../../redux/contentSlice";
import CustomSelect from "./MainDeckViewHeader/CustomSelect/CustomSelect";

const MainDeckViewer = () => {
  const dispatch = useDispatch();
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
  const [pinnedToggleButton, setPinnedToggleButton] = useState<
    "Current" | "Next"
  >("Current");
  const handleMouseEnterButton = (e: BaseSyntheticEvent) => {
    const buttonName = e.target.name;
    dispatch(setTurn(buttonName));
  };
  const handleMouseLeaveButton = () => {
    dispatch(setTurn(pinnedToggleButton));
  };
  const handleToggleButtonClick = (e: BaseSyntheticEvent) => {
    const buttonName = e.target.name;
    setPinnedToggleButton(buttonName);
    dispatch(setTurn(buttonName));
  };

  useEffect(() => {
    console.log("MainDeckViewerUseEffect");
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
      turn
    );
    setLibraryMap(sortedCombinedMap);
  }, [pd, sortButtonState, turn, topCardsLookAmount]);

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
                  getProb(pd, card, turn, 1, topCardsLookAmount).cumulative
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
          <button
            className={`w-full border-x border-y whitespace-nowrap col-span-3 text-xs ${
              turn === "Current" ? "text-lime-500" : "text-white"
            }`}
            name={"Current"}
            onMouseEnter={handleMouseEnterButton}
            onMouseLeave={handleMouseLeaveButton}
            onClick={handleToggleButtonClick}
          >
            <span className="pointer-events-none">This</span>
            <br className="pointer-events-none"></br>
            <span className="pointer-events-none">Turn</span>
          </button>
          <button
            disabled={
              pd.library.length >= 5 || topCardsLookAmount <= pd.library.length
            }
            className={`w-full border-x border-y whitespace-nowrap col-span-2 text-xs ${
              turn === "Next" ? "text-lime-500" : "text-white"
            }`}
            name={"Next"}
            onMouseEnter={handleMouseEnterButton}
            onMouseLeave={handleMouseLeaveButton}
            onClick={handleToggleButtonClick}
          >
            <span className="pointer-events-none">Next</span>
            <br className="pointer-events-none"></br>
            <span className="pointer-events-none">Turn</span>
          </button>
          <CustomSelect colSpan={12} />
        </div>
      </div>
    </div>
  );
};

export default MainDeckViewer;
