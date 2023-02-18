import { Deck } from "../model/deck";
/**
 * Checks for presence of game-log element in the DOM.
 * Purpose: Control flow of content script.
 * @returns  The boolean for whether the game-log is present.
 */
const isGameLogPresent = (): boolean => {
  const gameLogElementCollection = document.getElementsByClassName("game-log");
  const gameLogElementCount = gameLogElementCollection.length;
  const gameLogPresent = gameLogElementCount > 0;
  return gameLogPresent;
};

/**
 * Gets and returns the game log element's innerText.
 * Purpose: Update the global gameLog variable.
 * @returns The string of innertext of the game-log element.
 */
const getGameLog = (): string => {
  const gameLogElement = document.getElementsByClassName(
    "game-log"
  )[0] as HTMLElement;
  const gameLog = gameLogElement.innerText;
  return gameLog;
};

/**
 * Checks for presence of <player-info-name> elements in the DOM.
 * Purpose: Control flow of content script.
 * @returns The boolean for whether the <player-info-name> elements are present in the dome.
 */
const arePlayerInfoElementsPresent = (): boolean => {
  const playerElements = document.getElementsByTagName(
    "player-info-name"
  ) as HTMLCollectionOf<HTMLElement>;
  const playerElementsPresent = playerElements.length > 0;
  return playerElementsPresent;
};

/**
 * Gets the <player-info elements> from the DOM and returns them.
 * Purpose: Part of initializing the global variables playerName and opponentName.
 * @returns HTMLCollection<HTMLElement> of <player-info-elmeents>:
 */
const getPlayerInfoElements = (): HTMLCollectionOf<HTMLElement> => {
  const playerInfoElements: HTMLCollectionOf<HTMLElement> =
    document.getElementsByTagName(
      "player-info"
    ) as HTMLCollectionOf<HTMLElement>;

  return playerInfoElements;
};

/**
 * Gets the <player-info-name> elements from the DOM, and compares their
 * css properties to determine which contains the player name and which
 * ontains the opponentname, then returns those names.
 * Purpose: Initializing the global variable playerName and opponentName.
 * @param playerInfoElements - Collection of <player-info> elements.
 * @returns An array containing the playerName and opponentName as strings.
 */
const getPlayerAndOpponentNameByComparingElementPosition = (
  playerInfoElements: HTMLCollectionOf<HTMLElement>
): Array<string> => {
  let playerName: string;
  let opponentName: string;
  const nameTransformMap: Map<string, number> = new Map();
  for (let element of playerInfoElements) {
    const nameElement = element.getElementsByTagName(
      "player-info-name"
    )[0] as HTMLElement;
    const nomen: string = nameElement.innerText;
    const transform: string = element.style.transform;
    const yTransForm: number = parseFloat(
      transform.split(" ")[1].replace("translateY(", "").replace("px)", "")
    );
    nameTransformMap.set(nomen, yTransForm);
  }
  //  Compare the Ytransform values.  The greatest one gets assigned to player.
  playerName = [...nameTransformMap.entries()].reduce((prev, current) => {
    return prev[1] > current[1] ? prev : current;
  })[0];
  opponentName = [...nameTransformMap.entries()].reduce((prev, current) => {
    return prev[1] < current[1] ? prev : current;
  })[0];

  return [playerName, opponentName];
};

/**
 * Uses the gameLog and player name to determine the player
 * and opponent abbreviations used in the game log, and returns
 * them.
 * Purpose: Initialize the global variables playerNick and opponentNick.
 * @param gameLog - The gameLog global variable.
 * @param playerName - The playerName global variable.
 * @returns Array of two strings, the player nickname and opponent nickname.
 */
const getPlayerNameAbbreviations = (
  gameLog: string,
  playerName: string
): Array<string> => {
  let playerNick: string;
  let opponentNick: string;
  const gameLogArr = gameLog.split("\n");

  // n1 player is the player going first.
  const n1 = gameLogArr[4].split(" ")[0];
  const n2 = gameLogArr[6].split(" ")[0];

  if (playerName.substring(0, n1.length) == n1) {
    playerNick = n1;
    opponentNick = n2;
  } else {
    playerNick = n2;
    opponentNick = n1;
  }

  return [playerNick, opponentNick];
};

