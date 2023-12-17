/*global chrome*/
import React, { UIEvent, useEffect, useRef, useState } from "react";
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
  useMinimizer,
  usePopupChromeMessageListener,
  getNonBaseCardsInKingdom,
  stringifiedEqualityFunction,
  useSavedScrollPositions,
} from "../../utils/utils";
import { DOMObserver } from "../../utils/DOMObserver";
import "jqueryui/jquery-ui.css";
import MinimizeButton from "./MinimizeButton/MinimizeButton";
// import DevDisplay from "./DevDisplay/DevDisplay";

const style = "w-[250px] h-[400px]";
const hiddenStyle = style + " hidden";
const minimizedStyle = "w-[250px] h-[0px]";
const collapsibleStyle =
  "backdrop-blur-sm bg-black/[.85] object-contain pb-[65px] w-fill overflow-hidden border-8 border-double border-gray-300 box-border h-full";

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
  const opponentDeckData = useSelector((state: RootState) => {
    return {
      numberOfOpponents: state.content.opponentDecks.length,
      singleOpponentDeckSize: state.content.opponentDecks[0].entireDeck.length,
    };
  }, stringifiedEqualityFunction);
  const pdEntireDeckLength = useSelector(
    (state: RootState) => state.content.playerDeck.entireDeck.length
  );
  const pdTrashLength = useSelector(
    (state: RootState) => state.content.playerDeck.trash.length
  );
  const pdDiscardLength = useSelector(
    (state: RootState) => state.content.playerDeck.graveyard.length
  );
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
  const [scrollPosition, setScrollPosition] = useState<{
    deck: number;
    opponent: number;
    discard: number;
    trash: number;
  }>({ deck: 0, opponent: 0, discard: 0, trash: 0 });
  const [primaryFrameElement, setPrimaryFrameElement] =
    useState<HTMLElement | null>(null);
  const scrollRef = useRef<Scrollbars>(null);
  useSaveGameBeforeUnloadListener();
  usePopupChromeMessageListener([hidden]);
  useJQueryDraggable(primaryFrameElement);
  useJQueryResizable(primaryFrameElement, primaryFrameResizableHandles());
  useMinimizer(primaryFrameElement);
  useSavedScrollPositions(scrollRef.current, scrollPosition, primaryFrameTab);
  return (
    <React.Fragment>
      <div
        id="primaryFrame"
        ref={setPrimaryFrameElement}
        className={hidden ? hiddenStyle : minimized ? minimizedStyle : style}
      >
        <MinimizeButton />
        <div
          id="collapsible"
          className={minimized ? "hidden" : collapsibleStyle}
        >
          <PrimaryFrameHeader />
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
                  count={pdEntireDeckLength}
                  colSpan={6}
                  position="Top"
                />
                <PrimaryFrameTab
                  title={
                    opponentDeckData.numberOfOpponents === 1
                      ? "Opponent"
                      : "Opponents"
                  }
                  count={
                    opponentDeckData.numberOfOpponents === 1
                      ? opponentDeckData.singleOpponentDeckSize
                      : opponentDeckData.numberOfOpponents
                  }
                  colSpan={6}
                  position="Top"
                />
              </main>
              <Scrollbars
                ref={scrollRef}
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
                onScroll={(e: UIEvent) => {
                  const element = e.target as HTMLElement;
                  const selectScrollPosition = element.scrollTop;
                  let computedKey = primaryFrameTab.toLowerCase();
                  if (computedKey === "opponents") computedKey = "opponent";
                  setScrollPosition({
                    ...scrollPosition,
                    [computedKey]: selectScrollPosition,
                  });
                }}
              >
                <div className="p-1 mr-2">
                  <div className={primaryFrameTab !== "Deck" ? "hidden" : ""}>
                    <MainDeckViewer />
                    {/* <DevDisplay />*/}
                  </div>
                  <div
                    className={primaryFrameTab !== "Discard" ? "hidden" : ""}
                  >
                    <DiscardZoneViewer />
                  </div>
                  <div
                    className={
                      primaryFrameTab.match(/Opponents?/) === null
                        ? "hidden"
                        : ""
                    }
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
                  count={pdDiscardLength}
                  colSpan={4}
                  position="Bottom"
                />
                <PrimaryFrameTab
                  title="Trash"
                  count={pdTrashLength}
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
