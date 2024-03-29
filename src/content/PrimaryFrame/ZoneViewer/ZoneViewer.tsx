import React, { useState, FunctionComponent } from "react";
import { getRowColor, useZoneViewerSorter } from "../../../utils/utils";
import ZoneCardRow from "./ZoneCardRow/ZoneCardRow";
import ZoneViewHeader from "./ZoneViewHeader/ZoneViewHeader";
import type { SortButtonState } from "../../../utils";

type ZoneViewerProps = {
  zone: string[];
  title: string;
};
const ZoneViewer: FunctionComponent<ZoneViewerProps> = ({ zone, title }) => {
  const [map, setMap] = useState<Map<string, number>>(new Map());
  const [zoneSortButtonState, setZoneSortButtonState] =
    useState<SortButtonState>({
      category: "zone",
      sort: "ascending",
    });
  useZoneViewerSorter(zone, zoneSortButtonState, setMap);
  return (
    <div className="text-xs outer-shell">
      <ZoneViewHeader
        currentSortState={zoneSortButtonState}
        setSortButtonState={setZoneSortButtonState}
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
