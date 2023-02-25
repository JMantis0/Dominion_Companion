export type ErrorWithMessage = {
  message: string;
};

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

export const toErrorWithMessage = (maybeError: unknown): ErrorWithMessage => {
  if (isErrorWithMessage(maybeError)) return maybeError;
  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    
    return new Error(String(maybeError));
  }
};

export const getErrorMessage = (error: unknown) => {
  return toErrorWithMessage(error).message;
};

export const calculateDrawProbability = (
  cardAmount: number,
  libLength: number
): string => {
  let probability: string;
  if (libLength === 0) {
    probability = "0%";
  } else {
    probability = ((cardAmount / libLength) * 100).toFixed(1).toString() + "%";
  }
  return probability;
};

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

export type CardCounts = {
  entireDeckCount: number;
  zoneCount: number;
};
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

export type SplitMaps = {
  treasures: Map<string, CardCounts> | undefined;
  actions: Map<string, CardCounts> | undefined;
  victories: Map<string, CardCounts> | undefined;
};

export const splitCombinedMapsByCardTypes = (
  combinedMap: Map<string, CardCounts>
): SplitMaps => {
  let tMap: Map<string, CardCounts> = new Map();
  let aMap: Map<string, CardCounts> = new Map();
  let vMap: Map<string, CardCounts> = new Map();
  let splitMaps: SplitMaps = {
    treasures: tMap,
    actions: aMap,
    victories: vMap,
  };

  Array.from(combinedMap.entries()).forEach((entry) => {
    const [card, CardCounts] = entry;
    if (["Copper", "Silver", "Gold"].indexOf(card) >= 0) {
      tMap.set(card, CardCounts);
    } else if (["Estate", "Duchy", "Gardens", "Province"].indexOf(card) >= 0) {
      vMap.set(card, CardCounts);
    } else {
      aMap.set(card, CardCounts);
    }
  });

  return splitMaps;
};

export const createEmptySplitMapsObject = (): SplitMaps => {
  let aMap: Map<string, CardCounts> = new Map();
  let tMap: Map<string, CardCounts> = new Map();
  let vMap: Map<string, CardCounts> = new Map();
  aMap.set("None", { zoneCount: 0, entireDeckCount: 0 });
  tMap.set("None", { zoneCount: 0, entireDeckCount: 0 });
  vMap.set("None", { zoneCount: 0, entireDeckCount: 0 });
  let emptySplitMap: SplitMaps = {
    treasures: tMap,
    actions: aMap,
    victories: vMap,
  };
  return emptySplitMap;
};

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

export const sortTheView = (
  sortParam: "card" | "owned" | "zone" | "probability",
  unsortedMap: Map<string, CardCounts>,
  sortType: "ascending" | "descending"
): Map<string, CardCounts> => {
  const mapCopy = new Map(unsortedMap);
  const sortedMap: Map<string, CardCounts> = new Map();
  switch (sortParam) {
    case "probability":
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
      throw new Error("Invalid sort category");
    }
  }
  return sortedMap;
};
