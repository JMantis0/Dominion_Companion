import React from "react";
import { createRoot } from "react-dom/client";
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
  areNewLogsToSend,
  getUndispatchedLogs,
  sendToFront,
  getHeroPlayerInfoElement,
} from "./contentFunctions";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

import DomRoot from "./components/DomRoot";

const Content = () => {
  const state = useSelector((state: RootState) => state);
  console.log("state", state);

  return (
    <Provider store={store}>
      <React.Fragment>
        <div id="dom-view"></div>
      </React.Fragment>
    </Provider>
  );
};
export default Content;

let playerName: string = "";
let playerNick: string = "";
let opponentName: string = "";
let opponentNick: string = "";
let logInitialized: boolean = false;
let kingdomInitialized: boolean = false;
let playersInitialized: boolean = false;
let playerDeckInitialized: boolean = false;
let logsProcessed: string;
let gameLog: string;
let decks: Map<string, Deck> = new Map();
let kingdom: Array<string> = [];
let treasureLine: boolean = false;
let observerOn: boolean = false;
let resetInterval: NodeJS.Timer;

const initialized = () => {
  return (
    logInitialized &&
    playersInitialized &&
    kingdomInitialized &&
    playerDeckInitialized
  );
};

export const resetGame = () => {
  playersInitialized = false;
  logInitialized = false;
  kingdomInitialized = false;
  playerDeckInitialized = false;
  logsProcessed = "";
  gameLog;
  playerName = "";
  opponentName = "";
  decks = new Map();
  kingdom = [];
  mo.disconnect();
  const devBtns = document.getElementById("dev-btns");
  if (devBtns !== null) {
    devBtns!.remove();
  }
  clearInterval(resetInterval);
  initInterval = setInterval(initIntervalFunction, 1000);
};

const gameLogObserver: MutationCallback = (mutationList: MutationRecord[]) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      const addedNodes = mutation.addedNodes;
      if (addedNodes.length > 0) {
        const lastAddedNode: HTMLElement = addedNodes[
          addedNodes.length - 1
        ] as HTMLElement;
        const lastAddedNodeText = lastAddedNode.innerText;
        if (lastAddedNodeText.length > 0) {
          console.log("lastAddedNodeText:, ", lastAddedNodeText);
          if (areNewLogsToSend(logsProcessed, getGameLog())) {
            gameLog = getGameLog();
            const newLogsToDispatch = getUndispatchedLogs(
              logsProcessed,
              gameLog
            )
              .split("\n")
              .slice();
            console.log("newLogs to Dispath:", newLogsToDispatch);
            decks.get(playerName)?.update(newLogsToDispatch);
            sendToFront(decks.get(playerName)!, playerName);
            logsProcessed = gameLog;
          }
        }
      }
    }
  }
};

const mo = new MutationObserver(gameLogObserver);

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
    clearInterval(initInterval);
    resetInterval = setInterval(resetCheckIntervalFunction, 1000);
    const mydiv = $("<div>").attr("id", "dev-btns").text("Dev-Buttons");
    $(".chat-display").append(mydiv);
    mydiv.append(
      $("<button>")
        .attr("id", "statebutton")
        .text("heroEl")
        .on("click", () => console.log(heroEl))
    );
    mydiv.append(
      $("<button>")
        .text("Reset")
        .on("click", () => {
          resetGame();
        })
    );
    mydiv.append(
      $("<button>")
        .attr("id", "newLogsButton")
        .text("Console Log Globals")
        .on("click", () => {
          console.log("logInitialized: ", logInitialized);
          console.log("kingdomInitialized: ", kingdomInitialized);
          console.log("playersInitialized: ", playersInitialized);
          console.log("playerDeckInitialized: ", playerDeckInitialized);
          console.group("LogsProcessed Array");
          console.log("logsProcessed: ", logsProcessed.split("\n"));
          console.groupEnd();
          console.group("gameLog Array");
          console.log("gameLog: ", gameLog.split("\n"));
          console.groupEnd();
          console.log("playerNames: ", playerName, opponentName);
          console.log("playerAbbreviatedNames: ", playerNick, opponentNick);
          console.log("decks: ", decks);
          console.log("kingdom: ", kingdom);
          console.log("treasureLine: ", treasureLine);
          console.log("observerOn: ", observerOn);
        })
    );

    const newLogsToDispatch = getUndispatchedLogs(logsProcessed, gameLog)
      .split("\n")
      .slice();
    decks.get(playerName)?.update(newLogsToDispatch);
    sendToFront(decks.get(playerName)!, playerName);
    logsProcessed = gameLog;
    const gameLogElement = document.getElementsByClassName("game-log")[0];
    const observerOptions = {
      childList: true,
      subtree: true,
    };
    mo.observe(gameLogElement, observerOptions);

    const playerInfoParentEl =
      document.getElementsByClassName("player-info")[0];
    // console.log(heroInfo?.style.transform);

    // Create element to use as react root.
    const domViewContainer = document.createElement("div");
    // set z-index
    domViewContainer.setAttribute("style", "z-index: 20; position:relative;");
    // Give it an ID
    domViewContainer.setAttribute("id", "domViewContainer");
    //Create a react root with it
    const domViewRoot = createRoot(domViewContainer);
    // Put the domView component into the react root
    domViewRoot.render(<DomRoot />);

    // Now domViewRoot has been added to the domViewContainer
    //Finally append the domviewContainer, which has the react component
    // rendered to it, into the DOM of the dominion page, into the <div> that
    // has class "player-info"
    const body = document.getElementsByTagName("body")[0];
    console.log("bodY", body);
    playerInfoParentEl.appendChild(domViewContainer);

    // Now i'd like to position the thing just above the child <player-info> element for the hero.
    // Plan to do this by collecting it's css properties

    let heroEl = getHeroPlayerInfoElement(getPlayerInfoElements());
    console.log(heroEl);
  }
};

let initInterval = setInterval(initIntervalFunction, 1000);