/**
 * Checks for presence of kingdom-viewer-group element in the dom.
 * Purpose: Control flow for content script.
 * @returns The boolean for presence of the kingdom-viewer-group element.
 */
const isKingdomElementPresent = (): boolean => {
  let kingdomPresent: boolean;
  kingdomPresent =
    document.getElementsByClassName("kingdom-viewer-group").length > 0;
  return kingdomPresent;
};

/**
 * Gets the kindom-viewer-group element from the DOM and iterates through the
 * name-layer elements within it.  Extracts the innerText of each name-layer and
 * pushes it to an array of strings.  Then adds default strings to the array, and
 * eturns the array.
 * Purpose: To initialize the global variable kingdom.
 * @returns The array of strings containing the kingdom card available in the current game.
 */
const getKingdom = (): Array<string> => {
  let kingdom: Array<string>;
  let cards = [];
  try {
    for (let elt of document
      .getElementsByClassName("kingdom-viewer-group")[0]
      .getElementsByClassName("name-layer") as HTMLCollectionOf<HTMLElement>) {
      const card = elt.innerText.trim();
      cards.push(card);
    }
  } catch (e) {
    throw new Error(`Error in getKingdom`);
  }
  ["Province", "Gold", "Duchy", "Silver", "Estate", "Copper", "Curse"].forEach(
    (card) => {
      cards.push(card);
    }
  );
  kingdom = cards;
  return kingdom;
};

/**
 * Creates a deckmap object, and creates a Deck instance for the player and
 * a deck for the opponent, and adds the decks to the map using the
 * playerNames as a key.  The params are required to call Deck's constructor.
 * Purpose: To initialize the global decks variable.
 * @param playerName - The player name.
 * @param playerNick - The player abbreviation used in logs.
 * @param opponentName - The opponent name.
 * @param opponentNick - The opponent abbreviation used in logs.
 * @param kingdom - The array of kingdom cards.
 * @returns Map object that contains both the player deck and opponent deck.
 */
const createPlayerDecks = (
  playerName: string,
  playerNick: string,
  opponentName: string,
  opponentNick: string,
  kingdom: Array<string>
): Map<string, Deck> => {
  let deckMap: Map<string, Deck> = new Map();
  [playerName, opponentName].forEach((player, idx) => {
    deckMap.set(
      player,
      new Deck(player, [playerNick, opponentNick][idx], kingdom)
    );
  });
  return deckMap;
};

/**
 * Compares the logs that have been processed with current game log to
 * check if there are any unprocessed logs.
 * Purpose: Control flow for updating Deck state.
 * @param logsProcessed - The logs that have already been processed into the Decks.
 * @param gameLog - The current game log.
 * @returns Boolean for whether there are new logs to be processed.
 */
const areNewLogsToSend = (logsProcessed: string, gameLog: string): boolean => {
  let areNewLogs: boolean;
  const procArr = logsProcessed.split("\n").slice();
  const gLogArr = gameLog.split("\n").slice();
  const lastGameLogEntry = gLogArr.slice().pop();
  if (isLogEntryBuyWithoutGain(lastGameLogEntry!)) {
    areNewLogs = false;
  } else if (procArr.length > gLogArr.length) {
    throw new Error("Processed logs Larger than game log");
    areNewLogs = true;
  } else if (procArr.length < gLogArr.length) {
    areNewLogs = true;
  } else if (procArr.slice().pop() !== gLogArr.slice().pop()) {
    areNewLogs = true;
  } else areNewLogs = false;
  return areNewLogs;
};

/**
 * Checks to see if the line is special type of log that
 * requires extra processing.
 * Purpose: Control flow for content script.
 * @param line - The line being processed.
 * @returns Boolean for if the line is a treasure line.
 */
const isATreasurePlayLogEntry = (line: string): boolean => {
  let isATreasurePlay: boolean;
  isATreasurePlay =
    line.match(/Coppers?|Silvers?|Golds?/) !== null &&
    line.match("plays") !== null;
  return isATreasurePlay;
};

