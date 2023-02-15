import { Deck } from "../src/model/deck";

export const getCountsFromArray = (
  decklistArray: Array<string>
): Map<string, number> => {
  const cardCountsMap = new Map<string, number>();
  decklistArray.forEach((card) => {
    if (cardCountsMap.has(card)) {
      cardCountsMap.set(card, cardCountsMap.get(card)! + 1);
    } else {
      cardCountsMap.set(card, 1);
    }
  });
  return cardCountsMap;
};

// generate a random deck to be used for testing purposes
export const createRandomDeck = (): Deck => {
  const rKingdom: string[] = createRandomKingdom();
  const rDeck = new Deck("rName", "rNick", rKingdom);

  let rLib = createRandomFieldArray(rKingdom);
  const initLib = rDeck.getLibrary();
  rDeck.setLibrary(initLib.concat(rLib));
  rLib = rDeck.getLibrary();
  const rGy = createRandomFieldArray(rKingdom);
  rDeck.setGraveyard(rGy);

  const rInPlay = createRandomFieldArray(rKingdom);
  rDeck.setInPlay(rInPlay);

  const rHand = createRandomFieldArray(rKingdom);
  rDeck.setHand(rHand);

  const rEntireDeck = rLib.concat(rGy).concat(rInPlay).concat(rHand);
  rDeck.setEntireDeck(rEntireDeck);

  const rTrash = createRandomFieldArray(rKingdom);
  rDeck.setTrash(rTrash);

  return rDeck;
};

/**
 * Takes an array and a member, and returns a number array
 * containing all the indices for the member in that array.
 * @param array - The given array.
 * @param member - The member to get indices for in the array.
 * @returns An array of numbers containing every index for which the
 * given member occurs in the array.
 */
export const getAllIndices = (array: string[], member: string) => {
  var indexes = [],
    i = -1;
  while ((i = array.indexOf(member, i + 1)) != -1) {
    indexes.push(i);
  }
  return indexes;
};

export const getCountOfCard = (array: string[], card: string) => {
  return getAllIndices(array, card).length;
};

/**
 * Given a random kingdom, generates a random library from that kingdom.
 * @param rKingdom - A random kingdom.
 */
export const createRandomFieldArray = (rKingdom: string[]) => {
  // for each card in the kingdom, generate a random number, and push that many
  // cards to the library.
  const rFArray: string[] = [];
  rKingdom.forEach((card) => {
    const max = 11;
    const min = 1;
    const rand = Math.floor(Math.random() * (max - min) + min);
    for (let i = 0; i < rand; i++) {
      rFArray.push(card);
    }
  });
  return rFArray;
};

/**
 * Generates a random kingdom array from the base cardset and returns it.
 * @returns A random kingdom of 10 random base cards plus the 7 supply cards.
 */
export const createRandomKingdom = (): string[] => {
  const rKingdom: string[] = [];
  // kingdom cards
  const kingdomPool = [
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
  ];

  // select ten cards at random from the kingdom pool

  for (let i = 0; i < 10; i++) {
    let poolSize;
    poolSize = kingdomPool.length;
    let pickIdx = Math.floor(Math.random() * poolSize);
    let pick = kingdomPool[pickIdx];
    rKingdom.push(pick);
    kingdomPool.splice(pickIdx, 1);
  }

  ["Copper", "Curse", "Estate", "Silver", "Duchy", "Gold", "Province"].forEach(
    (supplyCard) => rKingdom.push(supplyCard)
  );

  return rKingdom;
};
