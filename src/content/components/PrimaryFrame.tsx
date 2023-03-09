import React, { BaseSyntheticEvent, useEffect, useState } from "react";
import $ from "jquery";
import "jquery-ui-bundle/jquery-ui.css";
import SortableViewer from "./SortableViewer";
import DiscardZoneViewer from "./DiscardZoneViewer";
import { Scrollbars } from "react-custom-scrollbars-2";
import CategoryViewer from "./CategoryViewer";
import HandZoneViewer from "./HandZoneViewer";
import InPlayZoneViewer from "./InPlayZoneViewer";
import TrashZoneViewer from "./TrashZoneViewer";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const PrimaryFrame = () => {
  const [currentTurn, setCurrentTurn] = useState("Turn 1");
  const pd = useSelector((state: RootState) => state.content.playerDeck);
  const [tabs, setTabs] = useState<
    "Deck" | "Game" | "Discard" | "Trash" | "Hand" | "inPlay"
  >("Game");
  useEffect(() => {
    $("#primaryFrame").draggable().resizable({ handles: "all" });
  }, []);

  const handleTabChange = (e: BaseSyntheticEvent) => {
    console.log(e.target.name);
    const tabName = e.target.name;
    setTabs(tabName);
  };

  useEffect(() => {
    for (let i = pd.logArchive.length - 1; i >= 0; i--) {
      if (pd.logArchive[i].match("Turn ") !== null) {
        setCurrentTurn(pd.logArchive[i].slice(0, 10).trim());
        break;
      }
    }
  }, [pd, tabs]);

  return (
    <React.Fragment>
      <div
        id="primaryFrame"
        className="bg-black/[.85] w-[200px] h-[200px] overflow-hidden pt-[40px] pb-[20px] border-8 border-double border-gray-300 box-border pb-[44px]"
      >
        <div className="mt-[-44px] text-white grid grid-cols-12">
          <div className={`col-span-4 whitespace-nowrap`}>{currentTurn}</div>{" "}
          <div className={`cols-span-4 whitespace-nowrap`}>
            <button
              onClick={() => {
                console.log(pd);
              }}
              className="border-2 whitespace-nowrap"
            >
              c.log deck
            </button>
          </div>
          <div className="cols-span-3"></div>
          <div className="cols-span-1">
            <img src="../..assets.domx.jpg" />
          </div>
        </div>
        <main className="text-white grid grid-cols-12 mb-[10px] border-t-2">
          <div className="col-span-4">
            <button
              className={`h-full text-xs whitespace-nowrap w-full ${
                tabs === "Game" ? "text-lime-500" : "border-b-2"
              }`}
              onClick={handleTabChange}
              name="Game"
            >
              Game {pd.library.length}
            </button>
          </div>
          <div className="col-span-4">
            <button
              className={`h-full text-xs whitespace-nowrap w-full border-l-2 ${
                tabs === "Discard" ? "text-lime-500" : "border-b-2"
              }`}
              onClick={handleTabChange}
              name="Discard"
            >
              Discard {pd.graveyard.length}
            </button>
          </div>
          <div className="col-span-4">
            <button
              className={`h-full text-xs whitespace-nowrap w-full border-l-2 ${
                tabs === "Deck" ? "text-lime-500" : "border-b-2"
              }`}
              onClick={handleTabChange}
              name="Deck"
            >
              Deck {pd.entireDeck.length}
            </button>
          </div>
        </main>
        <Scrollbars
          autoHide={false}
          thumbMinSize={30}
          renderThumbVertical={({ style, ...props }) => (
            <main
              {...props}
              style={{
                ...style,
                backgroundColor: "#e9e9e9",
                width: "3px",
                opacity: ".75",
                height: "30px",
              }}
            />
          )}
        >
          <div className="p-1 mr-2">
            {tabs === "Game" && <SortableViewer />}
            {tabs === "Discard" && <DiscardZoneViewer />}
            {tabs === "Deck" && <CategoryViewer />}
            {tabs === "Hand" && <HandZoneViewer />}
            {tabs === "inPlay" && <InPlayZoneViewer />}
            {tabs === "Trash" && <TrashZoneViewer />}
          </div>
        </Scrollbars>
        <div
          className={`grid grid-cols-12 text-white absolute bottom-0 w-full`}
        >
          <div className="col-span-4">
            <button
              className={`h-full text-xs whitespace-nowrap w-full ${
                tabs === "Hand" ? "text-lime-500" : "border-t-2"
              }`}
              onClick={handleTabChange}
              name="Hand"
            >
              Hand {pd.hand.length}
            </button>
          </div>
          <div className="col-span-4">
            <button
              className={`h-full text-xs whitespace-nowrap w-full border-l-2 ${
                tabs === "inPlay" ? "text-lime-500" : "border-t-2"
              }`}
              onClick={handleTabChange}
              name="inPlay"
            >
              In Play {pd.inPlay.length}
            </button>
          </div>
          <div className="col-span-4">
            <button
              className={`h-full text-xs whitespace-nowrap w-full border-l-2 ${
                tabs === "Trash" ? "text-lime-500" : "border-t-2"
              }`}
              onClick={handleTabChange}
              name="Trash"
            >
              Trash {pd.trash.length}
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default PrimaryFrame;
