import React, { FunctionComponent, useEffect, useState } from "react";
import { getRowColor } from "../../utils/utilityFunctions";

type CardRowProps = {
  cardAmount: number;
  libraryAmount: number;
  drawProbability: string;
  cardName: string;
};

const FullListCardRow: FunctionComponent<CardRowProps> = ({
  cardAmount,
  libraryAmount,
  drawProbability,
  cardName,
}) => {
  const [color, setColor] = useState<string>("text-white");
  useEffect(() => {
    setColor(getRowColor(cardName));
  }, []);

  return (
    <React.Fragment>
      <main
        className={`text-xs grid grid-cols-12 last:border border-x even:border-y`}
      >
        <div className={`${color} col-span-5 pl-1 whitespace-nowrap`}>
          {cardName}
        </div>
        <div className={`${color} align-center  col-span-4 text-center`}>
          {libraryAmount} / {cardAmount}
        </div>
        <div className={`${color} align-center  col-span-3 text-center pr-1`}>
          {drawProbability}
        </div>
      </main>
    </React.Fragment>
  );
};

export default FullListCardRow;
