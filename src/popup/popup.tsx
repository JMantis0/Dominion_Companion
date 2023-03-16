import React, { useEffect, useState } from "react";

const Popup = () => {
  const [toggleState, setToggleState] = useState<"ON" | "OFF" | "Unassigned">(
    "Unassigned"
  );

  const handleToggleOn = () => {
    console.log("Toggling ON");
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
        const response = await chrome.tabs.sendMessage(tab.id!, {
          command: "appendDomRoot",
        });
        // do something with response here, not outside the function
        console.log(response);
        if (response.message === "Successfully turned on.") {
          setToggleState("ON");
        } else {
          console.log("There was an error");
        }
      } else {
        console.log("Invalid tab selected");
      }
    })();
  };

  const handleToggleOff = () => {
    console.log("Toggling OFF");
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
        const response = await chrome.tabs.sendMessage(tab.id!, {
          command: "removeDomRoot",
        });
        // do something with response here, not outside the function
        console.log(response);
        if (response.message === "Successfully turned off.") {
          setToggleState("OFF");
        } else {
          console.log("There was an error");
        }
      } else {
        console.log("Invalid tab selected");
      }
    })();
  };

  useEffect(() => {
    console.log("UseEffect in the popup");
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
        // do something with response here, not outside the function
        console.log(response);
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
      <div className="grid grid-cols-12 grid-rows-4 gap-4 w-[200px] h-[300px] border-2 backdrop-blur-sm bg-black/[.85] text-white">
        <h2 className={`col-span-12 text-center m-auto`}>Dom-View</h2>
        <div className="col-span-2"></div>
        <button
          className={`col-span-8 border-2  ${
            ["OFF", "Unassigned"].includes(toggleState)
              ? "bg-green-900"
              : "bg-green-600"
          }`}
          onClick={handleToggleOn}
        >
          ON
        </button>
        <div className="col-span-2"></div>
        <div className="col-span-2"></div>
        <button
          className={`border-2 col-span-8 ${
            ["ON", "Unassigned"].includes(toggleState)
              ? "bg-red-900"
              : "bg-red-600"
          }`}
          onClick={handleToggleOff}
        >
          OFF
        </button>
        <div className="col-span-2"></div>
      </div>
    </React.Fragment>
  );
};

export default Popup;
