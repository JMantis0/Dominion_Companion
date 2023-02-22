import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function discardFromSetAside()", () => {
  let rDeck: Deck;
  let setAside: string[];
  let gY: string[];
  describe("when given a card that is in the setAside field array", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      setAside = ["Card1", "Card2", "Card3"];
      gY = ["Card4", "Card5"];
      rDeck.setGraveyard(gY);
      rDeck.setSetAside(setAside);
    });
    it("It should remove one instance of the card from setAside field array and push one instance of the card to the graveyard field array", () => {
      rDeck.discardFromSetAside("Card1");
      expect(rDeck.getSetAside()).toStrictEqual(["Card2", "Card3"]);
      expect(rDeck.getGraveyard()).toStrictEqual(["Card4", "Card5", "Card1"]);
    });
  });
  describe("when given a card that is not in the setAside field array", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      setAside = ["Card1", "Card2", "Card3"];
      gY = ["Card4", "Card5"];
      rDeck.setGraveyard(gY);
      rDeck.setSetAside(setAside);
    });
    it("should throw an error", () => {
      expect(() => rDeck.discardFromSetAside("Joker")).toThrow(Error);
    });
  });
});
