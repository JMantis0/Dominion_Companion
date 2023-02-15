import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck, getCountOfCard } from "../testUtilFuncs";

describe("Function draw()", () => {
  let rDeck: Deck;
  let cardToDraw: string;
  beforeEach(() => {
    rDeck = createRandomDeck();
    cardToDraw = rDeck.getLibrary()[0];
  });
  describe("when given a card that is in the library", () => {
    it("should remove the card from the library and place it in the hand", () => {
      const acesInHandBefore = getCountOfCard(rDeck.getHand(), cardToDraw);
      const acesInLibraryBefore = getCountOfCard(
        rDeck.getLibrary(),
        cardToDraw
      );
      rDeck.draw(cardToDraw);
      const acesInLibraryAfter = getCountOfCard(rDeck.getLibrary(), cardToDraw);
      const acesInHandAfter = getCountOfCard(rDeck.getHand(), cardToDraw);

      expect(acesInHandAfter).toEqual(acesInHandBefore + 1);
      expect(acesInLibraryAfter).toEqual(acesInLibraryBefore - 1);
    });
  });

  describe("when given a card that is not in the library", () => {
    it("should thrown an error", () => {
      const spy = jest.spyOn(rDeck, "draw");
      expect(() => rDeck.draw("Spade")).toThrow(Error);
      expect(spy).toHaveBeenCalled();
    });
  });
});
