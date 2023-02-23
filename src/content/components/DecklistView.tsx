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
import { calculateDrawProbability } from "../utils/utilityFunctions";
import FullListCardRow from "./FullListCardRow";

import Grid from "@mui/material/Grid";
import "./content.css";
import ViewHeader from "./ViewHeader";

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

  return (
    <div className="outer-shell">
      <div>Full Decklist {pd.entireDeck.length}</div>
      <br></br>
      <Grid container>
        <ViewHeader sortState={{ ascending: false }} />
        {/* Action section */}
        <Grid xs={12}>Actions</Grid>
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
        <Grid xs={12}>Treasures</Grid>
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
        <Grid xs={12}>Victories</Grid>
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

export default DecklistView;
