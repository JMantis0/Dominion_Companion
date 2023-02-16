import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function trashFromHand()", () => {
  let rDeck: Deck;
  let cardToTrash: string;
  let trashBefore: string[];
  let handBefore: string[];
  let trashAfter: string[];
  let handAfter: string[];
  describe("when given a card that is in the hand field array", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      cardToTrash = rDeck.getEntireDeck()[0];
      handBefore = rDeck.getHand().slice();
      trashBefore = rDeck.getTrash().slice();
      rDeck.trashFromHand(cardToTrash);
      handAfter = rDeck.getHand().slice();
      trashAfter = rDeck.getTrash().slice();
    });
    it("should remove an instance of the card fron the hand field array", () => {
      expect(handBefore.sort()).toStrictEqual(
        handAfter.concat([cardToTrash]).sort()
      );
    });
    it("should add one instance of the card to the trash field array", () => {
      expect(trashAfter.sort()).toStrictEqual(
        trashBefore.concat([cardToTrash]).sort()
      );
    });
  });
  describe("when given a card that is not in the hand field array", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      cardToTrash = "Joker";
    });
    it("should throw an Error", () => {
      expect(() => {
        rDeck.trashFromHand(cardToTrash);
      }).toThrow(Error);
    });
  });
});
