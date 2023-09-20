import React, { FunctionComponent, useEffect, useState } from "react";
import { getProb } from "../../PrimaryFrame/components/componentFunctions";

type ProbabilityFrameRowProps = {
  card: string;
  drawAmount: number;
  library: string[];
  graveyard: string[];
  hand: string[];
  inPlay: string[];
  setAside: string[];
  turn: "This" | "Next";
};

const ProbabilityFrameRow: FunctionComponent<ProbabilityFrameRowProps> = ({
  card,
  drawAmount,
  library,
  graveyard,
  hand,
  inPlay,
  setAside,
  turn,
}) => {
  const [turnDependentGy, setTurnDependentGy] = useState<string[]>(graveyard);
  useEffect(() => {
    setTurnDependentGy(
      turn === "This" ? graveyard : graveyard.concat(hand, inPlay, setAside)
    );
  }, [turn]);
  return (
    <React.Fragment>
      <div className="text-white text-xs col-span-4">{card}</div>
      <div className="text-white text-xs col-span-1">
        {getProb(card, library, turnDependentGy, 0, drawAmount).hyperGeo}
      </div>
      <div className="text-white text-xs col-span-1">
        {getProb(card, library, turnDependentGy, 1, drawAmount).cumulative}
      </div>
      <div className="text-white text-xs col-span-1">
        {getProb(card, library, turnDependentGy, 2, drawAmount).cumulative}
      </div>
      <div className="text-white text-xs col-span-1">
        {getProb(card, library, turnDependentGy, 3, drawAmount).cumulative}
      </div>
      <div className="text-white text-xs col-span-1">
        {getProb(card, library, turnDependentGy, 4, drawAmount).cumulative}
      </div>
      <div className="text-white text-xs col-span-1">
        {getProb(card, library, turnDependentGy, 5, drawAmount).cumulative}
      </div>
    </React.Fragment>
  );
};

export default ProbabilityFrameRow;
