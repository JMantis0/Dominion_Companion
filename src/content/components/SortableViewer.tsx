import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  CardCounts,
  combineDeckListMapAndLibraryListMap,
  getCountsFromArray,
} from "../../options/utils/utilityFunctions";
import { calculateDrawProbability } from "../utils/utilityFunctions";
import FullListCardRow from "./FullListCardRow";
import Grid from "@mui/material/Grid";
import ViewHeader from "./ViewHeader";
import "./content.css";

const SortableView = () => {
  const [combinedMap, setCombinedMap] = useState<Map<string, CardCounts>>(
    new Map()
  );
  const pd = useSelector((state: RootState) => state.content.playerDeck);

  useEffect(() => {
    const unsortedCompinedMap = combineDeckListMapAndLibraryListMap(
      getCountsFromArray(pd.entireDeck),
      getCountsFromArray(pd.library)
    );
    const sortedCombinedMap = sortByAmountInLibrary(
      "probability",
      unsortedCompinedMap
    );
    setCombinedMap(sortedCombinedMap);
  }, [pd]);

  const sortByAmountInLibrary = (
    sortParam: string,
    unsortedMap: Map<string, CardCounts>
  ): Map<string, CardCounts> => {
    const mapCopy = new Map(unsortedMap);
    const sortedMap: Map<string, CardCounts> = new Map();
    switch (sortParam) {
      case "probability":
        {
          [...mapCopy.entries()]
            .sort((entryA, entryB) => {
              return entryB[1].libraryCount - entryA[1].libraryCount;
            })
            .forEach((entry) => {
              const [card, cardCounts] = entry;
              sortedMap.set(card, cardCounts);
            });
        }
        break;
      default:
    }
    return sortedMap;
  };

  return (
    <div className="outer-shell">
      <div>Sortable View {pd.entireDeck.length}</div>
      <br></br>
      <Grid container>
        <ViewHeader />
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
          sortByAmountInLibrary("probability", combinedMap);
        }}
      >
        sort map
      </button>
    </div>
  );
};

export default SortableView;
