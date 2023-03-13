import { it, beforeEach, describe, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function removeCardFromEntireDeck()", () => {
  let tDeck: Deck;
  let tEntireDeck: string[];
  beforeEach(() => {
    tDeck = new Deck("tTitle", "tName", "tNick", [
      "Ace",
      "Heart",
      "Club",
      "Spade",
    ]);
    tEntireDeck = ["Ace", "Heart"];
    tDeck.setEntireDeck(tEntireDeck);
  });
  describe("when given a card that is in the deck", () => {
    it("should remove that card from the entireDeck field array", () => {
      tDeck.removeCardFromEntireDeck("Ace");
      expect(tDeck.getEntireDeck().indexOf("Ace")).toBeLessThan(0);
    });
  });

  describe("when given a card that is not in the entireDeck array", () => {
    it("should throw an Error", () => {
      expect(() => tDeck.removeCardFromEntireDeck("Spade")).toThrow(Error);
    });
  });
});
