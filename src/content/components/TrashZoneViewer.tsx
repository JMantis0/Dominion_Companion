import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  setOpponentTrashSortState,
  setTrashSortState,
} from "../../redux/contentSlice";
import { RootState } from "../../redux/store";
import {
  getCountsFromArray,
  getRowColor,
  sortZoneView,
} from "./componentFunctions";
import ZoneCardRow from "./ZoneCardRow";
import ZoneViewHeader from "./ZoneViewHeader";

const TrashZoneViewer = () => {
  const [trashMap, setTrashMap] = useState<Map<string, number>>(
    new Map<string, number>()
  );
  const [opponentTrashMap, setOpponentTrashMap] = useState<Map<string, number>>(
    new Map<string, number>()
  );
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const od = useSelector((state: RootState) => state.content.opponentDeck);
  const trashSortState = useSelector(
    (state: RootState) => state.content.trashSortState
  );
  const opponentTrashSortState = useSelector(
    (state: RootState) => state.content.opponentTrashSortState
  );

  // On initial render sort is set to zone/descending
  useEffect(() => {
    const unsortedTrashMap = getCountsFromArray(pd.trash);
    const sortedTrashMap = sortZoneView("zone", unsortedTrashMap, "descending");
    setTrashMap(sortedTrashMap);

    const unsortedOpponentTrashMap = getCountsFromArray(pd.trash);
    const sortedOpponentTrashMap = sortZoneView(
      "zone",
      unsortedOpponentTrashMap,
      "descending"
    );
    setOpponentTrashMap(sortedOpponentTrashMap);
  }, []);

  // Sort trash on deck or trashSortState change
  useEffect(() => {
    const unsortedTrashMap = getCountsFromArray(pd.trash);
    const sortedTrashMap = sortZoneView(
      trashSortState.category,
      unsortedTrashMap,
      trashSortState.sort
    );
    setTrashMap(sortedTrashMap);
  }, [pd, trashSortState]);

  // Sort the opponents trash on opponent deck or opponentTrashSortState change
  useEffect(() => {
    const unsortedOpponentTrashMap = getCountsFromArray(pd.trash);
    const sortedOpponentTrashMap = sortZoneView(
      opponentTrashSortState.category,
      unsortedOpponentTrashMap,
      opponentTrashSortState.sort
    );
    setOpponentTrashMap(sortedOpponentTrashMap);
  }, [pd, opponentTrashSortState]);

  return (
    <div className="outer-shell">
      <div className={`text-white`}>{pd.playerName}'s trash:</div>
      <ZoneViewHeader
        dispatchFunc={setTrashSortState}
        reduxState={trashSortState}
      />
      {pd.trash.length === 0 ? (
        <div className={`text-white`}>None</div>
      ) : (
        Array.from(trashMap.entries()).map((entry, idx) => {
          const card = entry[0];
          const cardCount = entry[1];
          return (
            cardCount > 0 && (
              <ZoneCardRow
                key={idx}
                cardName={card}
                cardAmountInZone={cardCount}
                color={getRowColor(card)}
              />
            )
          );
        })
      )}

      <div className={`text-white`}>{od.playerName}'s trash:</div>
      <ZoneViewHeader
        dispatchFunc={setOpponentTrashSortState}
        reduxState={opponentTrashSortState}
      />
      {od.trash.length === 0 ? (
        <div className={`text-white`}>None</div>
      ) : (
        Array.from(opponentTrashMap.entries()).map((entry, idx) => {
          const card = entry[0];
          const cardCount = entry[1];
          return (
            cardCount > 0 && (
              <ZoneCardRow
                key={idx}
                cardName={card}
                cardAmountInZone={cardCount}
                color={getRowColor(card)}
              />
            )
          );
        })
      )}
    </div>
  );
};

export default TrashZoneViewer;
