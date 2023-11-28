/*global chrome*/
import React, { useEffect, useRef, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { useSelector } from "react-redux";
import { RootState, store } from "../../redux/store";
import MainDeckViewer from "./MainDeckViewer/MainDeckViewer";
import DiscardZoneViewer from "./DiscardZoneViewer/DiscardZoneViewer";
import TrashZoneViewer from "./TrashZoneViewer/TrashZoneViewer";
import OpponentViewer from "./OpponentViewer/OpponentViewer";
import PrimaryFrameTab from "./PrimaryFrameTab/PrimaryFrameTab";
import PrimaryFrameHeader from "./PrimaryFrameHeader/PrimaryFrameHeader";
import {
  primaryFrameResizableHandles,
  useJQueryDraggable,
  useJQueryResizable,
  useElementHeight,
  useMinimizer,
  usePopupChromeMessageListener,
  useHeightDifferentBetweenContainerAndContainedElement,
  getNonBaseCardsInKingdom,
} from "../../utils/utils";
import { DOMObserver } from "../../utils/DOMObserver";
import "jqueryui/jquery-ui.css";
// import DevDisplay from "./DevDisplay/DevDisplay";

const style = "w-[250px] h-[400px]";
const hiddenStyle = style + " hidden";
const minimizedStyle = "w-[250px] h-[0px]";
const collapsibleStyle =
  "backdrop-blur-sm bg-black/[.85] object-contain pb-[55px] w-fill overflow-hidden border-b-8 border-x-8 border-double border-gray-300 box-border";
const minimizedCollapsibleStyle = collapsibleStyle + " hidden";

const useSaveGameBeforeUnloadListener = () => {
  const viewerHidden = store.getState().content.viewerHidden;
  useEffect(() => {
    addEventListener("beforeunload", DOMObserver.saveBeforeUnload);
    return () => {
      removeEventListener("beforeunload", DOMObserver.saveBeforeUnload);
    };
  }, [viewerHidden]);
};

const PrimaryFrame = () => {
  const ods = useSelector((state: RootState) => state.content.opponentDecks);
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const baseOnly = useSelector((state: RootState) => state.content.baseOnly);
  const hidden = useSelector((state: RootState) => state.content.viewerHidden);
  const activeStatus = useSelector(
    (state: RootState) => state.content.gameActiveStatus
  );
  const primaryFrameTab = useSelector(
    (state: RootState) => state.content.primaryFrameTab
  );
  const error = useSelector((state: RootState) => state.content.error);
  const minimized = useSelector((state: RootState) => state.content.minimized);
  const [calculatedCollapsibleHeight, setCalculatedCollapsibleHeight] =
    useState<number>(0);
  const [primaryFrameHeight, setPrimaryFrameHeight] = useState<number>(0);
  const primaryFrameRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  useHeightDifferentBetweenContainerAndContainedElement(
    primaryFrameRef.current, // Container
    headerRef.current, // Controlled Element
    setCalculatedCollapsibleHeight, // controlledElementHeightSetter
    primaryFrameHeight, // dependency to detect height changes
    [minimized, baseOnly, activeStatus] // dependency to check
  );
  useSaveGameBeforeUnloadListener();
  usePopupChromeMessageListener([hidden]);
  useElementHeight(primaryFrameRef.current, setPrimaryFrameHeight);
  useJQueryDraggable(primaryFrameRef.current);
  useJQueryResizable(primaryFrameRef.current, primaryFrameResizableHandles());
  useMinimizer(primaryFrameRef.current);
  return (
    <React.Fragment>
      <div
        id="primaryFrame"
        ref={primaryFrameRef}
        className={hidden ? hiddenStyle : minimized ? minimizedStyle : style}
      >
        <div id="headerRef" ref={headerRef}>
          <PrimaryFrameHeader />
        </div>
        <div
          id="collapsible"
          style={{ height: minimized ? "0" : calculatedCollapsibleHeight }}
          className={minimized ? minimizedCollapsibleStyle : collapsibleStyle}
        >
          {activeStatus && baseOnly ? (
            <React.Fragment>
              <div
                className={
                  error !== null
                    ? "text-white text-xs bg-red-800 m-auto grid place-items-center"
                    : "hidden"
                }
              >
                {error}
                <br></br>
                <button
                  className={
                    "animate-bounce border-2 border-black bg-gray-600 rounded-md w-1/4 m-auto"
                  }
                  onClick={() => {
                    DOMObserver.restartDOMObserver();
                  }}
                >
                  Fix
                </button>
              </div>
              <main className="text-white grid grid-cols-12 mb-[10px] border-t-2">
                <PrimaryFrameTab
                  title="Deck"
                  count={pd.entireDeck.length}
                  colSpan={6}
                  position="Top"
                />
                <PrimaryFrameTab
                  title="Opponent"
                  count={ods[0].entireDeck.length}
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
                  <div className={primaryFrameTab !== "Deck" ? "hidden" : ""}>
                    <MainDeckViewer />
                    {/* <DevDisplay/> */}
                  </div>
                  <div
                    className={primaryFrameTab !== "Discard" ? "hidden" : ""}
                  >
                    <DiscardZoneViewer />
                  </div>
                  <div
                    className={primaryFrameTab !== "Opponent" ? "hidden" : ""}
                  >
                    <OpponentViewer />
                  </div>
                  <div className={primaryFrameTab !== "Trash" ? "hidden" : ""}>
                    <TrashZoneViewer />
                  </div>
                </div>
              </Scrollbars>
              <div
                className={
                  "grid grid-cols-12 text-white absolute bottom-0 w-full"
                }
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
                  className={
                    "col-span-4 border-box h-full text-xs whitespace-nowrap w-full border-l-2 border-t-2"
                  }
                  onClick={() => {
                    chrome.runtime.sendMessage({ action: "openOptionsPage" });
                  }}
                  name="History"
                >
                  History
                </button>
              </div>
            </React.Fragment>
          ) : (
            <main className="text-white text-xs pointer-events-none text-center m-auto border-t-4 border-color-white">
              {getNonBaseCardsInKingdom(DOMObserver.kingdom).map(
                (card, idx) => {
                  return <div key={idx}>{card}</div>;
                }
              )}
            </main>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default PrimaryFrame;
