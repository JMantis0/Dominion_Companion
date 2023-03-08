import React from "react";
import $ from "jquery";
import { createRoot, Root } from "react-dom/client";
import { Deck } from "../model/deck";
import {
  isGameLogPresent,
  getGameLog,
  arePlayerInfoElementsPresent,
  getPlayerInfoElements,
  getPlayerAndOpponentNameByComparingElementPosition,
  getPlayerNameAbbreviations,
  isKingdomElementPresent,
  getKingdom,
  createPlayerDecks,
} from "./contentScriptFunctions";

import DomRoot from "./DomRoot";

/**
 * Content global variable - Stores the value of the player name.
 * Use - invoking Deck object constructor
 */
let playerName: string = "";

/**
 * Content global variable - Stores the value of the player's abbreviated name used in the client ".game-log" element.
 * Use - invoking Deck object constructor
 */
let playerNick: string = "";

/**
 * Content global variable - Stores the value of the opponent name.
 * Use - invoking Deck object constructor
 */
let opponentName: string = "";

/**
 * Content global variable - Stores the value of the opponent's abbreviated name used in the client ".game-log" element.
 * Use - invoking Deck object constructor
 */
let opponentNick: string = "";

/**
 * Content global variable -
 * Use - Control flow for the content script.
 * False value means the 'gameLog' global is not yet initialized.
 * True value means the 'gameLog' global holds a value collected from the ".game-log" element in the client).
 */
let logInitialized: boolean = false;

/**
 * Content global variable -
 * Use - Control flow for the content script.
 * False value means the 'kingdom' global is not yet initialized.
 * True value means the 'kingdom' global holds an array of string collected from the ".kingdom-viewer" element in the client).
 */
let kingdomInitialized: boolean = false;

/**
 * Content global variable -
 * Use - Control flow for the content script.
 * False value means the 'playerName', 'playerNick', 'opponentName', and 'opponentNick' globals are not initialized.
 * True value means they each hold the appropriate string collected from the elements in the client DOM.
 */
let playersInitialized: boolean = false;

/**
 * Content global variable -
 * Use - Control flow for the content script.
 * False value means the Deck objects that will be used to track the game state are not yet created.
 * True value means a Deck object has been assigned to the value of the 'playerDeck' and another Deck
 * object has been assigned to the value of the 'opponentDeck' global variable.
 */
let playerDeckInitialized: boolean = false;

/**
 * Content global variable - Holds the value of which logs have already been sent to the Deck objects.
 * Use - Control flow for the content script.
 * Every time more logs are sent to the Deck object's update method, this variable is updated to include those
 * logs.  This variable is used to control logic by comparing possible new logs to those that have already been
 * processed by the Decks.
 */
let logsProcessed: string;

/**
 * Content global variable - Holds the value of the ".game-log" innerText from the client DOM.
 * Use 1 - When new content is detected in the client ".game-log" element, this variable is updated to contain the value
 * that element's innerText.
 * Use 2 - Control flow for the content script: the value of this variable is compared to the 'logsProcessed' global
 * to determine which logs to use when invoke the Deck object's update() method.
 */
let gameLog: string;

/**
 * DEPRECATED - originally used for the Options portion of the extension, which is being replaced by the content section.
 * Content global variable - Holds the values of the Deck objects.  The playerName and opponentName are used as the
 * keys for the corresponding Deck objects
 * Use - The decks track the game state for players, and in the context of the content script, the update() method is
 * invoked on these Deck objects.
 */
let decks: Map<string, Deck> = new Map();

/**
 * Content global variable - Holds the values of the Deck objects.  The playerName and opponentName are used as the
 * keys for the corresponding Deck objects
 * Use - The decks track the game state for players, and in the context of the content script, the update() method is
 * invoked on these Deck objects.
 */
let clientDecks: Map<string, Deck> = new Map();

/**
 * Content global variable - Holds the strings that define the cards available in the current game.
 * Use - invoking Deck object constructor
 */
let kingdom: Array<string> = [];

/**
 * Content global variable -
 * Use - When a game is active, used to set an interval to periodically check if the game is still active,
 * and if the game is not active, executes a game reset.
 */
let resetInterval: NodeJS.Timer;

/**
 * Content global variable -
 * Use - This container is appended to the Dominion client, and is where the React.JS root rendered.
 */
let domViewContainer: HTMLElement;

/**
 * Content global variable -
 * Use - The ReactJS root to render the root React Component into the Client Dom
 */
let domViewRoot: Root;

/**
 * DEPRECATED - Originally used to send messages to the extension.
 * Content global variable -
 * Use: Control flow for whether to use the options portion of the extension
 */
// let optionsOn: boolean = false;

let alreadyRendered: boolean = false;

/**
 * Control flow function.
 * @returns boolean, true if all four of the globals within are true.
 */
