import React, { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";

const containerStyle =
  "backdrop-blur-sm bg-black/[.85] text-white box-content";
const baseStyle =
  "grid grid grid-cols-12 pointer-events-none w-full overflow-hidden text-xs ";
const PrimaryFrameHeader = () => {
  const [currentTurn, setCurrentTurn] = useState<string>("Starting");
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const primaryFrameTab = useSelector(
    (state: RootState) => state.content.primaryFrameTab
  );
  const gameActiveStatus = useSelector(
    (state: RootState) => state.content.gameActiveStatus
  );
  const baseOnly = useSelector((state: RootState) => state.content.baseOnly);
  useEffect(() => {
    if (pd.gameTurn > 0) {
      const turn: string = "Turn - " + pd.gameTurn;
      setCurrentTurn(turn);
    }
  }, [pd, primaryFrameTab]);

  useEffect(() => {
    setCurrentTurn("Starting");
  }, [pd.gameTitle]);

  return (
    <React.Fragment>
      <div id="headerContainer" className={containerStyle}>
        {gameActiveStatus && baseOnly ? (
          <div className={baseStyle} id="header">
            <React.Fragment>
              <div
                className={"h-full w-full align-center col-span-7 border-b-2"}
              >
                {pd.gameTitle}
              </div>
              <div
                className={"h-full w-full align-center col-span-5 border-b-2"}
              >
                {pd.gameResult === "Unfinished" ? currentTurn : pd.gameResult}
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
            Sorry, Non-Base cards are not supported yet. Please use the base set
            to enjoy Dominion Companion. Non-base cards detected in game:
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default PrimaryFrameHeader;
