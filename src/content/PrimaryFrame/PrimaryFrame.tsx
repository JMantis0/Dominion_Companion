/*global chrome*/
import React, { useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { setViewerHidden } from "../../redux/contentSlice";
import MainDeckViewer from "./MainDeckViewer/MainDeckViewer";
import DiscardZoneViewer from "./DiscardZoneViewer/DiscardZoneViewer";
import TrashZoneViewer from "./TrashZoneViewer/TrashZoneViewer";
import OpponentViewer from "./OpponentViewer/OpponentViewer";
import PrimaryFrameTab from "./PrimaryFrameTab/PrimaryFrameTab";
import PrimaryFrameHeader from "./PrimaryFrameHeader/PrimaryFrameHeader";
import {
  addResizableAndDraggableToPrimaryFrame,
  chromeListenerUseEffectHandler,
  getPrimaryFrameStatus,
} from "../../utils/utils";
import { DOMObserver } from "../../utils/DOMObserver";
import $ from "jquery";
import "jqueryui/jquery-ui.css";
// import DevDisplay from "./DevDisplay/DevDisplay";

const PrimaryFrame = () => {
  const dispatch = useDispatch();
  const od = useSelector((state: RootState) => state.content.opponentDeck);
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const baseOnly = useSelector((state: RootState) => state.content.baseOnly);
  const hidden = useSelector((state: RootState) => state.content.viewerHidden);
  const activeStatus = useSelector(
    (state: RootState) => state.content.gameActiveStatus
  );
  const primaryFrameTab = useSelector(
    (state: RootState) => state.content.primaryFrameTab
  );
  useEffect(() => {
    addEventListener("beforeunload", DOMObserver.saveBeforeUnload);
    DOMObserver.initInterval = setInterval(
      DOMObserver.initIntervalCallback,
      1000
    );
    if (chrome.runtime !== undefined)
      chromeListenerUseEffectHandler(
        "Add",
        dispatch,
        setViewerHidden,
        getPrimaryFrameStatus
      );
    return () => {
      clearInterval(DOMObserver.initInterval);
      clearInterval(DOMObserver.resetInterval);
      removeEventListener("beforeunload", DOMObserver.saveBeforeUnload);
      if (chrome.runtime !== undefined)
        chromeListenerUseEffectHandler(
          "Remove",
          dispatch,
          setViewerHidden,
          getPrimaryFrameStatus
        );
    };
    // The 'hidden' variable is needed in the dependency list, to update the event listener with the new value of hidden.
    // Without this dependency, the event listener will have stale values for the 'hidden' variable
  }, [hidden]);
  useEffect(() => {
    addResizableAndDraggableToPrimaryFrame($);
  }, []);

  const style = "w-[250px] h-[400px]";
  return (
    <React.Fragment>
      <div>
        <button
          className={"text-white mt-[-41px]"}
          onClick={() => {
            $("#primaryFrame").toggle("blind");
            console.log("Click on Header");
          }}
        >
          CollapseButton
        </button>

        <div id="primaryFrame" className={hidden ? "hidden " + style : style}>
          <div
            className={`backdrop-blur-sm bg-black/[.85] h-full w-fill overflow-hidden pt-[40px] pb-[20px] border-8 border-double border-gray-300 box-border pb-[44px]`}
          >
            {(activeStatus && baseOnly) || chrome.runtime === undefined ? (
              <React.Fragment>
                <PrimaryFrameHeader />
                <main className="text-white grid grid-cols-12 mb-[10px] border-t-2">
                  <PrimaryFrameTab
                    title="Deck"
                    count={pd.entireDeck.length}
                    colSpan={6}
                    position="Top"
                  />
                  <PrimaryFrameTab
                    title="Opponent"
                    count={od.entireDeck.length}
                    colSpan={6}
                    position="Top"
                  />
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
                        width: "75%",
                        opacity: ".75",
                        height: "30px",
                      }}
                    />
                  )}
                >
                  <div className="p-1 mr-2">
                    <div  data-testid="deck-viewer" className={primaryFrameTab !== "Deck" ? "hidden" : ""}>
                      <MainDeckViewer />
                      {/* <DevDisplay/> */}
                    </div>
                    <div data-testid="discard-viewer" 
                      className={primaryFrameTab !== "Discard" ? "hidden" : ""}
                    >
                      <DiscardZoneViewer />
                    </div>
                    <div data-testid="opponent-viewer" 
                      className={primaryFrameTab !== "Opponent" ? "hidden" : ""}
                    >
                      <OpponentViewer />
                    </div>
                    <div data-testid="trash-viewer" 
                      className={primaryFrameTab !== "Trash" ? "hidden" : ""}
                    >
                      <TrashZoneViewer />
                    </div>
                  </div>
                </Scrollbars>
                <div
                  className={`grid grid-cols-12 text-white absolute bottom-0 w-full`}
                >
                  <PrimaryFrameTab
                    title="Discard"
                    count={pd.graveyard.length}
                    colSpan={4}
                    position="Bottom"
                  />
                  <PrimaryFrameTab
                    title="Trash"
                    count={pd.trash.length}
                    colSpan={4}
                    position="Bottom"
                  />
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
                Only Base Set cards supported. Non-base cards detected in
                Kingdom{" "}
                {pd.kingdom.map((card) => {
                  return <div>{card}</div>;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PrimaryFrame;
