import { AnyAction, Dispatch } from "redux";
import { Deck } from "../../model/deck";
import { OpponentDeck } from "../../model/opponentDeck";
import { StoreDeck } from "../../model/storeDeck";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { OpponentStoreDeck } from "../../model/opponentStoreDeck";

export interface SavedGame {
  logArchive: string;
  playerDeck: StoreDeck;
  opponentDeck: OpponentStoreDeck;
  dateTime: string;
  logHtml: string;
}

export type SortCategories =
  | "card"
  | "zone"
  | "owned"
  | "probability"
  | "hyper5";

export type GameResult = "Victory" | "Defeat" | "Tie" | "Unfinished";

export interface SortButtonState {
  category: SortCategories;
  sort: "ascending" | "descending";
}

/**
 * Custom object literal type.  One property holds value for the total amount of cards
 * owned.  The other property holds the value for the amount of that card in a specific
 * zone.
 */
export type CardCounts = {
  entireDeckCount: number;
  zoneCount: number;
};

/**
 * Custom object literal type, an object with 4 properties, each a Map<string,CardCounts object,
 * one for each card type: Treasure, Action, Victory, Curse
 */
export type SplitMaps = {
  treasures: Map<string, CardCounts> | undefined;
  actions: Map<string, CardCounts> | undefined;
  victories: Map<string, CardCounts> | undefined;
  curses: Map<string, CardCounts> | undefined;
};

export type ErrorWithMessage = {
  message: string;
};
/**
 * Custom type for PrimaryFrameTab
 */
export type PrimaryFrameTabType = "Deck" | "Discard" | "Trash" | "Opponent";

/**
 * A helper function that determines if the given error has a message property.
 * @param error  An error
 * @returns
 */
const isErrorWithMessage = (error: unknown): error is ErrorWithMessage => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
};

/**
 * A helper function.  Takes an object that might be an error and if it doesn't have a message property creates
 * a new error with a message property based on the given object.
 * @param maybeError - The object that may be an error and may or may not have an error message.
 * @returns - An error with an error message property and value.
 */
const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
  if (isErrorWithMessage(maybeError)) return maybeError;
  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
};

/**
 * A helper function that gets an error message from an error, and if it doesn't have an error message,
 * assigns one based on the error itself.
 */
const getErrorMessage = (error: unknown) => {
  return toErrorWithMessage(error).message;
};

/**
 * Returns a string expressing the probability of the next draw being a certain card.  If
 * there are no cards in the library, it will calculate the probability from the cards in
 * the discard pile.
 * Purpose: Used by SortableViewer as a prop value for FullListCardRow.tsx
 * @param libAmount - The amount of that card in the deck.
 * @param libLength - The total amount of cards in the deck.
 * @param discAmount - The amount of that card in the discard pile.
 * @param discLength - The total amount of cards in the discard pile.
 * @returns A string expressing the probability as a percentage.
 */
const calculateDrawProbability = (
  libAmount: number,
  libLength: number,
  discAmount: number,
  discLength: number
): string => {
  let probability: string;
  if (libLength === 0) {
    if (discAmount === undefined) {
      probability = "0.0%";
    } else {
      probability =
        ((discAmount / discLength) * 100).toFixed(1).toString() + "%";
    }
  } else {
    probability = ((libAmount / libLength) * 100).toFixed(1).toString() + "%";
  }
  return probability;
};

/**
 * takes a given array of strings and creates a Map object that has a key for each unique
 * string in the array.  The values for each key are the number of instances that string occurs
 * in the array.
 * Purpose: Used by all viewer components.
 * @param deckListArray - An array of potentially non-unique strings
 * @returns - A Map<string, number> with the counts of strings occurring in the array.
 */
const getCountsFromArray = (
  deckListArray: Array<string>
): Map<string, number> => {
  const cardCountsMap = new Map<string, number>();
  deckListArray.forEach((card) => {
    if (cardCountsMap.has(card)) {
      cardCountsMap.set(card, cardCountsMap.get(card)! + 1);
    } else {
      cardCountsMap.set(card, 1);
    }
  });
  return cardCountsMap;
};

