/*global chrome*/
import React, { useEffect } from "react";
import "jquery-ui-bundle/jquery-ui.css";
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
import { addResizableAndDraggableToPrimaryFrame, chromeListenerUseEffectHandler } from "../../utils/utils";


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
    if (chrome.runtime !== undefined)
      chromeListenerUseEffectHandler("Add", hidden, dispatch, setViewerHidden);
    return () => {
      if (chrome.runtime !== undefined)
        chromeListenerUseEffectHandler(
          "Remove",
          hidden,
          dispatch,
          setViewerHidden
        );
    };
    // The 'hidden' variable is needed in the dependency list, to update the event listener with the new value of hidden.
    // Without this dependency, the event listener will have stale values for the 'hidden' variable
  }, [hidden]);
  useEffect(() => {
    addResizableAndDraggableToPrimaryFrame();
  }, []);

  return (
    <React.Fragment>
      <div
        id="primaryFrame"
        className={`${
          hidden ? "hidden" : ""
        } backdrop-blur-sm bg-black/[.85] w-[250px] h-[400px] overflow-hidden pt-[40px] pb-[20px] border-8 border-double border-gray-300 box-border pb-[44px]`}
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
                <div className={primaryFrameTab !== "Deck" ? "hidden" : ""}>
                  <MainDeckViewer />
                </div>
                <div className={primaryFrameTab !== "Discard" ? "hidden" : ""}>
                  <DiscardZoneViewer />
                </div>
                <div className={primaryFrameTab !== "Opponent" ? "hidden" : ""}>
                  <OpponentViewer />
                </div>
                <div className={primaryFrameTab !== "Trash" ? "hidden" : ""}>
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
