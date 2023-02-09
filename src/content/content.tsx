import React from "react";
import { Deck } from "../model/deck";
// import GameLogExtractor from "./components/GameLogExtractor";
const Content = () => {
  return(
  <React.Fragment>
    <div id="dom-hack-area">Content</div>
    {/* <GameLogExtractor /> */}
  </React.Fragment>
)};

export default Content;

let logInitialized = false;
let kingdomInitialized = false;
let playersInitialized = false;
let playerDeckInitialized = false;
let sameFirstLetter = false;
let logsProcessed = "";
let DOMlog;
let playerNames = [];
let playerAbbreviatedNames = [];
let decks = new Map();
let kingdom = [];
let linesDispatched = 0;

const initializeKingdom = () => {
  if (document.getElementsByClassName("kingdom-viewer-group").length > 0) {
    let cards = [];
    try {
      for (let elt of document
        .getElementsByClassName("kingdom-viewer-group")[0]
        .getElementsByClassName(
          "name-layer"
        ) as HTMLCollectionOf<HTMLElement>) {
        const card = elt.innerText.trim();
        cards.push(card);
      }
    } catch (e) {
      console.log("Error in getKingdom()", e);
    }
    [
      "Province",
      "Gold",
      "Duchy",
      "Silver",
      "Estate",
      "Copper",
      "Curse",
    ].forEach((card) => {
      cards.push(card);
    });
    kingdom = cards;
    kingdomInitialized = true;
  }
};

// Function that grabs the initial game log on load and assigns it to global variable
const initializeDOMLog = () => {
  if ($(".game-log").length > 0) {
    DOMlog = $(".game-log")[0].innerText;
    logInitialized = true;
  }
};

// gets the player names, assigns them global variable, and assigns truthy value
// to global variable for if the names start with the same letter(important for log parsing)
const initializePlayers = () => {
  if (document.getElementsByTagName("player-info-name").length > 0) {
    getPlayerNames();
    playersInitialized = true;
  }
};
// pairs with function initializePlayers()
const getPlayerNames = () => {
  let DOMarr = DOMlog.split("\n");
  const index1 = DOMarr[4].indexOf(" starts with 3 Estates.");
  const index2 = DOMarr[6].indexOf(" starts with 3 Estates.");
  playerAbbreviatedNames.push(DOMarr[4].substring(0, index1));
  playerAbbreviatedNames.push(DOMarr[6].substring(0, index2));
  const playerElements = document.getElementsByTagName(
    "player-info-name"
  ) as HTMLCollectionOf<HTMLElement>;
  for (let i = 0; i <= 1; i++) {
    playerNames.push(playerElements[i].innerText);
  }
  if (playerNames[0][0] == playerNames[1][0]) sameFirstLetter = true;
};

// creats a deck for each player and adds them to the global array, and
// toggles the playerDeckInitialized global boolean
const initializePlayerDeck = () => {
  if (playersInitialized && kingdomInitialized) {
    playerNames.forEach((player, idx) => {
      decks.set(player, new Deck(player, playerAbbreviatedNames[idx], kingdom));
    });
    console.log(decks);
    playerDeckInitialized = true;
  }
};

