import React, { FunctionComponent } from "react";
import { getProb } from "../../PrimaryFrame/components/componentFunctions";
import { StoreDeck } from "../../../../model/storeDeck";

type ProbabilityFrameRowProps = {
  card: string;
  drawAmount: number;
  deck: StoreDeck;
  turn: "Current" | "Next";
};

const ProbabilityFrameRow: FunctionComponent<ProbabilityFrameRowProps> = ({
  card,
  drawAmount,
  deck,
  turn,
}) => {
 

  return (
    <React.Fragment>
      <div className="text-white text-xs col-span-4">{card}</div>
      <div className="text-white text-xs col-span-1">
        {getProb(deck, card, turn, 0, drawAmount).hyperGeo}
      </div>
      <div className="text-white text-xs col-span-1">
        {getProb(deck, card, turn, 1, drawAmount).cumulative}
      </div>
      <div className="text-white text-xs col-span-1">
        {getProb(deck, card, turn, 2, drawAmount).cumulative}
      </div>
      <div className="text-white text-xs col-span-1">
        {getProb(deck, card, turn, 3, drawAmount).cumulative}
      </div>
      <div className="text-white text-xs col-span-1">
        {getProb(deck, card, turn, 4, drawAmount).cumulative}
      </div>
      <div className="text-white text-xs col-span-1">
        {getProb(deck, card, turn, 5, drawAmount).cumulative}
      </div>
    </React.Fragment>
  );
};

export default ProbabilityFrameRow;
