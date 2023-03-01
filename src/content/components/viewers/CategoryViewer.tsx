import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  calculateDrawProbability,
  getCountsFromArray,
  combineDeckListMapAndZoneListMap,
  splitCombinedMapsByCardTypes,
  createEmptySplitMapsObject,
  SplitMaps,
  sortTheView,
} from "../../utils/utilityFunctions";
import FullListCardRow from "./FullListCardRow";
import ViewHeader from "./SortViewHeader";

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
      sortButtonState.category,
      unsortedSplitMap.actions!,
      sortButtonState.sort
    );
    const sortedTreasures = sortTheView(
      sortButtonState.category,
      unsortedSplitMap.treasures!,
      sortButtonState.sort
    );
    const sortedVictories = sortTheView(
      sortButtonState.category,
      unsortedSplitMap.victories!,
      sortButtonState.sort
    );
    setSplitMaps({
      treasures: sortedTreasures,
      victories: sortedVictories,
      actions: sortedActions,
    });
  }, [pd]);

  useEffect(() => {
    if (firstRender.current) {
      // prevents this useEffect on first render
      firstRender.current = false;
      return;
    }
    const sortedActions = sortTheView(
      sortButtonState.category,
      splitMaps.actions!,
      sortButtonState.sort
    );
    const sortedTreasures = sortTheView(
      sortButtonState.category,
      splitMaps.treasures!,
      sortButtonState.sort
    );
    const sortedVictories = sortTheView(
      sortButtonState.category,
      splitMaps.victories!,
      sortButtonState.sort
    );

    setSplitMaps({
      treasures: sortedTreasures,
      victories: sortedVictories,
      actions: sortedActions,
    });
  }, [sortButtonState]);

  return (
    <div className="outer-shell">
      <ViewHeader />

      {/* Action section */}
      <div className="col-span-12 text-white">Actions</div>
      {Array.from(splitMaps?.actions!.keys()).map((card, idx) => {
        return (
          <FullListCardRow
            key={idx}
            drawProbability={calculateDrawProbability(
              splitMaps.actions!.get(card)?.zoneCount!,
              pd.library.length,
              getCountsFromArray(pd.graveyard).get(card)!,
              pd.graveyard.length
            )}
            cardName={card}
            cardAmount={splitMaps.actions!.get(card)?.entireDeckCount!}
            libraryAmount={splitMaps.actions!.get(card)?.zoneCount!}
          />
        );
      })}
      {/* Treasure Section */}
      <div className="col-span-12 text-white">Treasures</div>
      {Array.from(splitMaps.treasures!.keys()).map((card, idx) => {
        return (
          <FullListCardRow
            key={idx}
            drawProbability={calculateDrawProbability(
              splitMaps.treasures!.get(card)?.zoneCount!,
              pd.library.length,
              getCountsFromArray(pd.graveyard).get(card)!,
              pd.graveyard.length
            )}
            cardName={card}
            cardAmount={splitMaps.treasures!.get(card)?.entireDeckCount!}
            libraryAmount={splitMaps.treasures!.get(card)?.zoneCount!}
          />
        );
      })}
      {/* Victory section */}
      <div className="col-span-12 text-white">Victories</div>
      {Array.from(splitMaps?.victories!.keys()).map((card, idx) => {
        return (
          <FullListCardRow
            key={idx}
            drawProbability={calculateDrawProbability(
              splitMaps.victories!.get(card)?.zoneCount!,
              pd.library.length,
              getCountsFromArray(pd.graveyard).get(card)!,
              pd.graveyard.length
            )}
            cardName={card}
            cardAmount={splitMaps.victories!.get(card)?.entireDeckCount!}
            libraryAmount={splitMaps.victories!.get(card)?.zoneCount!}
          />
        );
      })}
    </div>
  );
};

export default CategoryViewer;