// helper dev function
const outputState = () => {
  console.log(`logInitialized ${logInitialized}`);
  console.log(`playersInitialized ${playersInitialized}`);
  console.log(`kingdomInitialized ${kingdomInitialized}`);
  console.log(`playerDeckInitialized ${playerDeckInitialized}`);
};

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
  const DOMlogArr = DOMlog.split("\n");
  Array.from(decks.keys()).forEach((playerName) => {
    decks.get(playerName).setDOMlog(DOMlogArr);
    console.log("set DOMlog for " + playerName);
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
      logsProcessed += "\n" + newLogsToDispatch;
    }
    let newLinesDispatched =
      separatedLogs[0].length +
      separatedLogs[1].length +
      separatedLogs[2].length;
    linesDispatched += newLinesDispatched;
  }
  let stringDeck = JSON.stringify(decks.get(playerNames[1]));
  // console.log("Stringified Deck,", stringDeck);
  chrome.storage.sync.set({ playerDeck: stringDeck }).then(() => {
    console.log(`${playerNames[1]}'s deck in sync storage set`);
  });
  stringDeck = JSON.stringify(decks.get(playerNames[0]));
  chrome.storage.sync.set({ opponentDeck: stringDeck }).then(() => {
    console.log(`${playerNames[0]}'s deck in sync storage set`);
  });
};
// splits the logs up into two arrays that apply only to a single deck
const separateDeckLogs = (newLogEntries) => {
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

const checkNewLogs = () => {
  DOMlog = $(".game-log")[0].innerText;
  let DMArr = DOMlog.split("\n");
  let DOMlogLines = DMArr.length;
  let lastDOMline = DMArr.pop();
  return (
    DOMlogLines > linesDispatched &&
    !(
      lastDOMline.match(/Coppers?|Silvers?|Golds?|/) &&
      lastDOMline.match("plays")
    ) &&
    DOMlogLines > 7
  );
};
// creates elements to append to the dom and assigns click event listeners
const appendElements = () => {
  const messageButton = $("<button>")
    .attr("id", "msgBtn")
    .text("SendMessageToExt");
  const mydiv = $("<div>").attr("id", "Jman").text("I'm IN THERE");
  $(".chat-display").append(mydiv);
  mydiv.append($("<button>").attr("id", "statebutton").text("LOG DECK STATE"));
  mydiv.append(
    $("<button>")
      .attr("id", "DOMlogsButton")
      .text("Compare DOMlog to Logs Processed")
      .click(() => {
        let pass = true;
        for (let i = 0; i < DOMlog.split("\n").length; i++) {
          let DArr = DOMlog.split("\n");
          let lpArr = logsProcessed.split("\n");
          console.log(`Entry ${i} of DOMlog        is ${DArr[i]}`);
          console.log(`Entry ${i} of logsprocessed is ${lpArr[i]}`);
          if (DArr[i] != lpArr[i]) pass = false;
        }
        $("#DOMlogsButton").text(pass);
      })
  );
  mydiv.append(messageButton);

  $("#statebutton").click(() => {
    const myDeck = decks.get("GoodBeard");
    console.log("Deck List: ", myDeck.getEntireDeck());
    console.log("Hand: ", myDeck.getHand());
    console.log("Discard: ", myDeck.getGraveyard());
    console.log("Library: ", myDeck.getLibrary());
    console.log("Trash: ", myDeck.getTrash());
    console.log("In Play: ", myDeck.getInPlay());
    // console.log("deck DOMlog: ", myDeck.getDOMlog());
    // console.log("deck logArchive: ", myDeck.getLogArchive());
  });
  messageButton.click(() => {
    // sendMessage();
  });
};

// Sends data to the react front end popup
const sendToFront = (deck) => {
  chrome.runtime.sendMessage(JSON.stringify(deck));
};

const getUnprocessedLogs = () => {
  const DOMLogArr = DOMlog.split("\n");
  const DOMlogLines = DOMLogArr.length;
  let newLinesToDispatch = DOMlogLines - linesDispatched;
  let newLogsToDispatch = [];
  for (let i = linesDispatched; i < DOMlogLines; i++) {
    newLogsToDispatch.push(DOMLogArr[i]);
  }
  return newLogsToDispatch.join("\n");
};

const resetGame = () => {
  logInitialized = false;
  playersInitialized = false;
  kingdomInitialized = false;
  playerDeckInitialized = false;
  initInterval = setInterval(initIntervalFunction, 1000);
};

const initIntervalFunction = () => {
  if (!logInitialized) initializeDOMLog();
  if (!playersInitialized) initializePlayers();
  if (!kingdomInitialized) initializeKingdom();
  if (!playerDeckInitialized) initializePlayerDeck();
  if (initialized()) {
    clearInterval(initInterval);
    appendElements();
    const deckUpdateInterval = setInterval(() => {
      if (!$(".game-log")[0]) {
        console.log("No game log, resetting");
        resetGame();
        clearInterval(deckUpdateInterval);
      }
      if (checkNewLogs()) {
        updateDeck(getUnprocessedLogs());
        // sendToFront(decks.get("GoodBeard"));
      }
    }, 1000);
  }
};

// The init interval continues until the "initialization" is complete.
// Once completed, another interval initates, that monitors changes in the log.
let initInterval = setInterval(initIntervalFunction, 1000);
