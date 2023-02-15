import { describe, it, expect } from "@jest/globals";
import { createRandomDeck, getCountOfCard } from "../testUtilFuncs";

describe("Function addCardToEntireDeck()", () => {
  describe("when given a card", () => {
    it("should add that card to the entireDeck field", () => {
      const rDeck = createRandomDeck();
      const cardToAdd = "Ace";
      const numberOfAcesBefore = getCountOfCard(
        rDeck.getEntireDeck(),
        cardToAdd
      );
      rDeck.addCardToEntireDeck(cardToAdd);
      const numberOfAcesAfter = getCountOfCard(
        rDeck.getEntireDeck(),
        cardToAdd
      );
      expect(numberOfAcesBefore).toEqual(numberOfAcesAfter - 1);
    });
  });
});