/**
 * Function takes takes two Map<string, number> objects and combines them into one Map<string,cardCounts
 * object, representing the total amount of each card owned by the player and the amount of each card in
 * a given zone.
 * Purpose: Used by View Components
 * @param deckListMap - A Map<string,number> of the counts of each card owned by a player
 * @param zoneListMap - A Map<string,number> of the counts of each card in a player's specific zone
 * @returns - a Map<string,CardCounts> object
 */
const combineDeckListMapAndZoneListMap = (
  deckListMap: Map<string, number>,
  zoneListMap: Map<string, number>
): Map<string, CardCounts> => {
  let newMap: Map<string, CardCounts> = new Map();

  Array.from(deckListMap.entries()).forEach((entry) => {
    let [card, deckAmount] = entry;
    let libCount: number;
    if (zoneListMap.has(card)) {
      libCount = zoneListMap.get(card)!;
    } else {
      libCount = 0;
    }

    let counts: CardCounts = {
      entireDeckCount: deckAmount,
      zoneCount: libCount,
    };

    newMap.set(card, counts);
  });
  return newMap;
};

/**
 * Function takes a Map<string,CardCounts> and splits it into 3 maps, separated by the 4 card types.
 * @param combinedMap - A Map<string,CardCounts>
 * @returns - And object literal with 4 properties, the values of which are Map<string,CardCounts> for each card type.
 */
const splitCombinedMapsByCardTypes = (
  combinedMap: Map<string, CardCounts>
): SplitMaps => {
  let tMap: Map<string, CardCounts> = new Map();
  let aMap: Map<string, CardCounts> = new Map();
  let vMap: Map<string, CardCounts> = new Map();
  let cMap: Map<string, CardCounts> = new Map();
  let splitMaps: SplitMaps = {
    treasures: tMap,
    actions: aMap,
    victories: vMap,
    curses: cMap,
  };

  Array.from(combinedMap.entries()).forEach((entry) => {
    const [card, CardCounts] = entry;
    if (["Copper", "Silver", "Gold"].indexOf(card) >= 0) {
      tMap.set(card, CardCounts);
    } else if (["Estate", "Duchy", "Gardens", "Province"].indexOf(card) >= 0) {
      vMap.set(card, CardCounts);
    } else if (card == "Curse") {
      cMap.set(card, CardCounts);
    } else {
      aMap.set(card, CardCounts);
    }
  });

  return splitMaps;
};

/**
 * Creates and returns an empty SplitMaps object to be used
 * as an initial state by the CategoryViewer
 * @returns An empty split maps object
 */
const createEmptySplitMapsObject = (): SplitMaps => {
  let aMap: Map<string, CardCounts> = new Map();
  let tMap: Map<string, CardCounts> = new Map();
  let vMap: Map<string, CardCounts> = new Map();
  let cMap: Map<string, CardCounts> = new Map();
  aMap.set("None", { zoneCount: 0, entireDeckCount: 0 });
  tMap.set("None", { zoneCount: 0, entireDeckCount: 0 });
  vMap.set("None", { zoneCount: 0, entireDeckCount: 0 });
  let emptySplitMap: SplitMaps = {
    treasures: tMap,
    actions: aMap,
    victories: vMap,
    curses: cMap,
  };
  return emptySplitMap;
};

/**
 * Deprecated, not currently being used
 * @param sortParam
 * @param unsortedMap
 * @returns
 */
const sortByAmountInZone = (
  sortParam: string,
  unsortedMap: Map<string, CardCounts>
): Map<string, CardCounts> => {
  const mapCopy = new Map(unsortedMap);
  const sortedMap: Map<string, CardCounts> = new Map();
  switch (sortParam) {
    case "probability":
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            return entryB[1].zoneCount - entryA[1].zoneCount;
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;
    default:
  }
  return sortedMap;
};

