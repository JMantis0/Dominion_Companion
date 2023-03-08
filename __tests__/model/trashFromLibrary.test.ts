import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function trashFromLibrary()", () => {
  let rDeck: Deck;
  let cardToTrash: string;
  let libBefore: string[];
  let libraryAfter: string[];
  let trashBefore: string[];
  let trashAfter: string[];
  describe("When given a card that is in the library field array", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      cardToTrash = rDeck.getEntireDeck()[0];
      libBefore = rDeck.getLibrary().slice();
      trashBefore = rDeck.getTrash().slice();
      rDeck.trashFromLibrary(cardToTrash);
      libraryAfter = rDeck.getLibrary().slice();
      trashAfter = rDeck.getTrash().slice();
    });
    it("should remove one instance of the card from the library field array", () => {
      expect(libraryAfter.concat([cardToTrash]).sort()).toStrictEqual(
        libBefore.sort()
      );
    });
    it("should add one instance of the card to the trash field array", () => {
      expect(trashBefore.concat([cardToTrash]).sort()).toStrictEqual(
        trashAfter.sort()
      );
    });
    describe("when given a card that is not in the library", () => {
      beforeEach(() => {
        rDeck = createRandomDeck();
        cardToTrash = "Joker";
      });
      it("should throw an error", () => {
        expect(() => rDeck.trashFromLibrary(cardToTrash)).toThrow(Error);
      });
    });
  });
});
