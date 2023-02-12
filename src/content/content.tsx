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
//used to monitor treasure lines for playing treasure phase
const observerOptions = {
  childList: true,
};
const mo = new MutationObserver((mutationList, observer) => {
  console.log("Mutation observer callback");
  console.log("mutationList is: ", mutationList);
  console.log("observer is: ", observer);
  // mo.disconnect;
  // const lastLogLineElement = document.getElementsByClassName(
  //   "log-scroll-container"
  // )[0]as HTMLElement;
  // console.log(lastLogLineElement);
  // if (checkIfTreasureLine(lastLogLineElement.innerText)) {
  //   mo.observe(lastLogLineElement, observerOptions);
  // }
  // const lastDiv
  console.log(mutationList[mutationList.length - 1].addedNodes[0].innerText);
});

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

// functino that calls the update() method on each deck object
const updateDeck = (newLogsToDispatch) => {
  const DOMlogArr = gameLog.split("\n");
  Array.from(decks.keys()).forEach((playerName) => {
    decks.get(playerName).setDOMlog(DOMlogArr);
    // console.log("set gameLog for " + playerName);
  });
  let separatedLogs = separateDeckLogs(newLogsToDispatch);
  let dispatched = false;
  if (separatedLogs[0].length > 0) {
    console.log(
      `Updating with ${decks
        .get(playerNames[0])
        .getPlayerName()}.update() with`,
      separatedLogs[0]
    );
    // To keep logs clear for only my deck
    if (decks.get(playerNames[0]).getPlayerName() == "GoodBeard")
      decks.get(playerNames[0]).update(separatedLogs[0]);
    dispatched = true;
  }
  if (separatedLogs[1].length > 0) {
    console.log(
      `Updating with ${decks
        .get(playerNames[1])
        .getPlayerName()}.update() with`,
      separatedLogs[1]
    );
    // To keep logs clear for only my deck
    if (decks.get(playerNames[1]).getPlayerName() == "GoodBeard")
      decks.get(playerNames[1]).update(separatedLogs[1]);
    dispatched = true;
  }
  if (dispatched) {
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

  sendToFront(decks.get(playerNames[1]));
  sendToFront(decks.get(playerNames[0]));

  // let stringDeck = JSON.stringify(decks.get(playerNames[1]));

  // console.log("Stringified Deck,", stringDeck);
  // chrome.storage.sync.set({ playerDeck: stringDeck }).then(() => {
  // console.log(`${playerNames[1]}'s deck in sync storage set`);
  // });
  // stringDeck = JSON.stringify(decks.get(playerNames[0]));
  // chrome.storage.sync.set({ opponentDeck: stringDeck }).then(() => {
  // console.log(`${playerNames[0]}'s deck in sync storage set`);
  // });
};
// splits the logs up into two arrays that apply only to a single deck
const separateDeckLogs = (newLogEntries: string): Array<Array<string>> => {
  let entryArray = newLogEntries.split("\n");
  // first case player names do not start with same letter:
  let player1Array = [];
  let infoLogs = [];
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

const checkIfTreasureLine = (line: string): boolean => {
  return (
    line.match(/Coppers?|Silvers?|Golds?|/) !== null &&
    line.match("plays") !== null
  );
};

const checkNewLogs = () => {
  // I'd like to refine the checkNewLogs function.
  //  The way it is set up now, the phase where a player plays treasures is not getting logged.
  //   This is due to the challenge that a new line isn't necesarrily created during this phase, since players can play multiple treasures during this phase.
  //   The treasures are all rendered to the same elemenet, it would seem.
  //   For this reason, logic has been set up to return FALSE for new logs, even if there is a new log line, if that new log line matches nboth "plays" and a treasure.
  //   I would like to set up better logic that processes this log line.
  //   It will require some extra logic on both the content side and on the deck object side
  //   The logic on the front side will have to return that there is a new log, even if the number of lines are the same, in the case of Line.match("plays") and line.match(/Coppers?|Silvers?|Golds?|
  //   On the deck side, logic must compare the last processed line with whatever line it is curerntly processing, and only process the proper amount of treasure plays.
  //   For example.  If the last line processed was "L plays 3 coppers," and the next line that comes in is"L plays 5 coppers" the deck needs to play 2 coppers

  // So now I have the code to compare the last 2 lines.  Now the rules to check for new logs
  // must be changed, because counting lines dispatched vs lines in the DOM won't work.  We should simply compare
  // The dom log with the lines that have been dispatched?
  // Maybe we can keep the counting of lines system, but add logic that will prevent the # of lines dispatched
  gameLog = $(".game-log")[0].innerText;
  let DMArr = gameLog.split("\n");
  let DOMlogLines = DMArr.length;
  let lastDOMline = DMArr.pop();
  treasureLine = checkIfTreasureLine(lastDOMline);
  if (treasureLine && !observerOn) {
    console.log(
      "last dom line is a treasure play line.  Attaching a mutation observer to the element: "
    );
    const lastLogLineElement = document.getElementsByClassName(
      "log-scroll-container"
    )[0] as HTMLElement;
    console.log(lastLogLineElement);

    mo.observe(lastLogLineElement, observerOptions);
    observerOn = true;
  } else if (!treasureLine && observerOn) {
    if (observerOn) {
      console.log("Disconnecting observer");
      mo.disconnect();
      observerOn = false;
    }
  }
  const newlogsboolean =
    DOMlogLines > linesDispatched ||
    (DOMlogLines == linesDispatched && treasureLine && DOMlogLines > 7);

  const lastDomLineMatchesLastProcessedLine = (lastDOMline = logsProcessed
    .split("\n")
    .pop());

  console.log(
    "Checking for new logs..\nNew Logs: ",
    DOMlogLines > linesDispatched || !lastDomLineMatchesLastProcessedLine
  );
  return (
    DOMlogLines > linesDispatched ||
    // (DOMlogLines == linesDispatched &&
    //   lastDOMline.match(/Coppers?|Silvers?|Golds?|/) &&
    //   lastDOMline.match("plays") &&
    //   DOMlogLines > 7) &&
    !lastDomLineMatchesLastProcessedLine
  );
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
        console.group("LogsProcessed");
        console.log("logsProcessed: ", logsProcessed);
        console.groupEnd();
        console.group("gameLog");
        console.log("gameLog: ", gameLog);
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

// Sends data to the react front end popup
const sendToFront = (deck) => {
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

  // chrome.runtime.sendMessage(JSON.stringify(deck));
};

const getUnprocessedLogs = () => {
  const DOMLogArr = gameLog.split("\n");
  const DOMlogLines = DOMLogArr.length;
  let newLinesToDispatch = DOMlogLines - linesDispatched;
  let newLogsToDispatch = [];
  for (let i = linesDispatched; i < DOMlogLines; i++) {
    newLogsToDispatch.push(DOMLogArr[i]);
  }
  console.log("NewLogsToDispatch: ", newLogsToDispatch);
  return newLogsToDispatch.join("\n");
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

const addOptionsDataInterfaceListener = (): void => {
  console.log("Adding initial Load event listener");
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    console.log(
      sender.tab
        ? "from a content script:" + sender.tab.url
        : "from the extension"
    );
    if (request.message === "initLoad") {
      sendResponse({
        decks: {
          playerDeck: decks.get(playerNames[0]),
          opponentDeck: decks.get(playerNames[1]),
        },
      });
    }
  });
};

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
    clearInterval(initInterval);
    appendElements();

    const deckUpdateInterval = setInterval(() => {
      if (!$(".game-log")[0]) {
        console.log("No game log, resetting");
        resetGame();
        clearInterval(deckUpdateInterval);
      } else if (checkNewLogs()) {
        updateDeck(getUnprocessedLogs());
        // sendToFront(decks.get("GoodBeard"));
      }
    }, 1000);
  }
};

// The init interval continues until the "initialization" is complete.
// Once completed, another interval initates, that monitors changes in the log.
addOptionsDataInterfaceListener();
let initInterval = setInterval(initIntervalFunction, 1000);
