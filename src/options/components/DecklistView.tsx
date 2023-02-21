import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getCountsFromArray } from "../utils/utilityFunctions";
import CardRow from "./CardRow";

const DecklistView = () => {
  const [listMap, setListMap] = useState<Map<string, number>>(new Map());

  const pd = useSelector((state: RootState) => state.options.playerDeck);

  useEffect(() => {
    setListMap(getCountsFromArray(pd.entireDeck));
  }, [pd]);

  return (
    <React.Fragment>
      <div>Full Decklist {pd.entireDeck.length}</div>
      <br></br>
      {Array.from(listMap.keys()).map((card, idx) => {
        return (
          <CardRow
            key={idx}
            drawProbability={""}
            cardName={card}
            cardAmount={listMap.get(card)!}
          />
        );
      })}
    </React.Fragment>
  );
};

export default DecklistView;
