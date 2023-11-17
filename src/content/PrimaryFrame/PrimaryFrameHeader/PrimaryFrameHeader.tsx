import React, { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import MinimizeButton from "../MinimizeButton/MinimizeButton";

const containerStyle =
  "backdrop-blur-sm bg-black/[.85] text-white border-double min-h-[25px] box-content";

const baseStyle =
  "grid grid grid-cols-12 pointer-events-none w-full overflow-hidden text-xs ";

const minimizedBorder = " border-8";
const maximizedBorder = " border-t-8 border-x-8";

const PrimaryFrameHeader = () => {
  const [currentTurn, setCurrentTurn] = useState<string>("Starting");
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const od = useSelector((state: RootState) => state.content.opponentDeck);
  const primaryFrameTab = useSelector(
    (state: RootState) => state.content.primaryFrameTab
  );
  const minimized = useSelector((state: RootState) => state.content.minimized);
  const gameActiveStatus = useSelector(
    (state: RootState) => state.content.gameActiveStatus
  );
  const baseOnly = useSelector((state: RootState) => state.content.baseOnly);
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
        id="headerContainer"
        className={
          minimized
            ? containerStyle + minimizedBorder
            : containerStyle + maximizedBorder
        }
      >
        {gameActiveStatus && baseOnly ? (
          <div className={baseStyle} id="header">
            <React.Fragment>
              <div
                className={`h-full w-full align-center col-span-7 border-b-2`}
              >
                {pd.gameTitle}
              </div>
              <div
                className={`h-full w-full align-center col-span-5 border-b-2`}
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
                <div className="text-center text-white">{od.playerName}</div>
                {pd.ratedGame ? (
                  <div className="text-[9px] relative -top-1 text-center text-white">
                    ( {od.rating} )
                  </div>
                ) : null}
              </div>
            </React.Fragment>
          </div>
        ) : baseOnly ? (
          <div
            className={
              "text-white pointer-events-none h-full text-center m-auto whitespace-nowrap text-xs overflow-hidden"
            }
          >
            <span className="align-bottom w-full">No active game.</span>
          </div>
        ) : (
          <div className="text-white text-xs pointer-events-none text-center m-auto">
            Sorry, Non-Base cards are not
            supported yet. Please use the base set to enjoy Dominion Companion.
            Non-base cards detected in game:
          </div>
        )}
        <MinimizeButton />
      </div>
    </React.Fragment>
  );
};

export default PrimaryFrameHeader;
