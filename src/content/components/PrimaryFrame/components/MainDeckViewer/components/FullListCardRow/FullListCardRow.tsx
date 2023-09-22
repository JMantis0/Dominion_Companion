import React, { FunctionComponent } from "react";

type CardRowProps = {
  cardAmount: number;
  libraryAmount: number;
  drawProbability: string;
  hyper5: number;
  cardName: string;
  color: string;
};
const FullListCardRow: FunctionComponent<CardRowProps> = ({
  cardAmount,
  libraryAmount,
  drawProbability,
  hyper5,
  cardName,
  color,
}) => {
  return (
    <React.Fragment>
      <main
        className={`text-xs grid grid-cols-12 first:border last:border border-x even:border-y`}
      >
        <div className={`${color} col-span-3 pl-1 whitespace-nowrap`}>
          {cardName}
        </div>
        <div className={`${color} align-center  col-span-4 text-center`}>
          {libraryAmount} / {cardAmount}
        </div>
        <div className={`${color} align-center  col-span-3 text-center pr-1`}>
          {drawProbability}
        </div>
        <div className={`${color} align-center  col-span-2 text-center pr-1`}>
          {hyper5}
        </div>
      </main>
    </React.Fragment>
  );
};

export default FullListCardRow;
