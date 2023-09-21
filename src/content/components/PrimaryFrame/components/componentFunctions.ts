import { Deck } from "../../../../model/deck";
import { OpponentDeck } from "../../../../model/opponentDeck";
import { StoreDeck } from "../../../../model/storeDeck";

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
const sortTheView = (
  sortParam: "card" | "owned" | "zone" | "probability" | "hyper1",
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

function product_Range(a: number, b: number): number {
  var prd = a,
    i = a;

  while (i++ < b) {
    prd *= i;
  }
  return prd;
}

function combinations(n: number, r: number): number {
  if (n == r || r == 0) {
    return 1;
  } else {
    r = r < n - r ? n - r : r;
    return product_Range(r + 1, n) / product_Range(1, n - r);
  }
}
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

  // console.log("Checking cumulativeHyperGeo Params values: ")
  // console.log("populationSize", populationSize)
  // console.log("populationSuccesses", populationSuccesses)
  // console.log("sampleSize", sampleSize)
  // console.log("sampleSuccesses", sampleSuccesses)
  for (let i = sampleSuccesses; i <= sampleSize; i++) {
    // console.log("******")
    // console.log(getHyperGeometricProbability(populationSize,sampleSize,populationSuccesses,i))
    // console.log("******")
    try {
      cumulativeProb += getHyperGeometricProbability(
        populationSize,
        sampleSize,
        populationSuccesses,
        i
      );
    } catch (e: any) {
      console.log("There was an error: ", e.message);
    }
  }
  return cumulativeProb;
};

const getProb = (
  cardName: string,
  library: string[],
  graveyard: string[],
  successCount: number,
  drawCount: number
): { hyperGeo: number; cumulative: number } => {
  // console.log("getProb()");
  let probability: number = 0;
  let cumProb: number = 0;
  // hyperGeometric values are set up here
  const populationSize: number = library.length;
  const populationSuccesses: number = getCountsFromArray(library).has(cardName)
    ? getCountsFromArray(library).get(cardName)!
    : 0;
  const sampleSize: number = drawCount;
  const sampleSuccesses = successCount;
  if (library.length === 0 && graveyard.length === 0) {
  } else if (sampleSize <= library.length) {
    try {
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
    } catch (e: any) {
      console.log("There was an error:", e.message);
    }
    // cumProb = cumulativeHyperGeo()
  } else if (sampleSize > library.length) {
    // Here the whole library is drawn and the hypergeometric probability comes from what is in the graveyard.

    const libraryProb = getHyperGeometricProbability(
      populationSize,
      populationSuccesses,
      library.length, // not using drawCount here.
      sampleSuccesses
    );
    const libraryCumProb = cumulativeHyperGeo(
      populationSize,
      populationSuccesses,
      library.length,
      sampleSuccesses
    );
    // console.log("drawCount exceeds library size.  Looking into graveyard");
    const gyPopulationSize: number = graveyard.length;
    const gyPopulationSuccesses: number = getCountsFromArray(graveyard).has(
      cardName
    )
      ? getCountsFromArray(graveyard)!.get(cardName)!
      : 0;
    const gySampleSize = sampleSize - populationSize;
    const gySampleSuccesses = sampleSuccesses - populationSuccesses;
    // // console.log(
    //   "Draws greater than library length." +
    //     ` N is now ${gyPopulationSize}. k is now ${gyPopulationSuccesses}. n is now ${gySampleSize}.  x is now ${gySampleSuccesses}`
    // );
    try {
      if (libraryCumProb < 1) {
        cumProb =
          cumulativeHyperGeo(
            gyPopulationSize,
            gyPopulationSuccesses,
            gySampleSize,
            gySampleSuccesses
          ) + libraryCumProb;
      } else if (libraryCumProb === 1) {
        cumProb = 1;
      }
      probability = getHyperGeometricProbability(
        gyPopulationSize,
        gyPopulationSuccesses,
        gySampleSize,
        gySampleSuccesses
      );
    } catch (e: any) {
      console.log("There was an error:", e.message);
    }
  } else {
    console.log("drawCount", drawCount);
    console.log("library lengt", library.length);
    throw new Error("invalid hypergeometric.");
  }
  return {
    hyperGeo: Math.round(probability * 10000) / 10000,
    cumulative: Math.round(cumProb * 10000) / 10000,
  };
};

const padLeft = (unpadded: string | number, length: number): string => {
  if (typeof unpadded !== "string") {
    unpadded = unpadded.toString();
  }

  const pad = " ".repeat(length - unpadded.length);

  return pad + unpadded;
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
  sortTheView,
  sortTheHistoryDeckView,
  sortZoneView,
  getRowColor,
  getResult,
  getProb,
};
