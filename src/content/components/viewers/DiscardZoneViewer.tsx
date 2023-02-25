import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  CardCounts,
  combineDeckListMapAndZoneListMap,
  getCountsFromArray,
  sortTheView,
} from "../../utils/utilityFunctions";
import ZoneCardRow from "./ZoneCardRow";
import ViewHeader from "./SortViewHeader";

const DiscardZoneViewer = () => {
  const firstRender = useRef(true);
  const [combinedMap, setCombinedMap] = useState<Map<string, CardCounts>>(
    new Map()
  );
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const sortButtonState = useSelector(
    (state: RootState) => state.content.sortButtonState
  );

  useEffect(() => {
    const unsortedCombinedMap = combineDeckListMapAndZoneListMap(
      getCountsFromArray(pd.entireDeck),
      getCountsFromArray(pd.graveyard)
    );
    const sortedCombinedMap = sortTheView(
      sortButtonState.category,
      unsortedCombinedMap,
      sortButtonState.sort
    );
    setCombinedMap(sortedCombinedMap);
  }, [pd]);

  useEffect(() => {
    if (firstRender.current) {
      // prevents this useEffect from doing anything on first render.
      firstRender.current = false;
      return;
    }
    setCombinedMap(
      sortTheView(sortButtonState.category, combinedMap, sortButtonState.sort)
    );
  }, [sortButtonState]);

  return (
    <div className="outer-shell">
      <div>Sortable View {pd.entireDeck.length}</div>
      <br></br>
      <div className={"grid grid-cols-12"}>
        {/* <ViewHeader /> */}
        {Array.from(combinedMap.keys()).map((card, idx) => {
          return (
            <ZoneCardRow
              key={idx}
              cardName={card}
              cardAmountOwned={combinedMap.get(card)?.entireDeckCount!}
              cardAmountInZone={combinedMap.get(card)?.zoneCount!}
            />
          );
        })}
      </div>
      <button
        onClick={() => {
          console.log("player deck:", pd);
        }}
      >
        Print pDeck
      </button>
    </div>
  );
};

export default DiscardZoneViewer;
