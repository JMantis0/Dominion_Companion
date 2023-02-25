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
      <div className="col-span-1"></div>
      <div className="col-span-3">{cardName}</div>
      <div className="col-span-2">{libraryAmount}</div>
      <div className="col-span-1">/</div>
      <div className="col-span-2">{cardAmount}</div>
      <div className="col-span-2">{drawProbability}</div>
      <div className="col-span-1"></div>
    </React.Fragment>
  );
};

export default FullListCardRow;
