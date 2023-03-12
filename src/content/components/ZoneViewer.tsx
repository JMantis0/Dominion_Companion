import React, { useState, useEffect, FunctionComponent } from "react";
import { useSelector } from "react-redux";
import {
  setDiscardSortState,
  setOpponentSortState,
  setOpponentTrashSortState,
  setSortedButtonsState,
  setTrashSortState,
  SortButtonState,
} from "../../redux/contentSlice";
import { RootState } from "../../redux/store";
import {
  getCountsFromArray,
  getRowColor,
  sortZoneView,
} from "./componentFunctions";
import ZoneCardRow from "./ZoneCardRow";
import ZoneViewHeader from "./ZoneViewHeader";
type ZoneViewerProps = {
  zone: string[];
  title: string;
  sortButtonState: SortButtonState;
  sortDispatchFunc:
    | typeof setSortedButtonsState
    | typeof setDiscardSortState
    | typeof setOpponentSortState
    | typeof setOpponentTrashSortState
    | typeof setTrashSortState;
};
const ZoneViewer: FunctionComponent<ZoneViewerProps> = ({ zone, title, sortButtonState, sortDispatchFunc }) => {
  const [map, setMap] = useState<Map<string, number>>(new Map());
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  useEffect(() => {
    const unsortedMap = getCountsFromArray(zone);
    const sortedMap = sortZoneView(
      sortButtonState.category,
      unsortedMap,
      sortButtonState.sort
    );
    setMap(sortedMap);
  }, [pd, sortButtonState]);
  return (
    <div className="text-xs outer-shell">
      <ZoneViewHeader
        dispatchFunc={sortDispatchFunc}
        reduxState={sortButtonState}
      />
      {zone.length !== undefined && zone.length !== 0 ? (
        Array.from(map.entries()).map((entry, idx) => {
          const card = entry[0];
          const cardAmount = entry[1];
          return (
            cardAmount > 0 && (
              <ZoneCardRow
                key={idx}
                cardName={card}
                cardAmountInZone={cardAmount}
                color={getRowColor(card)}
              />
            )
          );
        })
      ) : (
        <div className="text-white">{title} is empty.</div>
      )}
    </div>
  );
};
export default ZoneViewer;
