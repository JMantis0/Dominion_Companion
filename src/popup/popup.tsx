import React, { useEffect, useState } from "react";

const Popup = () => {
  const [toggleState, setToggleState] = useState<"ON" | "OFF">("OFF");

  const handleToggleOn = () => {
    // Append the domRoot to client
    (async () => {
      let tab: chrome.tabs.Tab | undefined = undefined;
      try {
        [tab] = await chrome.tabs.query({
          active: true,
          lastFocusedWindow: true,
        });
      } catch (e) {
        console.log("There was an error: ", e);
      }
      if (tab !== undefined) {
        console.log(tab);
        const response = await chrome.tabs.sendMessage(tab.id!, {
          command: "appendDomRoot",
        });
        if (response.message === "Successfully turned on.") {
          setToggleState("ON");
        } else {
          console.log("There was an error");
        }
      }
    })();
  };

  const handleToggleOff = () => {
    // Remove domRoot from client
    (async () => {
      let tab: chrome.tabs.Tab | undefined = undefined;
      try {
        [tab] = await chrome.tabs.query({
          active: true,
          lastFocusedWindow: true,
        });
      } catch (e) {
        console.log("There was an error: ", e);
      }
      if (tab !== undefined) {
        console.log(tab);

        const response = await chrome.tabs.sendMessage(tab.id!, {
          command: "removeDomRoot",
        });
        if (response.message === "Successfully turned off.") {
          setToggleState("OFF");
        } else {
          console.log("There was an error");
        }
      }
    })();
  };

  useEffect(() => {
    (async () => {
      let tab: chrome.tabs.Tab | undefined = undefined;
      try {
        [tab] = await chrome.tabs.query({
          active: true,
          lastFocusedWindow: true,
        });
      } catch (e) {
        console.log("There was an error: ", e);
      }
      if (tab !== undefined) {
        console.log(tab);
        const response = await chrome.tabs.sendMessage(tab.id!, {
          command: "sendHiddenState",
        });
        console.log("response from content", response);
        if (response.message === "Hidden state is ON") {
          setToggleState("OFF");
        } else if (response.message === "Hidden state is OFF") {
          setToggleState("ON");
        } else {
          console.log("There was an error");
        }
      } else {
        console.log("Invalid tab selected");
      }
    })();
  }, []);

  return (
    <React.Fragment>
      <div className="grid grid-cols-12 grid-rows-4 gap-4 w-[400px] h-[300px] border-2 backdrop-blur-sm bg-black/[.85] text-white">
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
            onClick={handleToggleOn}
          >
            ON
          </button>
          <div className="col-span-2"></div>
          <div className="col-span-2"></div>
          <button
            className={`border-2 col-span-8 ${
              toggleState === "ON" ? "bg-red-900" : "bg-red-600"
            }`}
            onClick={handleToggleOff}
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
      {/* <button
        onClick={() => {
          (async () => {
            let tab: chrome.tabs.Tab | undefined = undefined;
            try {
              [tab] = await chrome.tabs.query({
                active: true,
                lastFocusedWindow: true,
              });
            } catch (e) {
              console.log("There was an error: ", e);
            }
            if (tab !== undefined) {
              const response = await chrome.tabs.sendMessage(tab.id!, {
                command: "sendHiddenState",
              });
              if (response.message === "Hidden state is ON") {
                setToggleState("OFF");
              } else if (response.message === "Hidden state is OFF") {
                setToggleState("ON");
              } else {
                console.log("There was an error");
              }
            } else {
              console.log("Invalid tab selected");
            }
          })();
        }}
      >
        Get hidden state
      </button> */}
    </React.Fragment>
  );
};

export default Popup;
