import React, { useRef } from "react";
import "../assets/tailwind.css";

const Popup = () => {
  let toggleRef = useRef<boolean>(false);

  const handleToggleOn = () => {
    console.log("Toggling ON");
    // Append the domRoot to client
    (async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      const response = await chrome.tabs.sendMessage(tab.id!, {
        command: "appendDomRoot",
      });
      // do something with response here, not outside the function
      console.log(response);
    })();

    toggleRef.current = true;
  };
  const handleToggleOff = () => {
    console.log("Toggling OFF");

    // Remove domRoot from client
    (async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      const response = await chrome.tabs.sendMessage(tab.id!, {
        command: "removeDomRoot",
      });
      // do something with response here, not outside the function
      console.log(response);
    })();

    toggleRef.current = false;
  };

  return (
    <React.Fragment>
    <div className="grid grid-cols-12 grid-rows-4 gap-4 w-[200px] h-[300px] border-2">
      <h2 className={`col-span-12 text-center m-auto`}>Dom-View</h2>
      <div className="col-span-2"></div>
      <button className={`col-span-8 border-2`} onClick={handleToggleOn}>
        ON
      </button>
      <div className="col-span-2"></div>
      <div className="col-span-2"></div>
      <button className={`border-2 col-span-8`} onClick={handleToggleOff}>
        OFF
      </button>
      <div className="col-span-2"></div>
    </div>
  </React.Fragment>
  );
};

export default Popup;
