import React, { FunctionComponent } from "react";

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
  return (
    <React.Fragment>
      <main className={"text-xs grid grid-cols-12 last:border border-x even:border-y"}>
        <div className="text-white col-span-5 pl-1 whitespace-nowrap">
          {cardName}
        </div>
        <div className="align-center text-white col-span-4 text-center">
          {libraryAmount} / {cardAmount}
        </div>
        {/* <div className="align-center text-white col-span-1">/</div>
        <div className="align-center text-white col-span-1 text-center">
        </div> */}
        <div className="align-center text-white col-span-3 text-center pr-1">
          {drawProbability}
        </div>
      </main>
    </React.Fragment>
  );
};

export default FullListCardRow;
