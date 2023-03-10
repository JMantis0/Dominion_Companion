import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getCountsFromArray, getRowColor } from "./componentFunctions";
import ZoneCardRow from "./ZoneCardRow";

const TrashZoneViewer = () => {
  const [trashMap, setTrashMap] = useState<Map<string, number>>(
    new Map<string, number>()
  );
  const [opponentTrashMap, setOpponentTrashMap] = useState<Map<string, number>>(
    new Map<string, number>()
  );
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const od = useSelector((state: RootState) => state.content.opponentDeck);
  useEffect(() => {
    setTrashMap(getCountsFromArray(pd.trash));
    setOpponentTrashMap(getCountsFromArray(od.trash));
  }, [pd]);

  return (
    <div className="outer-shell">
      <div className={`text-white`}>{pd.playerName}'s trash:</div>
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
