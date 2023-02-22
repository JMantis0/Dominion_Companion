import React, { useEffect } from "react";
import DecklistView from "./DecklistView";
import $ from "jquery";
// import "jqueryui";
// import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.css';

// import DecklistView from "../../options/components/DecklistView";

const PrimaryFrame = () => {
  useEffect(() => {
    $("#primaryFrame").draggable().resizable();
    console.log("ok")
  }, []);

  return (
    <React.Fragment>
      <div id="primaryFrame">
          <DecklistView />
        </div>
    </React.Fragment>
  );
};

export default PrimaryFrame;
