import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function play()", () => {
  let testDeck: Deck;
  let testHand: string[];
  let testInPlay: string[];

  beforeEach(() => {
    testDeck = new Deck("tTitle", "testName", "testNick", [
      "Ace",
      "Heart",
      "Club",
      "Spade",
    ]);
    testHand = ["Ace", "Club", "Club", "Heart"];
    testInPlay = [];
    testDeck.setInPlay(testInPlay);
    testDeck.setHand(testHand);
  });
  describe("when given a card that is in the hand", () => {
    it("should remove the card from hand and add it to inPlay", () => {
      testDeck.play("Ace");
      expect(testDeck.getInPlay().indexOf("Ace")).toBeGreaterThan(-1);
      expect(testDeck.getHand().indexOf("Ace")).toBeLessThan(0);
    });
  });
  describe("when given a card that is not in the hand", () => {
    it("should throw an error", () => {
      const spy = jest.spyOn(testDeck, "play");
      expect(() => testDeck.play("Spade")).toThrow(Error);
      expect(spy).toHaveBeenCalled();
    });
  });
});
