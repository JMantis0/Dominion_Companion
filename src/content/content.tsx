import React from "react";
import $ from "jquery";
import "jqueryui";
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
  areNewLogsToSend,
  getUndispatchedLogs,
  sendToFront,
} from "./contentFunctions";

import DomRoot from "./DomRoot";

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
let clientDecks: Map<string, Deck> = new Map();
let kingdom: Array<string> = [];
let treasureLine: boolean = false;
let observerOn: boolean = false;
let resetInterval: NodeJS.Timer;
let domViewRoot: Root;
let domViewContainer: HTMLElement;

const initialized = () => {
  return (
    logInitialized &&
    playersInitialized &&
    kingdomInitialized &&
    playerDeckInitialized
  );
};

export const resetGame = () => {
  console.log("resettingGame");
  playersInitialized = false;
  logInitialized = false;
  kingdomInitialized = false;
  playerDeckInitialized = false;
  logsProcessed = "";
  gameLog;
  playerName = "";
  opponentName = "";
  decks = new Map();
  clientDecks = new Map();
  kingdom = [];
  mo.disconnect();
  const devBtns = document.getElementById("dev-btns");
  if (devBtns !== null) {
    devBtns!.remove();
  }
  domViewContainer.remove();
  domViewRoot.unmount();
  clearInterval(resetInterval);
  initInterval = setInterval(initIntervalFunction, 1000);
};

const gameLogObserverForOptions: MutationCallback = (
  mutationList: MutationRecord[]
) => {
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
            console.log("Content.tsx newLogs to Dispath:", newLogsToDispatch);
            decks.get(playerName)?.update(newLogsToDispatch);
            sendToFront(decks.get(playerName)!, playerName);
            logsProcessed = gameLog;
          }
        }
      }
    }
  }
};

const mo = new MutationObserver(gameLogObserverForOptions);

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
    const mydiv = $("<div>").attr("id", "dev-btns").text("Dev-Buttons");
    $(".chat-display").append(mydiv);
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
    clearInterval(initInterval);
    resetInterval = setInterval(resetCheckIntervalFunction, 1000); // Turn on resetInterval.
    const newLogsToDispatch = getUndispatchedLogs(logsProcessed, gameLog) // Initial dispatch
      .split("\n")
      .slice();
    decks.get(playerName)?.update(newLogsToDispatch); //Decks is rendered in the Options page
    clientDecks.get(playerName)?.update(newLogsToDispatch); //clientDecks is the set of decks imbedded in the client
    sendToFront(decks.get(playerName)!, playerName); //Send to the Options page.
    logsProcessed = gameLog;

    const gameLogElement = document.getElementsByClassName("game-log")[0];
    const observerOptions = {
      childList: true,
      subtree: true,
    };
    mo.observe(gameLogElement, observerOptions);

    domViewContainer = document.createElement("div");
    domViewContainer.setAttribute("style", "z-index: 15000; position:fixed;");
    domViewContainer.setAttribute("id", "domViewContainer");
    domViewRoot = createRoot(domViewContainer);
    domViewRoot.render(
      <DomRoot
        gameLog={gameLog}
        logsProcessed={logsProcessed}
        playerName={playerName}
        opponentName={opponentName}
        decks={clientDecks}
      />
    );
 
    document.body.appendChild(domViewContainer);
  }
};

let initInterval = setInterval(initIntervalFunction, 1000);