/**
 * Returns a sorted map.  Sorts by the sortParam and sortType.
 * @param sortParam - The category to sort on.
 * @param unsortedMap - The unsorted map.
 * @param sortType - Ascending or Descending.
 * @param pd - the player deck
 * @returns
 */
const sortMainViewer = (
  sortParam: SortCategories,
  unsortedMap: Map<string, CardCounts>,
  sortType: "ascending" | "descending",
  pd: StoreDeck,
  topCardsLookAmount: number,
  turn: "Current" | "Next"
): Map<string, CardCounts> => {
  const mapCopy = new Map(unsortedMap);
  const sortedMap: Map<string, CardCounts> = new Map();

  switch (sortParam) {
    case "probability":
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            if (sortType === "ascending") {
              if (entryB[1].zoneCount - entryA[1].zoneCount !== 0) {
                return entryB[1].zoneCount - entryA[1].zoneCount;
              } else {
                // If equal, sort by hyper geometric
                return (
                  getProb(pd, entryB[0], turn, 1, topCardsLookAmount)
                    .cumulative -
                  getProb(pd, entryA[0], turn, 1, topCardsLookAmount).cumulative
                );
              }
            } else {
              if (entryA[1].zoneCount - entryB[1].zoneCount !== 0) {
                return entryA[1].zoneCount - entryB[1].zoneCount;
              } else {
                return (
                  getProb(pd, entryA[0], turn, 1, topCardsLookAmount)
                    .cumulative -
                  getProb(pd, entryB[0], turn, 1, topCardsLookAmount).cumulative
                );
              }
            }
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
        // }
      }
      break;
    case "card":
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            let result: number;
            const card1 = entryA[0];
            const card2 = entryB[0];

            if (sortType === "ascending") {
              if (card1 > card2) {
                result = -1;
              } else if (card1 < card2) {
                result = 1;
              } else result = 0;
            } else {
              if (card1 < card2) {
                result = -1;
              } else if (card1 < card2) {
                result = 1;
              } else result = 0;
            }

            return result;
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;
    case "owned":
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            if (sortType === "ascending") {
              return entryB[1].entireDeckCount - entryA[1].entireDeckCount;
            } else {
              return entryA[1].entireDeckCount - entryB[1].entireDeckCount;
            }
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;
    case "zone":
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            if (sortType === "ascending") {
              return entryB[1].zoneCount - entryA[1].zoneCount;
            } else {
              return entryA[1].zoneCount - entryB[1].zoneCount;
            }
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;

    default: {
      throw new Error("Invalid sort category " + sortParam);
    }
  }
  return sortedMap;
};

/**
 * Returns a sorted map.  Sorts by the sortParam and sortType.
 * @param sortParam - The category to sort on.
 * @param unsortedMap - The unsorted map.
 * @param sortType - Ascending or Descending.
 * @param pd - the player deck
 * @returns
 */
const sortTheHistoryDeckView = (
  sortParam: "card" | "owned" | "zone" | "probability",
  unsortedMap: Map<string, CardCounts>,
  sortType: "ascending" | "descending"
): Map<string, CardCounts> => {
  const mapCopy = new Map(unsortedMap);
  const sortedMap: Map<string, CardCounts> = new Map();
  switch (sortParam) {
    // add cases for card, deckAmount, ownedAmount
    case "card":
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            let result: number;
            const card1 = entryA[0];
            const card2 = entryB[0];

            if (sortType === "ascending") {
              if (card1 > card2) {
                result = -1;
              } else if (card1 < card2) {
                result = 1;
              } else result = 0;
            } else {
              if (card1 < card2) {
                result = -1;
              } else if (card1 < card2) {
                result = 1;
              } else result = 0;
            }

            return result;
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;
    case "owned":
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            if (sortType === "ascending") {
              return entryB[1].entireDeckCount - entryA[1].entireDeckCount;
            } else {
              return entryA[1].entireDeckCount - entryB[1].entireDeckCount;
            }
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;
    case "zone":
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            if (sortType === "ascending") {
              return entryB[1].zoneCount - entryA[1].zoneCount;
            } else {
              return entryA[1].zoneCount - entryB[1].zoneCount;
            }
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;
    default: {
      throw new Error("Invalid sort category " + sortParam);
    }
  }
  return sortedMap;
};

