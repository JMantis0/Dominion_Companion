import { Deck } from "../../../../model/deck";
import { OpponentDeck } from "../../../../model/opponentDeck";
import { StoreDeck } from "../../../../model/storeDeck";

export type ErrorWithMessage = {
  message: string;
};

/**
 * A helper function that determines if the given error has a message property.
 * @param error  An error
 * @returns
 */
export const isErrorWithMessage = (
  error: unknown
): error is ErrorWithMessage => {
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
export const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
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
export const getErrorMessage = (error: unknown) => {
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
export const calculateDrawProbability = (
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
export const getCountsFromArray = (
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
 * Custom object literal type.  One property holds value for the total amount of cards
 * owned.  The other property holds the value for the amount of that card in a specific
 * zone.
 */
export type CardCounts = {
  entireDeckCount: number;
  zoneCount: number;
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
export const combineDeckListMapAndZoneListMap = (
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
 * Custom object literal type, an object with 4 properties, each a Map<string,CardCounts object,
 * one for each card type: Treasure, Action, Victory, Curse
 */
export type SplitMaps = {
  treasures: Map<string, CardCounts> | undefined;
  actions: Map<string, CardCounts> | undefined;
  victories: Map<string, CardCounts> | undefined;
  curses: Map<string, CardCounts> | undefined;
};

/**
 * Function takes a Map<string,CardCounts> and splits it into 3 maps, separated by the 4 card types.
 * @param combinedMap - A Map<string,CardCounts>
 * @returns - And object literal with 4 properties, the values of which are Map<string,CardCounts> for each card type.
 */
export const splitCombinedMapsByCardTypes = (
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
export const createEmptySplitMapsObject = (): SplitMaps => {
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
export const sortByAmountInZone = (
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
export const sortTheView = (
  sortParam: "card" | "owned" | "zone" | "probability",
  unsortedMap: Map<string, CardCounts>,
  sortType: "ascending" | "descending",
  pd: StoreDeck
): Map<string, CardCounts> => {
  const mapCopy = new Map(unsortedMap);
  const sortedMap: Map<string, CardCounts> = new Map();
  switch (sortParam) {
    case "probability":
      {
        if (pd.library.length > 0) {
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
        } else {
          // if the library is empty, calculate the next draw based on values from the discard pile
          [...mapCopy.entries()]
            .sort((entryA, entryB) => {
              const entryAProb = parseFloat(
                calculateDrawProbability(
                  unsortedMap.get(entryA[0])?.zoneCount!,
                  pd.library.length,
                  getCountsFromArray(pd.graveyard).get(entryA[0])!,
                  pd.graveyard.length
                ).slice(0, -1)
              );

              const entryBProb = parseFloat(
                calculateDrawProbability(
                  unsortedMap.get(entryB[0])?.zoneCount!,
                  pd.library.length,
                  getCountsFromArray(pd.graveyard).get(entryB[0])!,
                  pd.graveyard.length
                ).slice(0, -1)
              );
              if (sortType === "ascending") {
                return entryBProb - entryAProb;
              } else {
                return entryAProb - entryBProb;
              }
            })
            .forEach((entry) => {
              const [card, cardCounts] = entry;
              sortedMap.set(card, cardCounts);
            });
        }
      }
      break;
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
export const sortZoneView = (
  sortParam: "card" | "zone" | "probability" | "owned",
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
export const getRowColor = (cardName: string): string => {
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
export const getResult = (
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
