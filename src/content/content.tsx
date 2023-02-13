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
} from "./contentFunctions";
// import GameLogExtractor from "./components/GameLogExtractor";
const Content = () => {
  return (
    <React.Fragment>
      <div id="dom-hack-area">Content</div>
      {/* <GameLogExtractor /> */}
    </React.Fragment>
  );
};

export default Content;

let logInitialized: boolean = false;
let kingdomInitialized: boolean = false;
let playersInitialized: boolean = false;
let playerDeckInitialized: boolean = false;
let sameFirstLetter: boolean = false;
let logsProcessed: string = "";
let gameLog: string;
let playerNames: Array<string> = [];
let playerAbbreviatedNames: Array<string> = [];
let decks: Map<string, Deck> = new Map();
let kingdom: Array<string> = [];
let linesDispatched: number = 0;
let treasureLine: boolean = false;
let observerOn: boolean = false;

// returns whether the initializations are complete,
// this is used to turn off the initializatino interval and move on to log processing
const initialized = () => {
  return (
    logInitialized &&
    playersInitialized &&
    kingdomInitialized &&
    playerDeckInitialized
  );
};

// functioo that calls the update() method on each deck object
const updateDeck = (newLogsToDispatch: string) => {
  const gameLogArr = gameLog.split("\n");
  Array.from(decks.keys()).forEach((playerName) => {
    decks.get(playerName)!.setDOMlog(gameLogArr);
    // console.log("set gameLog for " + playerName);
  });
  let separatedLogs = separateDeckLogs(newLogsToDispatch);
  let dispatched = false;
  if (separatedLogs[0].length > 0) {
    console.log(
      `Updating with ${decks
        .get(playerNames[0])!
        .getPlayerName()}.update() with`,
      separatedLogs[0]
    );
    // To keep logs clear for only my deck
    if (decks.get(playerNames[0])!.getPlayerName() == "GoodBeard")
      decks.get(playerNames[0])!.update(separatedLogs[0]);
    dispatched = true;
  }
  if (separatedLogs[1].length > 0) {
    console.log(
      `Updating with ${decks
        .get(playerNames[1])!
        .getPlayerName()}.update() with`,
      separatedLogs[1]
    );
    // To keep logs clear for only my deck
    if (decks.get(playerNames[1])!.getPlayerName() == "GoodBeard")
      decks.get(playerNames[1])!.update(separatedLogs[1]);
    dispatched = true;
  }
  if (dispatched) {
    console.warn("within dispatch");
    if (logsProcessed == "") {
      logsProcessed = newLogsToDispatch;
    } else {
      if (treasureLine) {
        logsProcessed = logsProcessed
          .split("\n")
          .slice(0, logsProcessed.split("\n").length - 1)
          .join("\n");
      }
      logsProcessed += "\n" + newLogsToDispatch;
    }
    let newLinesDispatched =
      separatedLogs[0].length +
      separatedLogs[1].length +
      separatedLogs[2].length;
    linesDispatched += newLinesDispatched;
  }

  sendToFront(decks.get(playerNames[1])!);
  sendToFront(decks.get(playerNames[0])!);
};
// splits the logs up into two arrays that apply only to a single deck
const separateDeckLogs = (newLogEntries: string): Array<Array<string>> => {
  let entryArray = newLogEntries.split("\n");
  // first case player names do not start with same letter:
  let player1Array: Array<string> = [];
  let infoLogs: Array<string> = [];
  const player0Array = entryArray.filter((line) => {
    let include = false;
    if (
      line.match(/Card Pool|Game #|starts with |Turn /) != null ||
      line == ""
    ) {
      infoLogs.push(line);
      // } else if (line.match(playerNames[0]) && line.match("Turn ")) {
      //   player1Array.push(line);
      // } else if (line.match(playerNames[1]) && line.match("Turn ")) {
      //   include = true;
    } else if (sameFirstLetter) {
      line.match(playerNames[0]) ? (include = true) : player1Array.push(line);
    } else {
      line[0] == playerNames[0][0] ? (include = true) : player1Array.push(line);
    }
    return include;
  });

  return [player0Array, player1Array, infoLogs];
};

// creates elements to append to the dom and assigns click event listeners
const appendElements = () => {
  const mydiv = $("<div>").attr("id", "Jman").text("I'm IN THERE");
  $(".chat-display").append(mydiv);
  mydiv.append($("<button>").attr("id", "statebutton").text("LOG DECK STATE"));
  mydiv.append(
    $("<button>")
      .attr("id", "newLogsButton")
      .text("Console Log Globals")
      .on("click", () => {
        console.log("logInitialized: ", logInitialized);
        console.log("kingdomInitialized: ", kingdomInitialized);
        console.log("playersInitialized: ", playersInitialized);
        console.log("playerDeckInitialized: ", playerDeckInitialized);
        console.log("sameFirstLetter: ", sameFirstLetter);
        console.group("LogsProcessed Array");
        console.log("logsProcessed: ", logsProcessed.split("\n"));
        console.groupEnd();
        console.group("gameLog Array");
        console.log("gameLog: ", gameLog.split("\n"));
        console.groupEnd();
        console.log("playerNames: ", playerNames);
        console.log("playerAbbreviatedNames: ", playerAbbreviatedNames);
        console.log("decks: ", decks);
        console.log("kingdom: ", kingdom);
        console.log("linesDispatched: ", linesDispatched);
        console.log("treasureLine: ", treasureLine);
        console.log("observerOn: ", observerOn);
      })
  );
};

const sendToFront = (deck: Deck) => {
  if ((deck.playerName = playerNames[0])) {
    (async () => {
      try {
        console.log("Sending deck as playerdeck:", deck);
        const response = await chrome.runtime.sendMessage({
          playerDeck: JSON.stringify(deck),
        });
        console.log(response);
      } catch (e) {
        console.log("Can't send to front: ", e);
      }
    })();
  } else {
    (async () => {
      try {
        const response = await chrome.runtime.sendMessage({
          opponentDeck: JSON.stringify(deck),
        });
        console.log(response);
      } catch (e) {
        console.log("Can't send to front: ", e);
      }
    })();
  }
};

const resetGame = () => {
  chrome.storage.sync.set({ playerDeck: "" }).then(() => {
    console.log(`Player Deck sync storage reset`);
  });
  chrome.storage.sync.set({ opponentDeck: "" }).then(() => {
    console.log(`Opponent Deck sync storage reset`);
  });
  logInitialized = false;
  playersInitialized = false;
  kingdomInitialized = false;
  playerDeckInitialized = false;
  logInitialized = false;
  kingdomInitialized = false;
  playersInitialized = false;
  playerDeckInitialized = false;
  sameFirstLetter = false;
  logsProcessed = "";
  gameLog;
  playerNames = [];
  playerAbbreviatedNames = [];
  decks = new Map();
  kingdom = [];
  linesDispatched = 0;
  mo.disconnect();
  initInterval = setInterval(initIntervalFunction, 1000);
};

const observerOptions = {
  childList: true,
  subtree: true,
};

const gameLogObserver: MutationCallback = (
  mutationList: MutationRecord[],
  observer: MutationObserver
) => {
  if (!isGameLogPresent()) {
    resetGame();
  } else {
    console.log("mutationList", mutationList);
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
              console.log("new logs");
              const lastGameLogEntry = getLastLogEntryOf(gameLog);
              treasureLine = isATreasurePlayLogEntry(lastGameLogEntry);
              const newLogsToDispatch = getUndispatchedLogs(
                logsProcessed,
                gameLog
              );
              updateDeck(newLogsToDispatch);
            }
          }
        }
      }
    }
  }
};

const mo = new MutationObserver(gameLogObserver);

const initIntervalFunction = () => {
  console.log("Initialized = ", initialized());
  if (!logInitialized) {
    if (isGameLogPresent()) {
      gameLog = getGameLog();
      logInitialized = true;
    }
  }
  if (!playersInitialized) {
    if (arePlayerInfoElementsPresent()) {
      playerNames = getPlayerAndOpponentNameByComparingElementPosition(
        getPlayerInfoElements()
      );
      playerAbbreviatedNames = getPlayerNameAbbreviations(gameLog, playerNames);
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
      decks = createPlayerDecks(playerNames, playerAbbreviatedNames, kingdom);
      playerDeckInitialized = true;
    }
  }

  if (initialized()) {
    console.log("initialized");
    clearInterval(initInterval);
    appendElements();
    // initial deck dispatch
    const newLogsToDispatch = getUndispatchedLogs(logsProcessed, gameLog);
    updateDeck(newLogsToDispatch);
    // Attach mutationobserver to gamelog
    const gameLogElement = document.getElementsByClassName("game-log")[0];
    mo.observe(gameLogElement, observerOptions);
  }
};

let initInterval = setInterval(initIntervalFunction, 1000);