/**
 * Sort function for ZoneViewer components.  Simpler than the SortableViewer Sort function
 * because Zone viewers do not have columns for probability or library.
 */
const sortZoneView = (
  sortParam: SortCategories,
  unsortedMap: Map<string, number>,
  sortType: "ascending" | "descending"
): Map<string, number> => {
  const mapCopy = new Map(unsortedMap);
  const sortedMap: Map<string, number> = new Map();

  switch (sortParam) {
    case "card":
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            let result: number;
            const card1 = entryA[0];
            const card2 = entryB[0];

            if (sortType === "ascending") {
              if (card1 > card2) {
                result = -1;
              } else if (card1 < card2) {
                result = 1;
              } else result = 0;
            } else {
              if (card1 < card2) {
                result = -1;
              } else if (card1 < card2) {
                result = 1;
              } else result = 0;
            }

            return result;
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;
    case "zone":
      {
        [...mapCopy.entries()]
          .sort((entryA, entryB) => {
            const cardAmount1 = entryA[1];
            const cardAmount2 = entryB[1];
            if (sortType === "ascending") {
              return cardAmount2 - cardAmount1;
            } else {
              return cardAmount1 - cardAmount2;
            }
          })
          .forEach((entry) => {
            const [card, cardCounts] = entry;
            sortedMap.set(card, cardCounts);
          });
      }
      break;
    default: {
      throw new Error("Invalid sort category " + sortParam);
    }
  }

  return sortedMap;
};

/**
 * Function that returns a tailwind utility class for text-color based on the card type.
 * @param cardName - The card name
 * @returns - Utility class for the color of the row.
 */
const getRowColor = (cardName: string): string => {
  let color;
  const actionClass: string = "text-[#fff5c7]";
  const victoryClass: string = "text-green-300";
  const treasureClass: string = "text-[#F4FF00]";
  const curseClass: string = "text-purple-400";
  const reactionClass: string = "text-[#6eccff]";
  const victories: string[] = ["Estate", "Duchy", "Province", "Gardens"];
  const treasures: string[] = ["Copper", "Silver", "Gold"];

  if (treasures.indexOf(cardName) > -1) {
    color = treasureClass;
  } else if (victories.indexOf(cardName) > -1) {
    color = victoryClass;
  } else if (cardName === "Curse") {
    color = curseClass;
  } else if (cardName === "Moat") {
    color = reactionClass;
  } else color = actionClass;
  return color;
};

/**
 * Gets the winner and loser of the game.
 * @param decks - the Map of participating decks.
 * @param playerName
 * @param opponentName
 * @param gameEndReason
 * @returns String array [victor, defeated]
 */
const getResult = (
  decks: Map<string, Deck | OpponentDeck>,
  playerName: string,
  opponentName: string,
  gameEndReason: string
): string[] => {
  let victor: string;
  let defeated: string;
  if (gameEndReason === `${playerName} has resigned.`) {
    victor = opponentName;
    defeated = playerName;
  } else if (gameEndReason === `${opponentName} has resigned.`) {
    victor = playerName;
    defeated = opponentName;
  } else if (
    decks.get(opponentName)!.currentVP < decks.get(playerName)!.currentVP
  ) {
    victor = playerName;
    defeated = opponentName;
  } else if (
    decks.get(opponentName)!.currentVP > decks.get(playerName)!.currentVP
  ) {
    victor = opponentName;
    defeated = playerName;
  } else if (
    decks.get(opponentName)!.gameTurn > decks.get(playerName)!.gameTurn
  ) {
    victor = playerName;
    defeated = opponentName;
  } else if (
    decks.get(opponentName)!.gameTurn < decks.get(playerName)!.gameTurn
  ) {
    victor = opponentName;
    defeated = playerName;
  } else {
    victor = "None: tie";
    defeated = "None: tie";
  }
  return [victor, defeated];
};

