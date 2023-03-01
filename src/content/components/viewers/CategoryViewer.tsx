import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  getCountsFromArray,
  combineDeckListMapAndZoneListMap,
  splitCombinedMapsByCardTypes,
  createEmptySplitMapsObject,
  SplitMaps,
  sortTheView,
} from "../../utils/utilityFunctions";
import ViewHeader from "./SortViewHeader";
import ZoneCardRow from "./ZoneCardRow";

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
      sortButtonState.sort,pd
    );
    const sortedTreasures = sortTheView(
      sortButtonState.category,
      unsortedSplitMap.treasures!,
      sortButtonState.sort,pd
    );
    const sortedVictories = sortTheView(
      sortButtonState.category,
      unsortedSplitMap.victories!,
      sortButtonState.sort,pd
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
      sortButtonState.sort,pd
    );
    const sortedTreasures = sortTheView(
      sortButtonState.category,
      splitMaps.treasures!,
      sortButtonState.sort,pd
    );
    const sortedVictories = sortTheView(
      sortButtonState.category,
      splitMaps.victories!,
      sortButtonState.sort,pd
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
          <ZoneCardRow
            key={idx}
            cardName={card}
            cardAmountInZone={splitMaps.actions!.get(card)?.entireDeckCount!}
          />
        );
      })}
      {/* Treasure Section */}
      <div className="col-span-12 text-white">Treasures</div>
      {Array.from(splitMaps.treasures!.keys()).map((card, idx) => {
        return (
          <ZoneCardRow
            key={idx}
            cardName={card}
            cardAmountInZone={splitMaps.actions!.get(card)?.entireDeckCount!}
          />
        );
      })}
      {/* Victory section */}
      <div className="col-span-12 text-white">Victories</div>
      {Array.from(splitMaps?.victories!.keys()).map((card, idx) => {
        return (
          <ZoneCardRow
            key={idx}
            cardName={card}
            cardAmountInZone={splitMaps.actions!.get(card)?.entireDeckCount!}
          />
        );
      })}
    </div>
  );
};

export default CategoryViewer;
