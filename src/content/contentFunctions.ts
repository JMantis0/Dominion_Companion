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
    throw new Error(`Error in getKingdom() ${e}`);
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
};
