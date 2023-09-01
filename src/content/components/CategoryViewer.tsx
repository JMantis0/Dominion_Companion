import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  getCountsFromArray,
  combineDeckListMapAndZoneListMap,
  splitCombinedMapsByCardTypes,
  createEmptySplitMapsObject,
  SplitMaps,
  sortTheView,
  getRowColor,
} from "./PrimaryFrame/components/componentFunctions";
import ZoneCardRow from "./PrimaryFrame/components/components/ZoneViewer/components/ZoneCardRow";

const CategoryViewer = () => {
  const firstRender = useRef(true);
  const [splitMaps, setSplitMaps] = useState<SplitMaps>(
    createEmptySplitMapsObject()
  );
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const sortButtonState = useSelector(
    (state: RootState) => state.content.sortButtonState
  );

  useEffect(() => {
    const unsortedSplitMap = splitCombinedMapsByCardTypes(
      combineDeckListMapAndZoneListMap(
        getCountsFromArray(pd.entireDeck),
        getCountsFromArray(pd.library)
      )
    );
    const sortedActions = sortTheView(
      "owned",
      unsortedSplitMap.actions!,
      sortButtonState.sort,
      pd
    );
    const sortedTreasures = sortTheView(
      "owned",
      unsortedSplitMap.treasures!,
      sortButtonState.sort,
      pd
    );
    const sortedVictories = sortTheView(
      "owned",
      unsortedSplitMap.victories!,
      sortButtonState.sort,
      pd
    );
    const sortedCurses = sortTheView(
      "owned",
      unsortedSplitMap.curses!,
      sortButtonState.sort,
      pd
    );
    setSplitMaps({
      treasures: sortedTreasures,
      victories: sortedVictories,
      actions: sortedActions,
      curses: sortedCurses,
    });
  }, [pd]);

  useEffect(() => {
    console.log("Category Viewer SortButtonState useEffect");
    if (firstRender.current) {
      // prevents this useEffect on first render
      firstRender.current = false;
      return;
    }
    const sortedActions = sortTheView(
      sortButtonState.category,
      splitMaps.actions!,
      sortButtonState.sort,
      pd
    );
    const sortedTreasures = sortTheView(
      sortButtonState.category,
      splitMaps.treasures!,
      sortButtonState.sort,
      pd
    );
    const sortedVictories = sortTheView(
      sortButtonState.category,
      splitMaps.victories!,
      sortButtonState.sort,
      pd
    );
    const sortedCurses = sortTheView(
      sortButtonState.category,
      splitMaps.curses!,
      sortButtonState.sort,
      pd
    );
    setSplitMaps({
      treasures: sortedTreasures,
      victories: sortedVictories,
      actions: sortedActions,
      curses: sortedCurses,
    });
  }, [sortButtonState]);

  return (
    <div className="outer-shell">
      {/* <ViewHeader /> */}
      {/* Treasure Section */}
      {/* <div className="col-span-12 text-white">Treasures</div> */}
      {Array.from(splitMaps.treasures!.keys()).map((card, idx) => {
        return (
          <ZoneCardRow
            key={idx}
            cardName={card}
            cardAmountInZone={splitMaps.treasures!.get(card)?.entireDeckCount!}
            color={getRowColor(card)}
          />
        );
      })}
      {/* Victory section */}
      {/* <div className="col-span-12 text-white">Victories</div> */}
      {Array.from(splitMaps?.victories!.keys()).map((card, idx) => {
        return (
          <ZoneCardRow
            key={idx}
            cardName={card}
            cardAmountInZone={splitMaps.victories!.get(card)?.entireDeckCount!}
            color={getRowColor(card)}
          />
        );
      })}{" "}
      {/* Action section */}
      {/* <div className="col-span-12 text-white">Actions</div> */}
      {Array.from(splitMaps?.actions!.keys()).map((card, idx) => {
        return (
          <ZoneCardRow
            key={idx}
            cardName={card}
            cardAmountInZone={splitMaps.actions!.get(card)?.entireDeckCount!}
            color={getRowColor(card)}
          />
        );
      })}
    </div>
  );
};

export default CategoryViewer;
