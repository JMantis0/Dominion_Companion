import React, { useCallback, useState } from "react";
import { sendTurnOffRequest, sendTurnOnRequest, useContentViewerStatus } from "../utils/utils";

const Popup = () => {
  const [toggleState, setToggleState] = useState<"ON" | "OFF">("OFF");

  const contentViewerStatusCallback = useCallback(
    (viewerState: "ON" | "OFF") => {
      setToggleState(viewerState);
    },
    []
  );

  useContentViewerStatus(contentViewerStatusCallback);

  return (
    <React.Fragment>
      <div className="grid grid-cols-12 gap-4 w-[400px] h-[300px] border-2 backdrop-blur-sm bg-black/[.85] text-white">
        <div className="col-span-6">
          <div>
            Thank you for using the Dominion Companion. This extension is
            designed help players make informed game decisions.{" "}
          </div>
          <br></br>
          <div>
            The Viewer is draggable and resizable, so position it as you desire.
            It can also be turned on an off here. A 'How to use' guide can be
            found here:
          </div>
        </div>
        <div className="col-span-6 grid grid-cols-12">
          <h2 className={`col-span-12 text-center m-auto text-xs`}>
            Dominion Companion
          </h2>
          <div className="col-span-2"></div>
          <button
            className={`col-span-8 border-2  ${
              toggleState === "OFF" ? "bg-green-900" : "bg-green-600"
            }`}
            onClick={() => sendTurnOnRequest(setToggleState)}
          >
            ON
          </button>
          <div className="col-span-2"></div>
          <div className="col-span-2"></div>
          <button
            className={`border-2 col-span-8 ${
              toggleState === "ON" ? "bg-red-900" : "bg-red-600"
            }`}
            onClick={() => sendTurnOffRequest(setToggleState)}
          >
            OFF
          </button>
          <div className="col-span-2"></div>
        </div>
      </div>
      <button
        onClick={() => {
          chrome.runtime.sendMessage({ action: "openOptionsPage" });
        }}
      >
        History
      </button>
    </React.Fragment>
  );
};

export default Popup;