const product_Range = (a: number, b: number): number => {
  var prd = a,
    i = a;

  while (i++ < b) {
    prd *= i;
  }
  return prd;
};

const combinations = (n: number, r: number): number => {
  if (n == r || r == 0) {
    return 1;
  } else {
    r = r < n - r ? n - r : r;
    return product_Range(r + 1, n) / product_Range(1, n - r);
  }
};
const getHyperGeometricProbability = (
  populationSize: number,
  populationSuccesses: number,
  sampleSize: number,
  sampleSuccesses: number
): number => {
  let hyperGeometricProbability: number;

  /**
   * Hypergeometric formula has the following restrictions:
   * 0 <= x <= n
   * x <= k
   * n - x <= N - k
   *
   * Probability for any set of parameter values outside these restrictions have a probability of 0
   * The first 4 if/else below code in these restrictions.
   */
  if (!(0 <= sampleSuccesses)) {
    hyperGeometricProbability = 0;
    // throw new Error("Sample successes negative.")
  } else if (!(sampleSuccesses <= sampleSize)) {
    hyperGeometricProbability = 0;
    // throw new Error("Sample successes exceeds sample size.")
  } else if (!(sampleSuccesses <= populationSuccesses)) {
    hyperGeometricProbability = 0;
    // throw new Error("Sample successes exceeds population successes.")
  } else if (
    !(sampleSize - sampleSuccesses <= populationSize - populationSuccesses)
  ) {
    hyperGeometricProbability = 0;
    // throw new Error("Sample failures exceed population failures.")
  } else {
    hyperGeometricProbability =
      (combinations(populationSuccesses, sampleSuccesses) *
        combinations(
          populationSize - populationSuccesses,
          sampleSize - sampleSuccesses
        )) /
      combinations(populationSize, sampleSize);
  }
  return hyperGeometricProbability;
};

const cumulativeHyperGeo = (
  populationSize: number,
  populationSuccesses: number,
  sampleSize: number,
  sampleSuccesses: number
): number => {
  let cumulativeProb: number = 0;

  for (let i = sampleSuccesses; i <= sampleSize; i++) {
    try {
      cumulativeProb += getHyperGeometricProbability(
        populationSize,
        sampleSize,
        populationSuccesses,
        i
      );
    } catch (e: any) {
      console.error("There was an error: ", e.message);
    }
  }
  return cumulativeProb;
};

const getProb = (
  deck: StoreDeck,
  cardName: string,
  turn: "Current" | "Next",
  successCount: number,
  drawCount: number
): { hyperGeo: number; cumulative: number } => {
  let probability: number = 0;
  let cumProb: number = 0;
  let secondDrawPool: string[] =
    turn === "Current"
      ? deck.graveyard
      : deck.graveyard.concat(deck.hand, deck.inPlay, deck.setAside);

  const populationSize: number = deck.library.length;
  const populationSuccesses: number = getCountsFromArray(deck.library).has(
    cardName
  )
    ? getCountsFromArray(deck.library).get(cardName)!
    : 0;
  const sampleSize: number = drawCount;
  const sampleSuccesses = successCount;
  if (deck.library.length === 0 && secondDrawPool.length === 0) {
  } else if (sampleSize <= deck.library.length) {
    probability = getHyperGeometricProbability(
      populationSize,
      populationSuccesses,
      sampleSize,
      sampleSuccesses
    );
    cumProb = cumulativeHyperGeo(
      populationSize,
      populationSuccesses,
      sampleSize,
      sampleSuccesses
    );
  } else if (sampleSize > deck.library.length) {
    const libraryCumProb = cumulativeHyperGeo(
      populationSize,
      populationSuccesses,
      deck.library.length,
      sampleSuccesses
    );
    const secondPoolPopulationSize: number = secondDrawPool.length;
    const secondPoolPopulationSuccesses: number = getCountsFromArray(
      secondDrawPool
    ).has(cardName)
      ? getCountsFromArray(secondDrawPool)!.get(cardName)!
      : 0;
    const secondPoolSampleSize = sampleSize - populationSize;
    const secondPoolSampleSuccesses = sampleSuccesses - populationSuccesses;
    if (libraryCumProb < 1) {
      cumProb =
        cumulativeHyperGeo(
          secondPoolPopulationSize,
          secondPoolPopulationSuccesses,
          secondPoolSampleSize,
          secondPoolSampleSuccesses
        ) + libraryCumProb;
    } else if (libraryCumProb === 1) {
      cumProb = 1;
    }
    probability = getHyperGeometricProbability(
      secondPoolPopulationSize,
      secondPoolPopulationSuccesses,
      secondPoolSampleSize,
      secondPoolSampleSuccesses
    );
  } else {
    console.error("drawCount", drawCount);
    console.error("library length", deck.library.length);
    throw new Error("invalid hypergeometric.");
  }
  return {
    hyperGeo: Math.round(probability * 10000) / 10000,
    cumulative: Math.round(cumProb * 10000) / 10000,
  };
};

