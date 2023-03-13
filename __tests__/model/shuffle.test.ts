import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function shuffle()", () => {
  describe("randomized the order of the library array field", () => {
    let tDeck: Deck;
    beforeEach(() => {
      tDeck = createRandomDeck();

    });
    it("should not affect the array length", () => {
      const lengthBefore = tDeck.getLibrary().length;
      tDeck.shuffle();
      const lengthAfter = tDeck.getLibrary().length;
      expect(lengthBefore).toBe(lengthAfter);
    });
  });
});
