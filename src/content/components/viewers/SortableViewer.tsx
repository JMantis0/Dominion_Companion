import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  CardCounts,
  combineDeckListMapAndLibraryListMap,
  getCountsFromArray,
  calculateDrawProbability,
  sortTheView,
} from "../../utils/utilityFunctions";
import FullListCardRow from "../FullListCardRow";
import Grid from "@mui/material/Grid";
import ViewHeader from "./SortViewHeader";

const SortableView = () => {
  // ref used to prevent useEffect from triggering on first render
  const firstRender = useRef(true);
  const [combinedMap, setCombinedMap] = useState<Map<string, CardCounts>>(
    new Map()
  );
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const sortButtonState = useSelector(
    (state: RootState) => state.content.sortButtonState
  );

  useEffect(() => {
    console.log("SortableViewer useEffect from playedeck state");
    const unsortedCompinedMap = combineDeckListMapAndLibraryListMap(
      getCountsFromArray(pd.entireDeck),
      getCountsFromArray(pd.library)
    );
    const sortedCombinedMap = sortTheView(
      sortButtonState.category,
      unsortedCompinedMap,
      sortButtonState.sort
    );
    setCombinedMap(sortedCombinedMap);
  }, [pd]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      console.log("first render, skipping sort useffect");
      return;
    }
    console.log("SortableViewer useEffect from ButtonState");
    setCombinedMap(
      sortTheView(sortButtonState.category, combinedMap, sortButtonState.sort)
    );
  }, [sortButtonState]);

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
          sortTheView(
            sortButtonState.category,
            combinedMap,
            sortButtonState.sort
          );
        }}
      >
        sort map
      </button>
    </div>
  );
};

export default SortableView;