const stringifyProbability = (probabilityFloat: number): string => {
  return (probabilityFloat * 100).toFixed(1) + "%";
};

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
 * @returns The string of innerText of the game-log element.
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
 * Used by viewer
 * @returns HTMLCollection<HTMLElement> of <player-info-elements>:
 */
const getPlayerInfoElements = (): HTMLCollectionOf<HTMLElement> => {
  const playerInfoElements: HTMLCollectionOf<HTMLElement> =
    document.getElementsByTagName(
      "player-info"
    ) as HTMLCollectionOf<HTMLElement>;

  return playerInfoElements;
};

/**
 * Returns the <player-info> element for the player.
 * @param playerInfoElements - the collection of all <player-info> elements
 * @returns - The <player-info> element for the non-opponent player.
 */
const getHeroPlayerInfoElement = (
  playerInfoElements: HTMLCollectionOf<HTMLElement>
): HTMLElement | undefined => {
  let heroPlayerInfoEl: HTMLElement;
  const transformElementMap: Map<number, HTMLElement> = new Map();
  for (let element of playerInfoElements) {
    const transform: string = element.style.transform;
    const yTransForm: number = parseFloat(
      transform.split(" ")[1].replace("translateY(", "").replace("px)", "")
    );
    transformElementMap.set(yTransForm, element);
  }

  heroPlayerInfoEl = [...transformElementMap.entries()].reduce((prev, curr) => {
    return prev[0] > curr[0] ? prev : curr;
  })[1];

  return heroPlayerInfoEl;
};

/**
 * Gets the <player-info-name> elements from the DOM, and compares their
 * css properties to determine which contains the player name and which
 * Contains the opponentName, then returns those names.
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
  //  Compare the yTransform values.  The greatest one gets assigned to player.
  playerName = [...nameTransformMap.entries()].reduce((prev, current) => {
    return prev[1] > current[1] ? prev : current;
  })[0];
  opponentName = [...nameTransformMap.entries()].reduce((prev, current) => {
    return prev[1] < current[1] ? prev : current;
  })[0];

  // similarly, we can assign the elements to reference variables...

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
  let n1: string;
  let n2: string;

  let i: number = 0;

  for (i; i < gameLogArr.length; i++) {
    if (gameLogArr[i].match(" starts with ") !== null) {
      break;
    }
  }
  n1 = gameLogArr[i].split(" ")[0]; // n1 player is the player going first.
  n2 = gameLogArr[i + 2].split(" ")[0];

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
 * Checks to see if the game is rated or unrated.
 * @param firstGameLogLine - First log entry of the game log.
 * @returns - Boolean for whether the game is rated or unrated.
 */
const getRatedGameBoolean = (firstGameLogLine: string): boolean => {
  let ratedGame: boolean;
  if (firstGameLogLine.match(/ rated\./) !== null) {
    ratedGame = true;
  } else if (firstGameLogLine.match(/ unrated\./) !== null) {
    ratedGame = false;
  } else {
    throw new Error("Invalid firstGameLogLine " + firstGameLogLine);
  }
  return ratedGame;
};

