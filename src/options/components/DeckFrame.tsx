import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import CardRow from "./CardRow";

const getCountsFromArray = (
  decklistArray: Array<string>
): Map<string, number> => {
  const cardCountsMap = new Map<string, number>();
  decklistArray.forEach((card) => {
    if (cardCountsMap.has(card)) {
      cardCountsMap.set(card, cardCountsMap.get(card) + 1);
    } else {
      cardCountsMap.set(card, 1);
    }
  });
  return cardCountsMap;
};

const DeckFrame = () => {
  const [countMap, setCountMap] = useState<Map<string, number>>(new Map());
  const playerDeckState = useSelector(
    (state: RootState) => state.options.playerDeck
  );

  useEffect(() => {
    setCountMap(getCountsFromArray(JSON.parse(playerDeckState).entireDeck));
  }, [playerDeckState]);

  return (
    <React.Fragment>
      <div>DeckFrame</div>
      {Array.from(countMap.keys()).map((card, idx) => {
        return (
          <CardRow
            key={idx}
            drawProbability={""}
            cardName={card}
            cardAmount={countMap.get(card)}
          />
        );
      })}
    </React.Fragment>
  );
};

export default DeckFrame;
