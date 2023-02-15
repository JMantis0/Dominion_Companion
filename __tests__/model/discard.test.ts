import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function discard()", () => {
  let rDeck: Deck;
  let cardToBeDiscarded: string;
  let handBefore: string[];
  let handAfter: string[];
  let gyBefore: string[];
  let gyAfter: string[];
  describe("when given a card that is in the hand field array", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      cardToBeDiscarded = rDeck.getEntireDeck()[0];
      handBefore = rDeck.getHand().slice();
      gyBefore = rDeck.getGraveyard().slice();
      rDeck.discard(cardToBeDiscarded);
      handAfter = rDeck.getHand().slice();
      gyAfter = rDeck.getGraveyard().slice();
    });
    it("should remove one instance of that card from the hand fielda array", () => {
      expect(handAfter.concat([cardToBeDiscarded]).sort()).toStrictEqual(
        handBefore.sort()
      );
    });
    it("should remove add one instance of that card to the graveyard field array", () => {
      expect(gyBefore.concat([cardToBeDiscarded]).sort()).toStrictEqual(
        gyAfter.sort()
      );
    });
  });
  describe("When given a card that is not in the hand field array", () => {
    it("should return an error", () => {
      rDeck = createRandomDeck();
      cardToBeDiscarded = "Joker";
      expect(() => rDeck.discard(cardToBeDiscarded)).toThrow(Error);
    });
  });
});
