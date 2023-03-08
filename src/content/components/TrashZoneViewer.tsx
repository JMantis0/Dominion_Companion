import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getCountsFromArray, getRowColor } from "./componentFunctions";
import ZoneCardRow from "./ZoneCardRow";

const TrashZoneViewer = () => {
  const [trashMap, setTrashMap] = useState<Map<string, number>>(
    new Map<string, number>()
  );
  const pd = useSelector((state: RootState) => state.content.playerDeck);

  useEffect(() => {
    setTrashMap(getCountsFromArray(pd.trash));
  }, [pd]);

  return (
    <div className="outer-shell">
      {Array.from(trashMap.entries()).map((entry, idx) => {
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
      })}
    </div>
  );
};

export default TrashZoneViewer;
