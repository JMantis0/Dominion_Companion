import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getCountsFromArray } from "../utils/utilityFunctions";
import CardRow from "./CardRow";

const DiscardView = () => {
  const [discardMap, setDiscardMap] = useState<Map<string, number>>(new Map());

  const pd = useSelector((state: RootState) => state.options.playerDeck);

  useEffect(() => {
    setDiscardMap(getCountsFromArray(pd.graveyard));
  }, [pd]);

  return (
    <React.Fragment>
      <div>Discard Pile {pd.graveyard.length}</div>
      <br></br>
      {Array.from(discardMap.keys()).map((card, idx) => {
        return (
          <CardRow
            key={idx}
            drawProbability={""}
            cardName={card}
            cardAmount={discardMap.get(card)}
          />
        );
      })}
    </React.Fragment>
  );
};

export default DiscardView;
