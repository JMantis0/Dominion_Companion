import { it, describe, beforeEach, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function discardFromLibrary()", () => {
  let rDeck: Deck;
  let cardToBeDiscarded: string;
  let libraryBefore: string[];
  let libraryAfter: string[];
  let gyBefore: string[];
  let gyAfter: string[];
  describe("when given a card that is in the library field array", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      cardToBeDiscarded = rDeck.getEntireDeck()[0];
      libraryBefore = rDeck.getLibrary().slice();
      gyBefore = rDeck.getGraveyard().slice();
      rDeck.discardFromLibrary(cardToBeDiscarded);
      libraryAfter = rDeck.getLibrary().slice();
      gyAfter = rDeck.getGraveyard().slice();
    });
    it("should add an instance of the card to the graveyard field array", () => {
      expect(gyBefore.concat([cardToBeDiscarded]).sort()).toStrictEqual(
        gyAfter.sort()
      );
    });
    it("should remove an instance of the card from the library field array", () => {
      expect(libraryAfter.concat([cardToBeDiscarded]).sort()).toStrictEqual(
        libraryBefore.sort()
      );
    });
  });
  describe("when given a card that is not in the library field array", () => {
    let rDeck = createRandomDeck();
    let cardToBeDiscarded = "Joker";
    it("should throw an Error", () => {
      expect(() => rDeck.discardFromLibrary(cardToBeDiscarded)).toThrow(Error);
    });
  });
});
