import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function shuffle()", () => {
  describe("randomized the order of the library array field", () => {
    let tDeck: Deck;
    beforeEach(() => {
      tDeck = new Deck("tTitle", "tName", "tNick", [
        "Ace",
        "Club",
        "Club",
        "Heart",
      ]);
      let tLib = [
        "Ace",
        "Club",
        "Club",
        "Heart",
        "Ace",
        "Club",
        "Club",
        "Heart",
      ];
      tDeck.setLibrary(tLib);
    });
    it("should not affect the array length", () => {
      const lengthBefore = tDeck.getLibrary().length;
      tDeck.shuffle();
      const lengthAfter = tDeck.getLibrary().length;
      expect(lengthBefore).toBe(lengthAfter);
    });
  });
});
