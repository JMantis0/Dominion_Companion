import React, { BaseSyntheticEvent, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { getCountsFromArray } from "../PrimaryFrame/components/componentFunctions";
import ProbabilityFrameRow from "./ProbabilityFrameRow/ProbabilityFrameRow";

const DrawProbabilityFrame = () => {
  const playerDeck = useSelector(
    (state: RootState) => state.content.playerDeck
  );
  const [drawAmount, setDrawAmount] = useState<number>(1);
  const [turnToggle, setTurnToggle] = useState<"Current" | "Next">("Current");
  const handleCardAmountChange = (e: BaseSyntheticEvent) => {
    console.log("cardAmountChange", e);
    setDrawAmount(e.target.value);
  };
  return (
    <React.Fragment>
      <input
        type="number"
        value={drawAmount}
        onChange={handleCardAmountChange}
      ></input>
      <button
        className={`${turnToggle === "Current" ? "bg-lime-400" : "bg-red-500"}`}
        onClick={() => {
          setTurnToggle("Current");
        }}
      >
        Current Turn
      </button>
      <button
        className={`${turnToggle === "Next" ? "bg-lime-400" : "bg-red-500"}`}
        onClick={() => {
          setTurnToggle("Next");
        }}
      >
        Next Turn
      </button>
      <div className="text-white grid grid-cols-12">
        <div className={"text-white col-span-4"}></div>
        <div className={"text-white col-span-1"}>= 0</div>
        <div className={"text-white col-span-1"}>{">=1"}</div>
        <div className={"text-white col-span-1"}>{">=2"}</div>
        <div className={"text-white col-span-1"}>{">=3"}</div>
        <div className={"text-white col-span-1"}>{">=4"}</div>
        <div className={"text-white col-span-1"}>{">=5"}</div>
        {Array.from(getCountsFromArray(playerDeck.entireDeck).keys()).map(
          (card, idx) => {
            return (
              <ProbabilityFrameRow
                key={idx}
                card={card}
                drawAmount={drawAmount}
                deck={playerDeck}
                turn={turnToggle}
              />
            );
          }
        )}
      </div>
    </React.Fragment>
  );
};

export default DrawProbabilityFrame;
