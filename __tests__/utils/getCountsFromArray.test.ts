import { describe, it, expect, beforeEach } from "@jest/globals";
import { getCountsFromArray } from "../testUtilFuncs";
describe("Function getCountsFromArray()", () => {
  let cardArray: string[];
  let expectedMap: Map<string, number>;
  describe("when given an array of cards", () => {
    beforeEach(() => {
      cardArray = ["Ace", "Ace", "Club", "Joker", "Joker", "Joker"];
      expectedMap = new Map();
      expectedMap.set("Club", 1);
      expectedMap.set("Ace", 2);
      expectedMap.set("Joker", 3);
    });
    it("should return a map with a set of keys for each card type, and corresponding values for each key of the number of elements in the given array of that type", () => {
      expect(getCountsFromArray(cardArray)).toStrictEqual(expectedMap);
    });
  });
});
