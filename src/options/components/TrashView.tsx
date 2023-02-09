import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getCountsFromArray } from "../utils/utilityFunctions";
import CardRow from "./CardRow";

const TrashView = () => {
  const [trashMap, setTrashMap] = useState<Map<string, number>>(new Map());

  const pd = useSelector((state: RootState) => state.options.playerDeck);

  useEffect(() => {
    setTrashMap(getCountsFromArray(pd.trash));
  }, [pd]);

  return (
    <React.Fragment>
      <div>Trash {pd.trash.length}</div>
      <br></br>
      {Array.from(trashMap.keys()).map((card, idx) => {
        return (
          <CardRow
            key={idx}
            drawProbability={""}
            cardName={card}
            cardAmount={trashMap.get(card)}
          />
        );
      })}
    </React.Fragment>
  );
};
export default TrashView