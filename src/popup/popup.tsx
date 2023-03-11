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
      <div className="h-screen">Popup</div>
      <button onClick={handleToggleOn}>Click To ADD Viewer</button>
      <button onClick={handleToggleOff}>Click To Remove Viewer</button>
      <button
        onClick={async () => {
          const [tab] = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
          });
          console.log(tab);
        }}
      >
        Log current tab
      </button>
    </React.Fragment>
  );
};

export default Popup;
