import React from "react";

const CardRow = ({ cardAmount, drawProbability, cardName }) => {
  return (
    <div>
      cardrow
      <span>{cardAmount}</span>
      <span>{drawProbability}</span>
      <span>{cardName}</span>
    </div>
  );
};

export default CardRow;
