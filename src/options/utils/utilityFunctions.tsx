import { Deck } from "../../model/deck";
export const getCountsFromArray = (
  decklistArray: Array<string>
): Map<string, number> => {
  const cardCountsMap = new Map<string, number>();
  decklistArray.forEach((card) => {
    if (cardCountsMap.has(card)) {
      cardCountsMap.set(card, cardCountsMap.get(card) + 1);
    } else {
      cardCountsMap.set(card, 1);
    }
  });
  return cardCountsMap;
};

export const createDeckFromJSON = (JSONstring: string): Deck => {
  const deckObject = JSON.parse(JSONstring);
  const deck = new Deck(
    deckObject.playerName,
    deckObject.abbrvName,
    deckObject.kingdom
  );
  deck.setCurrentVP(deckObject.setCurrentVP);
  // deck.setKingdom(deckObject.kingdom);
  deck.setLibrary(deckObject.library);
  deck.setGraveyard(deckObject.graveyard);
  deck.setInPlay(deckObject.inPlay);
  deck.setHand(deckObject.hand);
  deck.setTrash(deckObject.trash);
  deck.setLogArchive(deckObject.logArchive);
  deck.setDOMlog(deckObject.DOMLog);
  deck.setEntireDeck(deckObject.entireDeck);

  return deck;
};
