import { CardCounts } from "../../src/utils";
import { sortHistoryDeckView } from "../../src/utils/utils";
import { describe, it, expect } from "@jest/globals";

// Matcher does not compare map order, so here the an array of the Map.entries() is used for comparison
describe("sortHistoryDeckView", () => {
  // Test data
  const unsortedMap: Map<string, CardCounts> = new Map([
    ["Apple", { entireDeckCount: 5, zoneCount: 3 }],
    ["Banana", { entireDeckCount: 3, zoneCount: 2 }],
    ["Carrot", { entireDeckCount: 2, zoneCount: 1 }],
  ]);

  it("should sort by card name in ascending order", () => {
    const sortedMap = sortHistoryDeckView("card", unsortedMap, "ascending");
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["Carrot", { entireDeckCount: 2, zoneCount: 1 }],
      ["Banana", { entireDeckCount: 3, zoneCount: 2 }],
      ["Apple", { entireDeckCount: 5, zoneCount: 3 }],
    ]);

    expect(Array.from(sortedMap.entries())).toStrictEqual(
      Array.from(expectedSortedMap.entries())
    );
  });
  it("should sort by card name in descending order", () => {
    const sortedMap = sortHistoryDeckView("card", unsortedMap, "descending");
    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["Apple", { entireDeckCount: 5, zoneCount: 3 }],
      ["Banana", { entireDeckCount: 3, zoneCount: 2 }],
      ["Carrot", { entireDeckCount: 2, zoneCount: 1 }],
    ]);

    expect(Array.from(sortedMap.entries())).toStrictEqual(
      Array.from(expectedSortedMap.entries())
    );
  });

  it("should sort by owned amount in descending order", () => {
    const sortedMap = sortHistoryDeckView("owned", unsortedMap, "descending");

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["Carrot", { entireDeckCount: 2, zoneCount: 1 }],
      ["Banana", { entireDeckCount: 3, zoneCount: 2 }],
      ["Apple", { entireDeckCount: 5, zoneCount: 3 }],
    ]);

    expect(Array.from(sortedMap.entries())).toStrictEqual(
      Array.from(expectedSortedMap.entries())
    );
  });
  it("should sort by owned amount in ascending order", () => {
    const sortedMap = sortHistoryDeckView("owned", unsortedMap, "ascending");

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["Apple", { entireDeckCount: 5, zoneCount: 3 }],
      ["Banana", { entireDeckCount: 3, zoneCount: 2 }],
      ["Carrot", { entireDeckCount: 2, zoneCount: 1 }],
    ]);

    expect(Array.from(sortedMap.entries())).toStrictEqual(
      Array.from(expectedSortedMap.entries())
    );
  });

  it("should sort by zone count in ascending order", () => {
    const sortedMap = sortHistoryDeckView("zone", unsortedMap, "ascending");

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["Apple", { entireDeckCount: 5, zoneCount: 3 }],
      ["Banana", { entireDeckCount: 3, zoneCount: 2 }],
      ["Carrot", { entireDeckCount: 2, zoneCount: 1 }],
    ]);

    expect(Array.from(sortedMap.entries())).toStrictEqual(
      Array.from(expectedSortedMap.entries())
    );
  });
  it("should sort by zone count in descending order", () => {
    const sortedMap = sortHistoryDeckView("zone", unsortedMap, "descending");

    // Expected result
    const expectedSortedMap: Map<string, CardCounts> = new Map([
      ["Carrot", { entireDeckCount: 2, zoneCount: 1 }],
      ["Banana", { entireDeckCount: 3, zoneCount: 2 }],
      ["Apple", { entireDeckCount: 5, zoneCount: 3 }],
    ]);

    expect(Array.from(sortedMap.entries())).toStrictEqual(
      Array.from(expectedSortedMap.entries())
    );
  });

  // Add cases for if the amount for two different cards is the same?
  // The function does not have logic for this case and will use default logic
  // Ot should sort secondarily by the card, or does it matteR?
});
