import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  calculateDrawProbability,
  getCountsFromArray,
  combineDeckListMapAndLibraryListMap,
  splitCombinedMapsByCardTypes,
  createEmptySplitMapsObject,
  SplitMaps,
  sortTheView,
} from "../../utils/utilityFunctions";
import FullListCardRow from "../FullListCardRow";
import Grid from "@mui/material/Grid";
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
      combineDeckListMapAndLibraryListMap(
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
      firstRender.current = false;
      console.log("first render, skipping sort useffect");
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
      <div className="font-bold">Full Decklist {pd.entireDeck.length}</div>
      <br></br>
      <Grid container>
        <ViewHeader />
        {/* Action section */}
        <Grid item={true} xs={12}>
          Actions
        </Grid>
        {Array.from(splitMaps?.actions!.keys()).map((card, idx) => {
          return (
            <FullListCardRow
              key={idx}
              drawProbability={calculateDrawProbability(
                splitMaps.actions!.get(card)?.libraryCount!,
                pd.library.length
              )}
              cardName={card}
              cardAmount={splitMaps.actions!.get(card)?.entireDeckCount!}
              libraryAmount={splitMaps.actions!.get(card)?.libraryCount!}
            />
          );
        })}
        {/* Treasure Section */}
        <Grid item={true} xs={12}>
          Treasures
        </Grid>
        {Array.from(splitMaps.treasures!.keys()).map((card, idx) => {
          return (
            <FullListCardRow
              key={idx}
              drawProbability={calculateDrawProbability(
                splitMaps.treasures!.get(card)?.libraryCount!,
                pd.library.length
              )}
              cardName={card}
              cardAmount={splitMaps.treasures!.get(card)?.entireDeckCount!}
              libraryAmount={splitMaps.treasures!.get(card)?.libraryCount!}
            />
          );
        })}
        {/* Victory section */}
        <Grid item={true} xs={12}>
          Victories
        </Grid>
        {Array.from(splitMaps?.victories!.keys()).map((card, idx) => {
          return (
            <FullListCardRow
              key={idx}
              drawProbability={calculateDrawProbability(
                splitMaps.victories!.get(card)?.libraryCount!,
                pd.library.length
              )}
              cardName={card}
              cardAmount={splitMaps.victories!.get(card)?.entireDeckCount!}
              libraryAmount={splitMaps.victories!.get(card)?.libraryCount!}
            />
          );
        })}
      </Grid>
      <button
        onClick={() => {
          console.log("player deck:", pd);
        }}
      ></button>
    </div>
  );
};

export default CategoryViewer;
