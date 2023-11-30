import React, { useState, FunctionComponent } from "react";
import { getRowColor, useViewerSorter } from "../../../utils/utils";
import ZoneCardRow from "./ZoneCardRow/ZoneCardRow";
import ZoneViewHeader from "./ZoneViewHeader/ZoneViewHeader";
import type {
  SortButtonState,
  SortReducer,
  StoreDeck,
  OpponentStoreDeck,
} from "../../../utils";

type ZoneViewerProps = {
  deck: StoreDeck | OpponentStoreDeck;
  zone: string[];
  title: string;
  sortButtonState: SortButtonState;
  sortDispatchFunc: SortReducer;
};
const ZoneViewer: FunctionComponent<ZoneViewerProps> = ({
  deck,
  zone,
  title,
  sortButtonState,
  sortDispatchFunc,
}) => {
  const [map, setMap] = useState<Map<string, number>>(new Map());
  useViewerSorter(zone, sortButtonState, setMap, [deck, sortButtonState]);
  return (
    <div className="text-xs outer-shell">
      <ZoneViewHeader
        dispatchFunc={sortDispatchFunc}
        currentSortState={sortButtonState}
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
        <div className="text-white pointer-events-none">{title} is empty.</div>
      )}
    </div>
  );
};
export default ZoneViewer;
