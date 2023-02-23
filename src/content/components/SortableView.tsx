import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  CardCounts,
  combineDeckListMapAndLibraryListMap,
  // createEmptySplitMapsObject,
  getCountsFromArray,
  // splitCombinedMapsByCardTypes,
  // SplitMaps,
} from "../../options/utils/utilityFunctions";
import { calculateDrawProbability } from "../utils/utilityFunctions";
import FullListCardRow from "./FullListCardRow";

import Grid from "@mui/material/Grid";
import "./content.css";
import ViewHeader from "./ViewHeader";

const SortableView = () => {
  // const [splitMaps, setSplitMaps] = useState<SplitMaps>(
  //   createEmptySplitMapsObject()
  // );
  const [combinedMap, setCombinedMap] = useState<Map<string, CardCounts>>(
    new Map()
  );
  const pd = useSelector((state: RootState) => state.content.playerDeck);

  useEffect(() => {
    setCombinedMap(
      combineDeckListMapAndLibraryListMap(
        getCountsFromArray(pd.entireDeck),
        getCountsFromArray(pd.library)
      )
    );
    // setSplitMaps(
    //   splitCombinedMapsByCardTypes(
    //     combineDeckListMapAndLibraryListMap(
    //       getCountsFromArray(pd.entireDeck),
    //       getCountsFromArray(pd.library)
    //     )
    //   )
    // );
  }, [pd]);

  const sortByAmountInLibrary = (sortParam: string) => {
    const mapCopy = new Map(combinedMap);
    const sortedMap: Map<string, CardCounts> = new Map();
    switch (sortParam) {
      case "probability": {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            return entryB[1].libraryCount - entryA[1].libraryCount;
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
        console.log("sortedMap:", sortedMap);
        setCombinedMap(sortedMap);
      }
    }
  };

  return (
    <div className="outer-shell">
      <div>Sortable View {pd.entireDeck.length}</div>
      <br></br>
      <Grid container>
        <ViewHeader sortState={}/>
        {/* Action section */}
        {/* <Grid xs={12}>Actions</Grid> */}
        {Array.from(combinedMap.keys()).map((card, idx) => {
          return (
            <FullListCardRow
              key={idx}
              drawProbability={calculateDrawProbability(
                combinedMap.get(card)?.libraryCount!,
                pd.library.length
              )}
              cardName={card}
              cardAmount={combinedMap.get(card)?.entireDeckCount!}
              libraryAmount={combinedMap.get(card)?.libraryCount!}
            />
          );
        })}
        {/* Treasure Section */}
        {/* <Grid xs={12}>Treasures</Grid>
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
        })} */}
        {/* Victory section */}
        {/* <Grid xs={12}>Victories</Grid>
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
        })} */}
      </Grid>
      <button
        onClick={() => {
          console.log("player deck:", pd);
        }}
      >
        player deck
      </button>
      <button
        onClick={() => {
          sortByAmountInLibrary("probability");
        }}
      >
        sort map
      </button>
    </div>
  );
};

export default SortableView;
