import React, { BaseSyntheticEvent, useEffect, useState } from "react";
import $ from "jquery";
import "jquery-ui-bundle/jquery-ui.css";
import CategoryViewer from "./viewers/CategoryViewer";
import SortableViewer from "./viewers/SortableViewer";
import DiscardZoneViewer from "./viewers/DiscardZoneViewer";
import { Scrollbars } from "react-custom-scrollbars-2";

const PrimaryFrame = () => {
  const [tabs, setTabs] = useState<"Game" | "Deck" | "Discard">("Game");
  useEffect(() => {
    $("#primaryFrame").draggable().resizable({ handles: "all" });
  }, []);

  const handleTabChange = (e: BaseSyntheticEvent) => {
    console.log(e.target.name);
    const tabName = e.target.name;
    setTabs(tabName);
  };

  useEffect(() => {
    console.log("Tabs changed, maybe I need to trigger a render here");
  }, [tabs]);

  return (
    <React.Fragment>
      <div
        id="primaryFrame"
        className="bg-black/[.85] w-[180px] h-[200px] overflow-hidden pt-[40px]"
      >
        <div className="text-white text-sm grid grid-cols-12 mt-[-40px]">
          <div className="col-span-6">
            <button
              className={`w-full ${
                tabs === "Discard" ? "border-b-2" : "text-lime-500"
              }`}
              onClick={handleTabChange}
              name="Game"
            >
              Deck
            </button>
          </div>
          <div className="col-span-6">
            <button
              className={`w-full border-l-2 ${
                tabs === "Game" ? "border-b-2" : "text-lime-500"
              }`}
              onClick={handleTabChange}
              name="Discard"
            >
              Discard Pile
            </button>
          </div>
        </div>
        <Scrollbars
          renderThumbVertical={({ style, ...props }) => (
            <div
              {...props}
              style={{
                ...style,
                backgroundColor: "#e9e9e9",
                width: "3px",
                opacity: ".75",
              }}
            />
          )}
        >
          <div className="p-1 pt-[15px] mr-2 overflow-hidden">
            {tabs === "Game" && <SortableViewer />}
            {tabs === "Discard" && <DiscardZoneViewer />}
          </div>
        </Scrollbars>
      </div>
    </React.Fragment>
  );
};

export default PrimaryFrame;
