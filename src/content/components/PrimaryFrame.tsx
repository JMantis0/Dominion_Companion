import React, { useEffect, useState } from "react";
import DecklistView from "./DecklistView";
import $ from "jquery";
import "jquery-ui-bundle/jquery-ui.css";
import SortableView from "./SortableView";

// import DecklistView from "../../options/components/DecklistView";

const PrimaryFrame = () => {
  const [viewState, setViewState] = useState("main");
  useEffect(() => {
    $("#primaryFrame").draggable().resizable();
  }, []);

  return (
    <React.Fragment>
      <div id="primaryFrame">
        <span>
          <a onClick={() => setViewState("main")}>Main View</a>
        </span>
        <span>
          <a onClick={() => setViewState("sortable")}>Sortable View</a>
        </span>
        {viewState === "main" && <DecklistView />}
        {viewState === "sortable" && <SortableView />}
      </div>
    </React.Fragment>
  );
};

export default PrimaryFrame;
