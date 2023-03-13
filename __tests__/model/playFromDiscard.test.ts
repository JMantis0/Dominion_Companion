import { it, describe, beforeEach, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function playFromDiscard()", () => {
  let tDeck: Deck;
  let tDiscard: string[];
  beforeEach(() => {
    tDeck = new Deck("tTitle", "tN", "tNik", ["Ace", "Club", "Club", "Heart"]);
    tDiscard = ["Ace", "Club", "Club", "Heart"];
    tDeck.setGraveyard(tDiscard);
  });
  describe("when given a card that is in the discard pile", () => {
    it("should remove the card form the graveyard array and add it to the inPlay array", () => {
      tDeck.playFromDiscard("Ace");
      expect(tDeck.getInPlay().indexOf("Ace")).toBeGreaterThan(-1);
      expect(tDeck.getGraveyard().indexOf("Ace")).toBeLessThan(0);
    });
  });
  describe("when given a card that is not in the discard pile", () => {
    it("should remove that card from the discard field array and add it to the inPlay field array", () => {
      expect(() => tDeck.playFromDiscard("Joker")).toThrow(Error);
    });
  });
});
