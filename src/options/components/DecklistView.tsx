import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  combineDeckListMapAndLibraryListMap,
  createEmptySplitMapsObject,
  getCountsFromArray,
  splitCombinedMapsByCardTypes,
  SplitMaps,
} from "../utils/utilityFunctions";
import FullListCardRow from "./FullListCardRow";
import Grid from "@mui/material/Grid";
import "./DecklistView.css";

const DecklistView = () => {
  // the splitMaps uses a custom type to easily render the 3 types of cards as desired.
  const [splitMaps, setSplitMaps] = useState<SplitMaps>(
    createEmptySplitMapsObject()
  );
  const pd = useSelector((state: RootState) => state.options.playerDeck);
  useEffect(() => {
    setSplitMaps(
      splitCombinedMapsByCardTypes(
        combineDeckListMapAndLibraryListMap(
          getCountsFromArray(pd.entireDeck),
          getCountsFromArray(pd.library)
        )
      )
    );
  }, [pd]);

  return (
    <div className="outer-shell">
      <div>Full Decklist {pd.entireDeck.length}</div>
      <br></br>
      <Grid container>
        {/* Action section */}
        <Grid xs={12}>Actions</Grid>
        {Array.from(splitMaps?.actions!.keys()).map((card, idx) => {
          return (
            <FullListCardRow
              key={idx}
              drawProbability={
                (
                  (splitMaps.actions!.get(card)?.libraryCount! /
                    pd.library.length) *
                  100
                )
                  .toString()
                  .slice(0, 3) + "%"
              }
              cardName={card}
              cardAmount={splitMaps.actions!.get(card)?.entireDeckCount!}
              libraryAmount={splitMaps.actions!.get(card)?.libraryCount!}
            />
          );
        })}
        {/* Treasure Section */}
        <Grid xs={12}>Treasures</Grid>
        {Array.from(splitMaps.treasures!.keys()).map((card, idx) => {
          return (
            <FullListCardRow
              key={idx}
              drawProbability={
                (
                  (splitMaps.treasures!.get(card)?.libraryCount! /
                    pd.library.length) *
                  100
                )
                  .toString()
                  .slice(0, 3) + "%"
              }
              cardName={card}
              cardAmount={splitMaps.treasures!.get(card)?.entireDeckCount!}
              libraryAmount={splitMaps.treasures!.get(card)?.libraryCount!}
            />
          );
        })}
        {/* Victory section */}
        <Grid xs={12}>Victories</Grid>
        {Array.from(splitMaps?.victories!.keys()).map((card, idx) => {
          return (
            <FullListCardRow
              key={idx}
              drawProbability={
                (
                  (splitMaps.victories!.get(card)?.libraryCount! /
                    pd.library.length) *
                  100
                )
                  .toString()
                  .slice(0, 3) + "%"
              }
              cardName={card}
              cardAmount={splitMaps.victories!.get(card)?.entireDeckCount!}
              libraryAmount={splitMaps.victories!.get(card)?.libraryCount!}
            />
          );
        })}
      </Grid>
    </div>
  );
};

export default DecklistView;
