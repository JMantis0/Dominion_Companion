import React, { FunctionComponent } from "react";
import { Provider } from "react-redux";
import { Deck } from "../model/deck";
import { store } from "../redux/store";
import DiscardHover from "./components/DiscardHover";
import LibraryHover from "./components/LibraryHover";
import PrimaryFrame from "./components/PrimaryFrame";
import LogObserver from "./components/LogObserver";

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
    <div id="domRoot">
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
