import React, { FunctionComponent } from "react";
import { Provider } from "react-redux";
import { Deck } from "../model/deck";
import { store } from "../redux/store";
import DiscardHover from "./components/hoverzones/DiscardHover";
import LibraryHover from "./components/hoverzones/LibraryHover";
import PrimaryFrame from "./components/PrimaryFrame";
import LogObserver from "./components/LogObserver";
import "../assets/tailwind.css"

import "jqueryui";
export type ContentProps = {
  playerName: string;
  opponentName: string;
  decks: Map<string, Deck>;
  gameLog: string; //game log
  logsProcessed: string; //logs processed
};

const DomRoot: FunctionComponent<ContentProps> = ({
  playerName,
  opponentName,
  decks,
  gameLog,
  logsProcessed,
}) => {
  return (
    <div id="domRoot" className="-z-100 relative h-[0px] w-[0px]">
      <Provider store={store}>
        <LogObserver
          playerName={playerName}
          opponentName={opponentName}
          decks={decks}
          gameLog={gameLog}
          logsProcessed={logsProcessed}
        />
        <DiscardHover />
        <LibraryHover />
        <PrimaryFrame />
      </Provider>
    </div>
  );
};

export default DomRoot;
