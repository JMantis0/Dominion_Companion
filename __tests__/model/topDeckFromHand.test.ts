import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function topDeckFromHand()", () => {
  let rDeck: Deck;

  let cardToBeTopDecked: string;
  let handBefore: string[];
  let libraryBefore: string[];
  let handAfter: string[];
  let libraryAfter: string[];
  describe("given a card that is in the hand field array", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      cardToBeTopDecked = rDeck.getEntireDeck()[0];
      handBefore = rDeck.getHand().slice();
      libraryBefore = rDeck.getLibrary().slice();
      rDeck.topDeckFromHand(cardToBeTopDecked);
      handAfter = rDeck.getHand().slice();
      libraryAfter = rDeck.getLibrary().slice();
    });
    it("should take the given card and remove one instance of it from the hand field array", () => {
      expect(handAfter.concat([cardToBeTopDecked]).sort()).toStrictEqual(
        handBefore.sort()
      );
    });
    it("should take the given card and add one instance of it to the library field array", () => {
      expect(libraryAfter.sort()).toStrictEqual(
        libraryBefore.concat([cardToBeTopDecked]).sort()
      );
    });
  });
  describe("given a card that is not in hand field array", () => {
    it("should throw an error", () => {
      cardToBeTopDecked = "Joker";
      expect(() => {
        rDeck.topDeckFromHand(cardToBeTopDecked);
      }).toThrow(Error);
    });
  });
});
