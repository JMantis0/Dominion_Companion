import React from "react";

import HandView from "./HandView";
import DiscardFrame from "./DiscardFrame";
import DecklistView from "./DecklistView";
import LibraryView from "./LibraryView";
import TrashView from "./TrashView";
import InPlayView from "./InPlayView";

const CurrentGame = () => {
  return (
    <React.Fragment>
      {/* <DecklistView /> */}
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
