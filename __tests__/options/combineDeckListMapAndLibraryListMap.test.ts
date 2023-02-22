import { describe, it, expect, beforeEach } from "@jest/globals";
import { getCountsFromArray } from "../testUtilFuncs";
import {
  CardCounts,
  combineDeckListMapAndLibraryListMap,
} from "../../src/options/utils/utilityFunctions";

describe("Function combineDeckListMapAndLibraryMap.test.ts", () => {
  let combinedMap: Map<string, CardCounts>;
  let entireDeckMap: Map<string, number>;
  let libListMap: Map<string, number>;
  describe("when given a complete decklist and a library list", () => {
    beforeEach(() => {
      entireDeckMap = getCountsFromArray([
        "Ace",
        "Ace",
        "Ace",
        "Ace",
        "Ace",
        "Club",
        "Club",
        "Club",
        "Joker",
        "Joker",
        "Queen",
      ]);
      libListMap = getCountsFromArray(["Ace", "Ace", "Ace", "Club", "Club"]);
      combinedMap = new Map();
      combinedMap.set("Ace", { entireDeckCount: 5, libraryCount: 3 });
      combinedMap.set("Club", { entireDeckCount: 3, libraryCount: 2 });
      combinedMap.set("Joker", { entireDeckCount: 2, libraryCount: 0 });
      combinedMap.set("Queen", { entireDeckCount: 1, libraryCount: 0 });
    });
    it("should return a combined map with keys for each card type in the entire decklist array, and values for each key of a CardCounts object, containing the number values from the corresponding library and decklist counts", () => {
      expect(
        combineDeckListMapAndLibraryListMap(entireDeckMap, libListMap)
      ).toStrictEqual(combinedMap);
    });
  });
});
