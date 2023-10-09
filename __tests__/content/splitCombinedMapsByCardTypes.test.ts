import { describe, it, beforeEach, expect } from "@jest/globals";
import {
  combineDeckListMapAndZoneListMap,
  splitCombinedMapsByCardTypes,
} from "../../src/utils/utils";
import { getCountsFromArray } from "../testUtilFuncs";
import type { CardCounts, SplitMaps } from "../../src/utils";

describe("Function splitCombinedMapsByCardTypes()", () => {
  let expectedMap: SplitMaps;
  let combinedMap: Map<string, CardCounts>;
  let libList: string[];
  let entireList: string[];
  let tMap: Map<string, CardCounts>;
  let aMap: Map<string, CardCounts>;
  let vMap: Map<string, CardCounts>;
  let cMap: Map<string, CardCounts>;

  describe("when given a combined map of library counts and entire list counts", () => {
    beforeEach(() => {
      entireList = [
        "Copper",
        "Copper",
        "Copper",
        "Copper",
        "Copper",
        "Silver",
        "Silver",
        "Silver",
        "Silver",
        "Silver",
        "Gold",
        "Gold",
        "Gold",
        "Gold",
        "Gold",
        "Estate",
        "Estate",
        "Estate",
        "Vassal",
        "Vassal",
        "Vassal",
        "Curse",
        "Curse",
      ];

      libList = [
        "Copper",
        "Copper",
        "Silver",
        "Silver",
        "Gold",
        "Estate",
        "Vassal",
        "Vassal",
        "Curse",
      ];
      combinedMap = combineDeckListMapAndZoneListMap(
        getCountsFromArray(entireList),
        getCountsFromArray(libList)
      );

      vMap = new Map();
      tMap = new Map();
      aMap = new Map();
      cMap = new Map();
      // construct expected object
      vMap.set("Estate", { zoneCount: 1, entireDeckCount: 3 });
      aMap.set("Vassal", { zoneCount: 2, entireDeckCount: 3 });
      tMap.set("Copper", { zoneCount: 2, entireDeckCount: 5 });
      tMap.set("Silver", { zoneCount: 2, entireDeckCount: 5 });
      tMap.set("Gold", { zoneCount: 1, entireDeckCount: 5 });
      cMap.set("Curse", { zoneCount: 1, entireDeckCount: 2 });
      expectedMap = {
        treasures: tMap,
        victories: vMap,
        actions: aMap,
        curses: cMap,
      };
    });
    it("should return a SplitMaps object with four maps, one with only treasure keys, another with only action keys, and one with only victory keys", () => {
      expect(splitCombinedMapsByCardTypes(combinedMap)).toStrictEqual(
        expectedMap
      );
    });
  });
});
