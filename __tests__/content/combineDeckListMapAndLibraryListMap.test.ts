import { describe, it, expect, beforeEach } from "@jest/globals";
import { getCountsFromArray } from "../testUtilFuncs";
import {
  CardCounts,
  combineDeckListMapAndZoneListMap,
} from "../../src/content/PrimaryFrame/componentFunctions";

describe("Function combineDeckListMapAndLibraryMap.test.ts", () => {
  let combinedMap: Map<string, CardCounts>;
  let entireDeckMap: Map<string, number>;
  let libListMap: Map<string, number>;
  describe("when given a complete deck list and a library list", () => {
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
      combinedMap.set("Ace", { entireDeckCount: 5, zoneCount: 3 });
      combinedMap.set("Club", { entireDeckCount: 3, zoneCount: 2 });
      combinedMap.set("Joker", { entireDeckCount: 2, zoneCount: 0 });
      combinedMap.set("Queen", { entireDeckCount: 1, zoneCount: 0 });
    });
    it("should return a combined map with keys for each card type in the entire deck list array, and values for each key of a CardCounts object, containing the number values from the corresponding library and deck list counts", () => {
      expect(
        combineDeckListMapAndZoneListMap(entireDeckMap, libListMap)
      ).toStrictEqual(combinedMap);
    });
  });
});
