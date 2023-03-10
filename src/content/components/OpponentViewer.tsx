import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getCountsFromArray, getRowColor } from "./componentFunctions";
import ZoneCardRow from "./ZoneCardRow";

const OpponentViewer = () => {
  const [listMap, setListMap] = useState<Map<string, number>>(
    new Map<string, number>()
  );
  const [trashMap, setTrashMap] = useState<Map<string, number>>(
    new Map<string, number>()
  );
  const od = useSelector((state: RootState) => state.content.opponentDeck);

  useEffect(() => {
    setListMap(getCountsFromArray(od.entireDeck.slice().sort()));
    setTrashMap(getCountsFromArray(od.trash.slice().sort()));
  }, [od]);

  return (
    <div className="outer-shell">
      <div className={`text-white`}>{od.playerName}'s Deck: {od.entireDeck.length} cards</div>
      {Array.from(listMap.entries()).map((entry, idx) => {
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
      <div className={`text-white`}>{od.playerName}'s trash: {od.trash.length}</div>
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

export default OpponentViewer;
