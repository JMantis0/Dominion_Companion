import React, { useEffect } from "react";
import $ from "jquery";
import "jquery-ui-bundle/jquery-ui.css";
import CategoryViewer from "./viewers/CategoryViewer";
import SortableViewer from "./viewers/SortableViewer";
import DiscardZoneViewer from "./viewers/DiscardZoneViewer";
import { Tabs } from "flowbite-react";

const PrimaryFrame = () => {
  useEffect(() => {
    $("#primaryFrame")
      .draggable()
      .resizable({ autoHide: false, handles: "all" });
  }, []);

  return (
    <React.Fragment>
      <div id="primaryFrame">
        <Tabs.Group aria-label="Full width tabs" style="fullWidth">
          <Tabs.Item title="Category Viewer">
            <CategoryViewer />
          </Tabs.Item>
          <Tabs.Item title="Sortable Viewer">
            <SortableViewer />
          </Tabs.Item>
          <Tabs.Item title="Discard">
            <DiscardZoneViewer />
          </Tabs.Item>
        </Tabs.Group>
      </div>
    </React.Fragment>
  );
};

export default PrimaryFrame;
