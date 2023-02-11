import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getCountsFromArray } from "../utils/utilityFunctions";
import CardRow from "./CardRow";

const LibraryView = () => {
  const [libraryMap, setLibraryMap] = useState<Map<string, number>>(new Map());

  const pd = 
    useSelector((state: RootState) => state.options.playerDeck)
  ;

  useEffect(() => {
    setLibraryMap(getCountsFromArray(pd.library));
  }, [pd]);

  return (
    <React.Fragment>
      <div>Library {pd.library.length}</div>
      <br></br>
      {Array.from(libraryMap.keys()).map((card, idx) => {
        return (
          <CardRow
            key={idx}
            drawProbability={""}
            cardName={card}
            cardAmount={libraryMap.get(card)}
          />
        );
      })}
    </React.Fragment>
  );
};
export default LibraryView;
