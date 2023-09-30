/*global chrome*/
import React, { BaseSyntheticEvent, useEffect, useState } from "react";
import $ from "jquery";
import "jquery-ui-bundle/jquery-ui.css";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setViewerHidden } from "../../redux/contentSlice";
import MainDeckViewer from "./MainDeckViewer/MainDeckViewer";
import DiscardZoneViewer from "./DiscardZoneViewer/DiscardZoneViewer";
import TrashZoneViewer from "./TrashZoneViewer/TrashZoneViewer";
import OpponentViewer from "./OpponentViewer/OpponentViewer";

const PrimaryFrame = () => {
  const [currentTurn, setCurrentTurn] = useState("Starting");
  const od = useSelector((state: RootState) => state.content.opponentDeck);
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const baseOnly = useSelector((state: RootState) => state.content.baseOnly);
  const hidden = useSelector((state: RootState) => state.content.viewerHidden);
  const activeStatus = useSelector(
    (state: RootState) => state.content.gameActiveStatus
  );

  const dispatch = useDispatch();
  const [tabs, setTabs] = useState<"Deck" | "Discard" | "Trash" | "Opponent">(
    "Deck"
  );
  const [pinnedTab, setPinnedTab] = useState<
    "Deck" | "Discard" | "Trash" | "Opponent"
  >("Deck");

  const chromeMessageListener = (
    request: { command: string },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: { message: string }) => void
  ) => {
    sender;
    let response: { message: string } = { message: "" };
    if (request.command === "appendDomRoot") {
      dispatch(setViewerHidden(false));
      response.message = "Successfully turned on.";
    } else if (request.command === "removeDomRoot") {
      dispatch(setViewerHidden(true));
      response.message = "Successfully turned off.";
    } else if (request.command === "sendHiddenState") {
      response.message = hidden ? "Hidden state is ON" : "Hidden state is OFF";
    } else {
      response.message = "Invalid Request";
    }
    sendResponse(response);
  };

  const handleTabClick = (e: BaseSyntheticEvent) => {
    const tabName = e.target.name;
    setTabs(tabName);
    setPinnedTab(tabName);
  };

  const handleMouseEnter = (e: BaseSyntheticEvent) => {
    const tabName = e.target.name;
    setTabs(tabName);
  };

  const handleMouseLeave = () => {
    setTabs(pinnedTab);
  };

  useEffect(() => {
    if (chrome.runtime !== undefined)
      chrome.runtime.onMessage.addListener(chromeMessageListener);
    return () => {
      if (chrome.runtime !== undefined)
        chrome.runtime.onMessage.removeListener(chromeMessageListener);
    };
    // The 'hidden' variable is needed in the dependency list, to update the event listener with the new value of hidden.
    // Without this dependency, the event listener will have stale values for the 'hidden' variable
  }, [hidden]);

  useEffect(() => {
    $("#primaryFrame")
      .draggable({
        // optional callback:
        // drag: function (event, ui) {},
      })
      .resizable({
        handles: "all",
        // optional callback
        // resize: function (event, ui) {},
      });
  }, []);

  useEffect(() => {
    if (pd.gameTurn > 0 || od.gameTurn > 0) {
      let turn: string;
      turn =
        "Turn - " + (pd.gameTurn <= od.gameTurn ? od.gameTurn : pd.gameTurn);
      setCurrentTurn(turn);
    }
  }, [pd, tabs]);

  useEffect(() => {
    setCurrentTurn("Starting");
  }, [pd.gameTitle]);

  return (
    <React.Fragment>
      <button
        className={"text-white mt-[-41px]"}
        onClick={() => {
          $("#primaryFrame").toggle("blind");
          console.log("Click on Header");
        }}
      >
        CollapseButton
      </button>
      <div
        id="primaryFrame"
        className={`${
          hidden ? "hidden" : ""
        } backdrop-blur-sm bg-black/[.85] w-[250px] h-[400px] overflow-hidden pt-[40px] pb-[20px] border-8 border-double border-gray-300 box-border pb-[44px]`}
      >
        {(activeStatus && baseOnly) || chrome.runtime === undefined ? (
          <React.Fragment>
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
            </div>

            <main className="text-white grid grid-cols-12 mb-[10px] border-t-2">
              <button
                className={`col-span-6 border-box h-full text-xs whitespace-nowrap w-full ${
                  tabs === "Deck" ? null : "border-b-2"
                } ${pinnedTab === "Deck" ? "text-lime-500" : null}`}
                onClick={handleTabClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                name="Deck"
              >
                Deck {pd.entireDeck.length}
                {/* <br></br>
                VP: {pd.currentVP} */}
              </button>
              <button
                className={`col-span-6 border-box h-full text-xs whitespace-nowrap w-full border-l-2 ${
                  tabs === "Opponent" ? null : "border-b-2"
                } ${pinnedTab === "Opponent" ? "text-lime-500" : null}`}
                onClick={handleTabClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                name="Opponent"
              >
                Opponent {od.entireDeck.length}
                {/* <br></br>
                VP: {od.currentVP} */}
              </button>
            </main>
            <Scrollbars
              autoHide={false}
              renderTrackHorizontal={(props) => (
                <div
                  {...props}
                  style={{ display: "none" }}
                  className="track-horizontal"
                />
              )}
              renderThumbVertical={({ style, ...props }) => (
                <main
                  {...props}
                  style={{
                    ...style,
                    backgroundColor: "#e9e9e9",
                    width: "3px",
                    opacity: ".75",
                    height: "30px",
                  }}
                />
              )}
            >
              <div className="p-1 mr-2">
                {tabs === "Deck" && <MainDeckViewer />}
                {tabs === "Discard" && <DiscardZoneViewer />}
                {tabs === "Opponent" && <OpponentViewer />}
                {tabs === "Trash" && <TrashZoneViewer />}

                {/* <button
                  onClick={() => {
                    console.log("hidden is", hidden);
                  }}
                >
                  log hidden
                </button> */}
              </div>
              {/* <div className="text-xs text-white grid grid-cols-12">
                <button
                  className="col-span-6 align-center w-full h-full border-2 whitespace-nowrap"
                  onClick={() => {
                    console.log(pd);
                  }}
                >
                  c.log pDeck
                </button>
                <button
                  className="col-span-6 w-full h-full border-2 whitespace-nowrap"
                  onClick={() => {
                    console.log(od);
                  }}
                >
                  c.log oDeck (Test)
                </button>
              </div> */}
            </Scrollbars>
            <div
              className={`grid grid-cols-12 text-white absolute bottom-0 w-full`}
            >
              <button
                className={`col-span-4  h-full text-xs whitespace-nowrap w-full ${
                  tabs === "Discard" ? null : "border-t-2"
                } ${pinnedTab === "Discard" ? "text-lime-500" : null}`}
                onClick={handleTabClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                name="Discard"
              >
                Discard {pd.graveyard.length}
              </button>
              <button
                className={`col-span-4 border-box h-full text-xs whitespace-nowrap w-full border-l-2 ${
                  tabs === "Trash" ? null : "border-t-2"
                } ${pinnedTab === "Trash" ? "text-lime-500" : null}`}
                onClick={handleTabClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                name="Trash"
              >
                Trash {pd.trash.length}
              </button>
              <button
                className={`col-span-4 border-box h-full text-xs whitespace-nowrap w-full border-l-2 border-t-2`}
                onClick={() => {
                  chrome.runtime.sendMessage({ action: "openOptionsPage" });
                }}
                name="History"
              >
                History
              </button>
            </div>
          </React.Fragment>
        ) : baseOnly ? (
          <div className="text-white">No active game.</div>
        ) : (
          <div className="text-white">
            Only Base Set cards supported. Non-base cards detected in Kingdom{" "}
            {pd.kingdom.map((card) => {
              return <div>{card}</div>;
            })}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default PrimaryFrame;
