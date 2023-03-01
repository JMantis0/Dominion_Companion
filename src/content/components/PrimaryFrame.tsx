import React, { BaseSyntheticEvent, useEffect, useState } from "react";
import $ from "jquery";
import "jquery-ui-bundle/jquery-ui.css";
import CategoryViewer from "./viewers/CategoryViewer";
import SortableViewer from "./viewers/SortableViewer";
// import DiscardZoneViewer from "./viewers/DiscardZoneViewer";
// import { Tabs } from "flowbite-react";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
// import HandZoneViewer from "./viewers/HandZoneViewer";
// import InPlayZoneViewer from "./viewers/InPlayZoneViewer";

const PrimaryFrame = () => {
  // const pd = useSelector((state: RootState) => state.content.playerDeck);
  const [tabs, setTabs] = useState<"Game" | "Deck">("Game");
  useEffect(() => {
    $("#primaryFrame")
      .draggable()
      .resizable({ autoHide: false, handles: "all" });
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
      <div id="primaryFrame" className="bg-black/[.85] w-64 h-48">
        <div className="text-white text-sm grid grid-cols-12">
          <div className="col-span-4">TOP DIV</div>
          <div className="col-span-4">
            <button
              className="w-full outline hover:outline-2 focus:ring"
              onClick={handleTabChange}
              name="Game"
            >
              Game view
            </button>
          </div>
          <div className="col-span-4">
            <button
              className="w-full outline hover:outline-2 focus:ring"
              onClick={handleTabChange}
              name="Deck"
            >
              Deck View
            </button>
          </div>
        </div>
        <div className="p-1">
          {tabs === "Game" && <SortableViewer />}
          {tabs === "Deck" && <CategoryViewer />}
        </div>

        {/* <Tabs.Group aria-label="Default tabs" style={"default"}>
          <Tabs.Item title={`Discard: ${pd.graveyard.length}`}>
            <DiscardZoneViewer />
          </Tabs.Item>
          <Tabs.Item title={`Hand: ${pd.hand.length}`}>
            <HandZoneViewer />
          </Tabs.Item>
          <Tabs.Item title={`In Play: ${pd.inPlay.length}`}>
            <InPlayZoneViewer />
          </Tabs.Item>
        </Tabs.Group> */}
      </div>
    </React.Fragment>
  );
};

export default PrimaryFrame;