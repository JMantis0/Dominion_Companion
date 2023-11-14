import React, { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import MinimizeButton from "../MinimizeButton/MinimizeButton";

const style =
  "grid backdrop-blur-sm bg-black/[.85] text-xs text-white grid grid-cols-12 whitespace-nowrap pointer-events-none border-double w-full overflow-hidden";

const PrimaryFrameHeader = () => {
  const [currentTurn, setCurrentTurn] = useState<string>("Starting");
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const od = useSelector((state: RootState) => state.content.opponentDeck);
  const primaryFrameTab = useSelector(
    (state: RootState) => state.content.primaryFrameTab
  );
  const minimized = useSelector((state: RootState) => state.content.minimized);

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
    <React.Fragment>
      <div
        className={
          minimized ? style + " border-8" : style + " border-t-8 border-x-8"
        }
        id="header"
      >
        <div className={`h-full w-full align-center col-span-7 border-b-2`}>
          {pd.gameTitle}
        </div>
        <div className={`h-full w-full align-center col-span-5 border-b-2`}>
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
          <div className="text-center text-white">{od.playerName}</div>
          {pd.ratedGame ? (
            <div className="text-[9px] relative -top-1 text-center text-white">
              ( {od.rating} )
            </div>
          ) : null}
        </div>
      </div>
      <MinimizeButton />
    </React.Fragment>
  );
};

export default PrimaryFrameHeader;
