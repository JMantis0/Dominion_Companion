import React from "react";
import HandView from "./HandView";
import DiscardFrame from "./DiscardView";
import LibraryView from "./LibraryView";
import TrashView from "./TrashView";
import InPlayView from "./InPlayView";

const CurrentGame = () => {
  return (
    <React.Fragment>
      <HandView />
      <br></br>
      <LibraryView />
      <br></br>
      <InPlayView />
      <br></br>
      <DiscardFrame />
      <br></br>
      <TrashView />
    </React.Fragment>
  );
};

export default CurrentGame;