/**
 * Gets the last log entry from a log string and returns it.
 * Purpose: Control flow for updating Deck state.
 * @param logs - A log string.
 * @returns The last log entry of the log string.
 */
const getLastLogEntryOf = (logs: string): string => {
  let lastEntry: string;
  const logArray = logs.slice().split("\n");
  lastEntry = logArray.slice().pop()!;
  if (!lastEntry) {
    throw new Error("Empty Log");
  }
  return lastEntry;
};

/**
 * Compares the logs that have been processed with the current
 * game log.  Gets the logs that have not been processed and
 * returns them.
 * Purpose: To get the new logs that are needed to update Deck state.
 * @param logsDispatched - Logs that have been processed into the Decks
 * @param gameLog - The entire game log.
 * @returns The logs that are present in the game log that have not yet been
 * processed into the Deck states.
 */
const getUndispatchedLogs = (
  logsDispatched: string,
  gameLog: string
): string => {
  let undispatchedLogs: string;
  let dispatchedArr: string[];
  if (logsDispatched !== "" && logsDispatched !== undefined) {
    dispatchedArr = logsDispatched.split("\n").slice();
  } else {
    dispatchedArr = [];
  }
  const gameLogArr = gameLog.split("\n").slice();
  if (dispatchedArr.length > gameLogArr.length) {
    throw new Error("More dispatched logs than game logs");
  } else if (dispatchedArr.length < gameLogArr.length) {
    const numberOfUndispatchedLines = gameLogArr.length - dispatchedArr.length;
    undispatchedLogs = gameLogArr.slice(-numberOfUndispatchedLines).join("\n");
  } else {
    const lastGameLogLine = gameLogArr[gameLogArr.length - 1];
    const lastLogsDispatchedLine = dispatchedArr[dispatchedArr.length - 1];
    if (lastGameLogLine === lastLogsDispatchedLine) {
      undispatchedLogs = "No new logs";
      throw new Error("Equal # lines and last line also equal");
    } else {
      undispatchedLogs = lastGameLogLine;
    }
  }
  return undispatchedLogs!;
};

/**
 * Sends a Deck object to the Chrome runtime, to be picked up by
 * the DataInterface component.  Player name is used to determine
 * whether the deck should be sent as a player deck or opponent deck.
 * Purpose: To update the Deck state in the Options component's redux store.
 * @param deck - An updated Deck object.
 * @param playerName - The global variable for the player name.
 */
const sendToFront = (deck: Deck, playerName: string) => {
  if (deck.playerName === playerName) {
    (async () => {
      try {
        const response = await chrome.runtime.sendMessage({
          playerDeck: JSON.stringify(deck),
        });
        console.log(response);
      } catch (e) {
        // console.log("Can't send to front: ", e);
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
        // console.log("Can't send to front: ", e);
      }
    })();
  }
};

/**
 * Used by decks to eliminate ambiguity for certain Vassal activity.
 * @returns - A collection of all the divs in the log-scroll-container with the class 'log-line'
 */
const getLogScrollContainerLogLines = (): HTMLCollectionOf<HTMLElement> => {
  let scrollEl: HTMLCollectionOf<HTMLElement>;
  scrollEl = document
    .getElementsByClassName("log-scroll-container")[0]
    .getElementsByClassName("log-line") as HTMLCollectionOf<HTMLElement>;
  if (scrollEl == undefined) throw new Error("Element is undefined");
  return scrollEl;
};

/**
 * Used in control flow for whether new logs should be collected.
 * The client will create buy-lines and then quickly remove them.
 * This function is used to ensure these do not trigger log collections.
 * @param logLine - The most recent line in the game-log;
 * @returns - Boolean for whether the most recent line is a
 */
const isLogEntryBuyWithoutGain = (logLine: string): boolean => {
  let isBuyWithoutGain: boolean;
  if (logLine.match(" buys ") !== null && logLine.match(" gains ") === null) {
    isBuyWithoutGain = true;
  } else {
    isBuyWithoutGain = false;
  }
  return isBuyWithoutGain;
};

export {
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
  getLogScrollContainerLogLines,
  isLogEntryBuyWithoutGain,
};
