import { Deck } from "../model/deck";

/*
Used to check if the current dom has a log present.  If not, the player isn't in a game.
*/
const isGameLogPresent = (): boolean => {
  const gameLogElementCollection = document.getElementsByClassName("game-log");
  const gameLogElementCount = gameLogElementCollection.length;
  const gameLogPresent = gameLogElementCount > 0;
  return gameLogPresent;
};

/*
Used to extract the entire game log from the dom and returns it as a string
*/
const getGameLog = (): string => {
  const gameLogElement = document.getElementsByClassName(
    "game-log"
  )[0] as HTMLElement;
  const gameLog = gameLogElement.innerText;
  return gameLog;
};

/*
Used to check if the player-info elements are present
*/
const arePlayerInfoElementsPresent = (): boolean => {
  const playerElements = document.getElementsByTagName(
    "player-info-name"
  ) as HTMLCollectionOf<HTMLElement>;
  const playerElementsPresent = playerElements.length > 0;
  return playerElementsPresent;
};

/*Used to get the player-info elements that are used to determine player name and opponent
 */
const getPlayerInfoElements = (): HTMLCollectionOf<HTMLElement> => {
  const playerInfoElements: HTMLCollectionOf<HTMLElement> =
    document.getElementsByTagName(
      "player-info"
    ) as HTMLCollectionOf<HTMLElement>;

  return playerInfoElements;
};

/*
This function takes the <player-info> elements and returns which playername is Player and which is Opponent.
The elements css positions are compared to determine name assignment.
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

/*
Given the game-log and playerNames, this function returns the player name abbreviations.
*/
const getPlayerNameAbbreviations = (
  gameLog: string,
  playerNames: Array<string>
): Array<string> => {
  let playerNameAbbreviation: string;
  let opponentNameAbbreviation: string;
  const gameLogArr = gameLog.split("\n");

  // n1 player is the player going first.
  const n1 = gameLogArr[4].split(" ")[0];
  const n2 = gameLogArr[6].split(" ")[0];

  // first element of playerName is the player (not opponent)
  if (playerNames[0].substring(0, n1.length) == n1) {
    playerNameAbbreviation = n1;
    opponentNameAbbreviation = n2;
  } else {
    playerNameAbbreviation = n2;
    opponentNameAbbreviation = n1;
  }

  return [playerNameAbbreviation, opponentNameAbbreviation];
};

const isKingdomElementPresent = (): boolean => {
  let kingdomPresent: boolean;
  kingdomPresent =
    document.getElementsByClassName("kingdom-viewer-group").length > 0;
  return kingdomPresent;
};

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

const createPlayerDecks = (
  playerNames: Array<string>,
  abbreviatedNames: Array<string>,
  kingdom: Array<string>
): Map<string, Deck> => {
  let deckMap: Map<string, Deck> = new Map();
  playerNames.forEach((player, idx) => {
    deckMap.set(player, new Deck(player, abbreviatedNames[idx], kingdom));
  });
  return deckMap;
};

const areNewLogsToSend = (logsProcessed: string, gameLog: string): boolean => {
  let areNewLogs: boolean;
  const procArr = logsProcessed.split("\n");
  const gLogArr = gameLog.split("\n");
  // need lengths, and last lines.
  if (procArr.length > gLogArr.length) {
    throw new Error("Processed logs Larger than game log");
  } else if (procArr.length < gLogArr.length) {
    areNewLogs = true;
  } else if (procArr.pop() !== gLogArr.pop()) {
    areNewLogs = true;
  } else areNewLogs = false;

  return areNewLogs;
};

const isATreasurePlayLogEntry = (line: string): boolean => {
  let isATreasurePlay: boolean;
  isATreasurePlay =
    line.match(/Coppers?|Silvers?|Golds?/) !== null &&
    line.match("plays") !== null;
  return isATreasurePlay;
};

const getLastLogEntryOf = (logs: string): string => {
  let lastEntry: string;
  const logArray = logs.split("\n");
  const logLength = logArray.length;
  lastEntry = logArray.pop()!;
  if (!lastEntry) {
    throw new Error("Empty Log");
  }
  return lastEntry;
};

const getUndispatchedLogs = (
  logsDispatched: string,
  gameLog: string
): string => {
  let undispatchedLogs: string;
  const dispatchedArr = logsDispatched.split("\n");
  const gameLogArr = gameLog.split("\n");

  if (dispatchedArr.length > gameLogArr.length) {
    console.group("Game Logs vs Dispatched Logs");
    console.log("gameLog", gameLogArr);
    console.log("dispatchLog", dispatchedArr);
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

type SeperatedLogs = {
  playerLogs: string[];
  opponentLogs: string[];
  infoLogs: string[];
};
const separateUndispatchedDeckLogs = (
  undispatchedLogs: string,
  playerNomen: string
): SeperatedLogs => {
  console.log("playerNomen", playerNomen);
  let separatedLogs: SeperatedLogs;
  let entryArray = undispatchedLogs.split("\n");
  let opponentLogs: Array<string> = [];
  let infoLogs: Array<string> = [];
  const playerLogs = entryArray.filter((line) => {
    let include = false;
    if (
      line.match(/Card Pool|Game #|starts with |Turn /) != null ||
      line == ""
    ) {
      infoLogs.push(line);
    } else {
      const nomenLength = playerNomen.length;
      line.slice(0, nomenLength) === playerNomen
        ? (include = true)
        : opponentLogs.push(line);
    }
    return include;
  });
  separatedLogs = {
    playerLogs: playerLogs,
    opponentLogs: opponentLogs,
    infoLogs: infoLogs,
  };
  return separatedLogs;
};

const sendToFront = (deck: Deck, playerName: string) => {
  if ((deck.playerName = playerName)) {
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
};
