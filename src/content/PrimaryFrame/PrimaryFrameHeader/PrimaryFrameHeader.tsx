import React, { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

const PrimaryFrameHeader = () => {
  const [currentTurn, setCurrentTurn] = useState<string>("Starting");
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const od = useSelector((state: RootState) => state.content.opponentDeck);
  const primaryFrameTab = useSelector(
    (state: RootState) => state.content.primaryFrameTab
  );

  useEffect(() => {
    if (pd.gameTurn > 0 || od.gameTurn > 0) {
      let turn: string;
      turn =
        "Turn - " + (pd.gameTurn <= od.gameTurn ? od.gameTurn : pd.gameTurn);
      setCurrentTurn(turn);
    }
  }, [pd, primaryFrameTab]);

  useEffect(() => {
    setCurrentTurn("Starting");
  }, [pd.gameTitle]);

  return (
    <div
      className="text-xs mt-[-41px] text-white grid grid-cols-12"
      id="header"
    >
      <div
        className={`h-full w-full align-center col-span-7 whitespace-nowrap`}
      >
        {pd.gameTitle}
      </div>
      <div
        className={`h-full w-full align-center col-span-4 whitespace-nowrap`}
      >
        {pd.gameResult === "Unfinished" ? currentTurn : pd.gameResult}
      </div>
      <div className="col-span-5 max-h-[29px]">
        <div className="text-center text-white">{pd.playerName}</div>
        {pd.ratedGame ? (
          <div className="text-[9px] relative -top-1 text-center text-white">
            ( {pd.rating} )
          </div>
        ) : null}
      </div>
      <div className="col-span-2 text-center text-white">vs.</div>
      <div className="col-span-5 max-h-[29px]">
        <div className=" text-center text-white">{od.playerName}</div>
        {pd.ratedGame ? (
          <div className="text-[9px] relative -top-1 text-center text-white">
            ( {od.rating} )
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PrimaryFrameHeader;
