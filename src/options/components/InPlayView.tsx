import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getCountsFromArray } from "../utils/utilityFunctions";
import CardRow from "./CardRow";

const InPlayView = () => {
  const [inPlayMap, setInPlayMap] = useState<Map<string, number>>(new Map());

  const pd = useSelector((state: RootState) =>
    state.options.playerDeck)
 ;

  useEffect(() => {
    setInPlayMap(getCountsFromArray(pd.inPlay));
  }, [pd]);

  return (
    <React.Fragment>
      <div>InPlay {pd.inPlay.length}</div>
      <br></br>
      {Array.from(inPlayMap.keys()).map((card, idx) => {
        return (
          <CardRow
            key={idx}
            drawProbability={""}
            cardName={card}
            cardAmount={inPlayMap.get(card)!}
          />
        );
      })}
    </React.Fragment>
  );
};

export default InPlayView;
