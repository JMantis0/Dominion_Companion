import React from "react";

const CardRow = ({ cardAmount, drawProbability, cardName }) => {
  return (
    <div>
      <span> {drawProbability} </span>
      <span> {cardName} </span>
      <span> {cardAmount} </span>
    </div>
  );
};

export default CardRow;
