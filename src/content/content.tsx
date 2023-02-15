import React from "react";
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
  isATreasurePlayLogEntry,
  getLastLogEntryOf,
  getUndispatchedLogs,
  separateUndispatchedDeckLogs,
  sendToFront,
} from "./contentFunctions";
import { appendElements } from "./utils/utilityFunctions";

const Content = () => {
  return (
    <React.Fragment>
      <div id="dom-view"></div>
    </React.Fragment>
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
let logsProcessed: string = "";
let gameLog: string;
let decks: Map<string, Deck> = new Map();
let kingdom: Array<string> = [];
let treasureLine: boolean = false;
let observerOn: boolean = false;

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
          if (areNewLogsToSend(logsProcessed, getGameLog())) {
            gameLog = getGameLog();
            const lastGameLogEntry = getLastLogEntryOf(gameLog); //Might be obsolete and removable because it's completely handled by the Deck object
            treasureLine = isATreasurePlayLogEntry(lastGameLogEntry); //Might be obsolete and removable
            const newLogsToDispatch = getUndispatchedLogs(
              logsProcessed,
              gameLog
            );
            const { playerLogs, opponentLogs } = separateUndispatchedDeckLogs(
              newLogsToDispatch,
              playerNick
            );
            if (playerLogs.length > 0) {
              decks.get(playerName)?.update(playerLogs);
              sendToFront(decks.get(playerName)!, playerName);
            }

            if (opponentLogs.length > 0) {
              decks.get(opponentName)?.update(opponentLogs);
              sendToFront(decks.get(opponentName)!, playerName);
            }
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
  let resetInterval: NodeJS.Timer;
  const resetCheckIntervalFunction = () => {
    if (!isGameLogPresent()) {
      clearInterval(resetInterval);
      resetGame();
    }
  };
  if (initialized()) {
    clearInterval(initInterval);
    resetInterval = setInterval(resetCheckIntervalFunction, 1000);
    appendElements(
      logInitialized,
      kingdomInitialized,
      playersInitialized,
      playerDeckInitialized,
      logsProcessed,
      gameLog,
      [playerName, opponentName],
      [playerNick, opponentNick],
      decks,
      kingdom,
      treasureLine,
      observerOn
    );
    const newLogsToDispatch = getUndispatchedLogs(logsProcessed, gameLog);
    const { playerLogs, opponentLogs } = separateUndispatchedDeckLogs(
      newLogsToDispatch,
      playerNick
    );
    if (playerLogs.length > 0) {
      decks.get(playerName)?.update(playerLogs);
      sendToFront(decks.get(playerName)!, playerName);
    }
    if (opponentLogs.length > 0) {
      decks.get(opponentName)?.update(opponentLogs);
      sendToFront(decks.get(opponentName)!, playerName);
    }
    logsProcessed = gameLog;
    const gameLogElement = document.getElementsByClassName("game-log")[0];
    const observerOptions = {
      childList: true,
      subtree: true,
    };
    mo.observe(gameLogElement, observerOptions);
  }
};

let initInterval = setInterval(initIntervalFunction, 1000);
