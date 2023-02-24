import React, { useEffect, useState } from "react";
import CategoryViewer from "./viewers/CategoryViewer";
import $ from "jquery";
import "jquery-ui-bundle/jquery-ui.css";
import SortableViewer from "./viewers/SortableViewer";

const PrimaryFrame = () => {
  const [viewState, setViewState] = useState("main");
  useEffect(() => {
    $("#primaryFrame")
      .draggable()
      .resizable({ autoHide: false, handles: "all" });
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
        {viewState === "main" && <CategoryViewer />}
        {viewState === "sortable" && <SortableViewer />}
      </div>
    </React.Fragment>
  );
};

export default PrimaryFrame;
