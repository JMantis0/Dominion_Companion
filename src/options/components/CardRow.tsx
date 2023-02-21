import React, { FunctionComponent } from "react";

type CardRowProps = {
  cardAmount: number;
  drawProbability: string;
  cardName: string;
};

const CardRow: FunctionComponent<CardRowProps> = ({
  cardAmount,
  drawProbability,
  cardName,
}) => {
  return (
    <div>
      <span> {drawProbability} </span>
      <span> {cardName} </span>
      <span> {cardAmount} </span>
    </div>
  );
};

export default CardRow;
