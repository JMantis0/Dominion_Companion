import React, { FunctionComponent } from "react";
import { Provider } from "react-redux";
import { Deck } from "../model/deck";
import { store } from "../redux/store";
import PrimaryFrame from "./components/PrimaryFrame";
import LogObserver from "./components/LogObserver";
import "../assets/tailwind.css";
import "jqueryui";
import { OpponentDeck } from "../model/opponentDeck";

/**
 * ContentProps are the global values passed from the content script at the time
 * that the DomRoot is attached to the Client Dom.
 */
export type ContentProps = {
  playerName: string;
  opponentName: string;
  decks: Map<string, Deck | OpponentDeck>;
  gameLog: string;
};

/**
 * The root component that is rendered to the client DOM.
 * Props are the values passed from the content script.
 */
const DomRoot: FunctionComponent<ContentProps> = ({
  playerName,
  opponentName,
  decks,
  gameLog,
}) => {
  return (
    <div id="domRoot" className="-z-100 relative h-[0px] w-[0px]">
      <Provider store={store}>
        <LogObserver
          playerName={playerName}
          opponentName={opponentName}
          decks={decks}
          gameLog={gameLog}
        />
        <PrimaryFrame />
      </Provider>
    </div>
  );
};

export default DomRoot;
