import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  combineDeckListMapAndLibraryListMap,
  createEmptySplitMapsObject,
  getCountsFromArray,
  splitCombinedMapsByCardTypes,
  SplitMaps,
} from "../../options/utils/utilityFunctions";
import FullListCardRow from "../../options/components/FullListCardRow";

import Grid from "@mui/material/Grid";
import "./content.css";

const DecklistView = () => {
  const [splitMaps, setSplitMaps] = useState<SplitMaps>(
    createEmptySplitMapsObject()
  );
  const pd = useSelector((state: RootState) => state.content.playerDeck);

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

  const calculateDrawProbabilty = (cardAmount: number): string => {
    let probability: string;
    if (pd.library.length === 0) {
      probability = "0%";
    } else {
      probability =
        ((cardAmount / pd.library.length) * 100).toFixed(1).toString() + "%";
    }
    return probability;
  };

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
              drawProbability={calculateDrawProbabilty(
                splitMaps.actions!.get(card)?.libraryCount!
              )}
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
              drawProbability={calculateDrawProbabilty(
                splitMaps.treasures!.get(card)?.libraryCount!
              )}
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
              drawProbability={calculateDrawProbabilty(
                splitMaps.victories!.get(card)?.libraryCount!
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

export default DecklistView;