const initialized = () => {
  return (
    logInitialized &&
    playersInitialized &&
    kingdomInitialized &&
    playerDeckInitialized
  );
};

/**
 * Reset function.
 * 1) Sets all content globals to their initial state, and
 * 2) Disconnects the mutation observer
 * 3) removes dev buttons
 * 4) removes the container div from the client DOM
 * 5) unmounts the react root
 * 6) clears the reset interval
 * 7) sets the init interval
 */
export const resetGame = () => {
  playersInitialized = false;
  logInitialized = false;
  kingdomInitialized = false;
  playerDeckInitialized = false;
  logsProcessed = "";
  gameLog = "";
  playerName = "";
  opponentName = "";
  decks = new Map();
  clientDecks = new Map();
  kingdom = [];
  const devButtons = document.getElementById("dev-buttons");
  if (devButtons !== null) {
    devButtons!.remove();
  }
  // domViewContainer.remove();
  // domViewRoot.unmount();
  clearInterval(resetInterval);
  initInterval = setInterval(initIntervalFunction, 1000);
};

/**
 * Primary function of the content script
 * Use - Periodically checks the client DOM for the presence of the elements that
 * are required to initialize the content script global variables, one at a time.
 * Once they are initialized, the initInterval is cleared, the resetInterval is set,
 * the Deck objects initial update() invocation occur, and finally the React root is
 * appended to the client DOM.
 */
const initIntervalFunction = () => {
  if (!logInitialized) {
    if (isGameLogPresent()) {
      gameLog = getGameLog();
      logInitialized = true;
    }
  }
  if (!playersInitialized) {
    if (arePlayerInfoElementsPresent()) {
      [playerName, opponentName] =
        getPlayerAndOpponentNameByComparingElementPosition(
          getPlayerInfoElements()
        );
      [playerNick, opponentNick] = getPlayerNameAbbreviations(
        gameLog,
        playerName
      );
      playersInitialized = true;
    }
  }
  if (!kingdomInitialized) {
    if (isKingdomElementPresent()) {
      kingdom = getKingdom();
      kingdomInitialized = true;
    }
  }
  if (!playerDeckInitialized) {
    if (playersInitialized && kingdomInitialized) {
      decks = createPlayerDecks(
        playerName,
        playerNick,
        opponentName,
        opponentNick,
        kingdom
      );
      clientDecks = createPlayerDecks(
        playerName,
        playerNick,
        opponentName,
        opponentNick,
        kingdom
      );
      playerDeckInitialized = true;
    }
  }

  const resetCheckIntervalFunction = () => {
    if (!isGameLogPresent()) {
      clearInterval(resetInterval);
      resetGame();
    }
  };
  if (initialized()) {
    const myDiv = $("<div>").attr("id", "dev-buttons").text("Dev-Buttons");
    $(".chat-display").append(myDiv);
    myDiv.append(
      $("<button>")
        .text("Reset")
        .on("click", () => {
          resetGame();
        })
    );
    myDiv.append(
      $("<button>")
        .attr("id", "newLogsButton")
        .text("Console Log Globals")
        .on("click", () => {
          console.log("logInitialized: ", logInitialized);
          console.log("kingdomInitialized: ", kingdomInitialized);
          console.log("playersInitialized: ", playersInitialized);
          console.log("playerDeckInitialized: ", playerDeckInitialized);
          console.group("LogsProcessed Array");
          if (logsProcessed !== undefined)
            console.log("logsProcessed: ", logsProcessed.split("\n"));
          console.groupEnd();
          console.group("gameLog Array");
          if (gameLog !== undefined)
            console.log("gameLog: ", gameLog.split("\n"));
          console.groupEnd();
          console.log("playerNames: ", playerName, opponentName);
          console.log("playerAbbreviatedNames: ", playerNick, opponentNick);
          console.log("decks: ", decks);
          console.log("kingdom: ", kingdom);
        })
    );
    clearInterval(initInterval);
    resetInterval = setInterval(resetCheckIntervalFunction, 1000);
    if (alreadyRendered) {
      domViewContainer.remove();
      domViewRoot.unmount();
    }
    domViewContainer = document.createElement("div");
    domViewContainer.setAttribute("style", "z-index: 15000; position:fixed;");
    domViewContainer.setAttribute("id", "domViewContainer");
    domViewRoot = createRoot(domViewContainer);
    console.log("Checking the globals just before rendering root");
    console.log("gameLog", gameLog);
    console.log("logsProcessed", logsProcessed);
    domViewRoot.render(
      <DomRoot
        gameLog={gameLog}
        playerName={playerName}
        opponentName={opponentName}
        decks={clientDecks}
      />
    );
    alreadyRendered = true;
    document.body.appendChild(domViewContainer);
  }
};

let initInterval = setInterval(initIntervalFunction, 1000);
