import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getCountsFromArray } from "../utils/utilityFunctions";
import CardRow from "./CardRow";

const HandView = () => {
  const [handMap, setHandMap] = useState<Map<string, number>>(new Map());

  const pd = 
    useSelector((state: RootState) => state.options.playerDeck)
 ;

  useEffect(() => {
    setHandMap(getCountsFromArray(pd.hand));
  }, [pd]);

  return (
    <React.Fragment>
      <div>Hand {pd.hand.length}</div>
      <br></br>
      {Array.from(handMap.keys()).map((card, idx) => {
        return (
          <CardRow
            key={idx}
            drawProbability={""}
            cardName={card}
            cardAmount={handMap.get(card)}
          />
        );
      })}
    </React.Fragment>
  );
};

export default HandView;