/**
 * Gets the player ratings for rated games and returns them.
 * @param playerName
 * @param opponentName
 * @param gameLog
 * @returns - An array of the player ratings.
 * To do - make it work for multiple opponents.
 */
const getPlayerRatings = (
  playerName: string,
  opponentName: string,
  gameLog: string
): string[] => {
  let playerRating: string = "Rating Not Found";
  let opponentRating: string = "Rating Not Found";
  let logArray = gameLog.split("\n");
  for (let i = 0; i < logArray.length; i++) {
    const entry = logArray[i];
    if (entry.match(playerName + ": ") !== null) {
      playerRating = entry.substring(entry.lastIndexOf(" ") + 1);
    } else if (entry.match(opponentName + ": ") !== null) {
      opponentRating = entry.substring(entry.lastIndexOf(" ") + 1);
    }
  }

  return [playerRating, opponentRating];
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
 * Gets the kingdom-viewer-group element from the DOM and iterates through the
 * name-layer elements within it.  Extracts the innerText of each name-layer and
 * pushes it to an array of strings.  Then adds default strings to the array, and
 * returns the array.
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
 * Creates a Deck map object, and creates a Deck instance for the player and
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
  gameTitle: string,
  ratedGame: boolean,
  playerName: string,
  playerNick: string,
  playerRating: string,
  opponentName: string,
  opponentNick: string,
  opponentRating: string,
  kingdom: Array<string>
): Map<string, Deck | OpponentDeck> => {
  let deckMap: Map<string, Deck | OpponentDeck> = new Map();

  deckMap.set(
    playerName,
    new Deck(
      gameTitle,
      ratedGame,
      playerRating,
      playerName,
      playerNick,
      kingdom
    )
  );
  deckMap.set(
    opponentName,
    new OpponentDeck(
      gameTitle,
      ratedGame,
      opponentRating,
      opponentName,
      opponentNick,
      kingdom
    )
  );
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
  // remove premoves
  if (gLogArr[gLogArr.length - 1].match("Premoves") !== null) {
    gLogArr.pop();
  }

  const lastGameLogEntry = gLogArr.slice().pop();

  if (isLogEntryBuyWithoutGain(lastGameLogEntry!)) {
    areNewLogs = false;
  } else if (procArr.length > gLogArr.length) {
    areNewLogs = true;
    throw new Error("Processed logs Larger than game log");
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
  if (gameLogArr[gameLogArr.length - 1].match("Premoves") !== null) {
    gameLogArr.pop();
  }
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
 * Used by decks to eliminate ambiguity for certain Vassal activity.
 * @returns - A collection of all the div's in the log-scroll-container with the class 'log-line'
 */
const getLogScrollContainerLogLines = (): HTMLCollectionOf<HTMLElement> => {
  let scrollEl: Element;
  let logLineCollection: HTMLCollectionOf<HTMLElement>;

  scrollEl = document.getElementsByClassName("log-scroll-container")[0];
  if (scrollEl == undefined) throw new Error("Element is undefined");
  logLineCollection = scrollEl.getElementsByClassName(
    "log-line"
  ) as HTMLCollectionOf<HTMLElement>;
  return logLineCollection;
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

const baseKingdomCardCheck = (kingdom: string[]): boolean => {
  let baseOnly: boolean = true;

  const baseCards = [
    "Cellar",
    "Chapel",
    "Moat",
    "Harbinger",
    "Merchant",
    "Vassal",
    "Village",
    "Workshop",
    "Bureaucrat",
    "Gardens",
    "Militia",
    "Moneylender",
    "Poacher",
    "Remodel",
    "Smithy",
    "Throne Room",
    "Bandit",
    "Council Room",
    "Festival",
    "Laboratory",
    "Library",
    "Market",
    "Mine",
    "Sentry",
    "Witch",
    "Artisan",
    "Copper",
    "Silver",
    "Gold",
    "Province",
    "Duchy",
    "Estate",
    "Curse",
  ];

  for (let i = 0; i < kingdom.length; i++) {
    if (!baseCards.includes(kingdom[i])) {
      baseOnly = false;
    }
  }

  return baseOnly;
};

const chromeListenerUseEffectHandler = (
  add: "Add" | "Remove",
  hidden: boolean,
  dispatch: Dispatch<AnyAction>,
  setViewerHidden: ActionCreatorWithPayload<boolean, "content/setViewerHidden">
) => {
  const chromeMessageListener = (
    request: { command: string },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: { message: string }) => void
  ) => {
    sender;
    let response: { message: string } = { message: "" };
    if (request.command === "appendDomRoot") {
      dispatch(setViewerHidden(false));
      response.message = "Successfully turned on.";
    } else if (request.command === "removeDomRoot") {
      dispatch(setViewerHidden(true));
      response.message = "Successfully turned off.";
    } else if (request.command === "sendHiddenState") {
      response.message = hidden ? "Hidden state is ON" : "Hidden state is OFF";
    } else {
      response.message = "Invalid Request";
    }
    sendResponse(response);
  };

  if (add === "Add") {
    chrome.runtime.onMessage.addListener(chromeMessageListener);
  } else if (add === "Remove") {
    chrome.runtime.onMessage.removeListener(chromeMessageListener);
  }
};

const primaryFrameTabClick = (
  tabName: PrimaryFrameTabType,
  dispatch: Dispatch<AnyAction>,
  setPrimaryFrameTab: ActionCreatorWithPayload<
    PrimaryFrameTabType,
    "content/setPrimaryFrameTab"
  >,
  setPinnedPrimaryFrameTab: ActionCreatorWithPayload<
    PrimaryFrameTabType,
    "content/setPinnedPrimaryFrameTab"
  >
) => {
  dispatch(setPrimaryFrameTab(tabName));
  dispatch(setPinnedPrimaryFrameTab(tabName));
};

const primaryFrameTabMouseEnter = (
  tabName: PrimaryFrameTabType,
  dispatch: Dispatch<AnyAction>,
  setPrimaryFrameTab: ActionCreatorWithPayload<
    PrimaryFrameTabType,
    "content/setPrimaryFrameTab"
  >
) => {
  dispatch(setPrimaryFrameTab(tabName));
};

const primaryFrameTabMouseLeave = (
  pinnedPrimaryFrameTab: PrimaryFrameTabType,
  dispatch: Dispatch<AnyAction>,
  setPrimaryFrameTab: ActionCreatorWithPayload<
    PrimaryFrameTabType,
    "content/setPrimaryFrameTab"
  >
) => {
  dispatch(setPrimaryFrameTab(pinnedPrimaryFrameTab));
};

export {
  isErrorWithMessage,
  toErrorWithMessage,
  getErrorMessage,
  calculateDrawProbability,
  getCountsFromArray,
  combineDeckListMapAndZoneListMap,
  splitCombinedMapsByCardTypes,
  createEmptySplitMapsObject,
  sortByAmountInZone,
  sortMainViewer,
  sortTheHistoryDeckView,
  sortZoneView,
  getRowColor,
  getResult,
  getProb,
  stringifyProbability,
  isGameLogPresent,
  getGameLog,
  arePlayerInfoElementsPresent,
  getPlayerInfoElements,
  getHeroPlayerInfoElement,
  getPlayerAndOpponentNameByComparingElementPosition,
  getPlayerNameAbbreviations,
  getRatedGameBoolean,
  getPlayerRatings,
  isKingdomElementPresent,
  getKingdom,
  createPlayerDecks,
  areNewLogsToSend,
  isATreasurePlayLogEntry,
  getUndispatchedLogs,
  getLogScrollContainerLogLines,
  isLogEntryBuyWithoutGain,
  baseKingdomCardCheck,
  chromeListenerUseEffectHandler,
  primaryFrameTabClick,
  primaryFrameTabMouseEnter,
  primaryFrameTabMouseLeave,
};
