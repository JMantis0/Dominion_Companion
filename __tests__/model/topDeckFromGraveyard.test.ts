import { expect, it, describe, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function topDeckFromGraveyard()", () => {
  let tDeck: Deck;
  let tDiscard: string[];
  beforeEach(() => {
    tDeck = new Deck("tN", "tNik", ["Ace", "Club", "Club", "Heart"]);
    tDiscard = ["Ace", "Club", "Club", "Heart"];
    tDeck.setGraveyard(tDiscard);
  });
  describe("when given a card that is in the discard pile", () => {
    it("should remove the card from the discard pile and place it into the library", () => {
      expect(() => tDeck.topDeckFromGraveyard("Ace")).not.toThrow(Error);
      expect(tDeck.getLibrary().indexOf("Ace")).toBeGreaterThan(-1);
      expect(tDeck.getGraveyard().indexOf("Ace")).toBeLessThan(0);
    });
  });
  describe("when given a card that is not in the discard field array", () => {
    it("should throw an error", () => {
      expect(() => tDeck.topDeckFromGraveyard("Joker")).toThrow(Error);
    });
  });
});
