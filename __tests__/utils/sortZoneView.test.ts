import { describe, it, expect } from "@jest/globals";
import { sortZoneView } from "../../src/utils/utils";
import { SortCategory } from "../../src/utils";
import { getMapArray } from "../testUtilFuncs";

describe("Function sortZoneView()", () => {
  // Case 1 card name ascending
  it("should ascending sort map by cardName correctly", () => {
    // Arrange
    const sortParam: SortCategory = "card";
    const unsortedMap: Map<string, number> = new Map([
      ["CardC", 3],
      ["CardD", 4],
      ["CardA", 1],
      ["CardB", 2],
    ]);
    const sortType = "ascending";

    // Act
    const sortedMap: Map<string, number> = sortZoneView(
      sortParam,
      unsortedMap,
      sortType
    );

    // Expected Result
    const expectedSortedMap: Map<string, number> = new Map([
      ["CardA", 1],
      ["CardB", 2],
      ["CardC", 3],
      ["CardD", 4],
    ]);
    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 2 card name descending
  it("should descending sort map by cardName correctly", () => {
    // Arrange
    const sortParam: SortCategory = "card";
    const unsortedMap: Map<string, number> = new Map([
      ["CardC", 3],
      ["CardD", 4],
      ["CardA", 1],
      ["CardB", 2],
    ]);
    const sortType = "descending";

    // Act
    const sortedMap: Map<string, number> = sortZoneView(
      sortParam,
      unsortedMap,
      sortType
    );

    // Expected Result
    const expectedSortedMap: Map<string, number> = new Map([
      ["CardD", 4],
      ["CardC", 3],
      ["CardB", 2],
      ["CardA", 1],
    ]);
    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 3 zone amount ascending, no equal amounts
  it("should ascending sort by zone amount correctly", () => {
    // Arrange
    const sortParam: SortCategory = "zone";
    const unsortedMap: Map<string, number> = new Map([
      ["CardC", 3],
      ["CardD", 4],
      ["CardA", 1],
      ["CardB", 2],
    ]);
    const sortType = "ascending";

    // Act
    const sortedMap: Map<string, number> = sortZoneView(
      sortParam,
      unsortedMap,
      sortType
    );

    // Expected Result
    const expectedSortedMap: Map<string, number> = new Map([
      ["CardD", 4],
      ["CardC", 3],
      ["CardB", 2],
      ["CardA", 1],
    ]);
    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });

  // Case 4 zone amount descending no equal amounts
  it("should descending sort map by zone amount correctly", () => {
    // Arrange
    const sortParam: SortCategory = "zone";
    const unsortedMap: Map<string, number> = new Map([
      ["CardC", 3],
      ["CardD", 4],
      ["CardA", 1],
      ["CardB", 2],
    ]);
    const sortType = "descending";

    // Act
    const sortedMap: Map<string, number> = sortZoneView(
      sortParam,
      unsortedMap,
      sortType
    );

    // Expected Result
    const expectedSortedMap: Map<string, number> = new Map([
      ["CardA", 1],
      ["CardB", 2],
      ["CardC", 3],
      ["CardD", 4],
    ]);
    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });
  // Case 5 zone amount ascending with equal amounts
  it("should ascending sort map by zone amount correctly when there are equal amounts present", () => {
    // Arrange
    const sortParam: SortCategory = "zone";
    const unsortedMap: Map<string, number> = new Map([
      ["CardC", 3],
      ["CardD", 4],
      ["CardA", 1],
      ["CardB", 2],
      ["CardB2", 3],
      ["CardC2", 3],
    ]);
    const sortType = "ascending";

    // Act
    const sortedMap: Map<string, number> = sortZoneView(
      sortParam,
      unsortedMap,
      sortType
    );

    // Expected Result
    const expectedSortedMap: Map<string, number> = new Map([
      ["CardD", 4],
      ["CardB2", 3],
      ["CardC", 3],
      ["CardC2", 3],
      ["CardB", 2],
      ["CardA", 1],
    ]);
    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });
  // Case 6 zone amount descending with equal amounts
  it("should descending sort map by zone amount correctly when there are equal amounts present", () => {
    // Arrange
    const sortParam: SortCategory = "zone";
    const unsortedMap: Map<string, number> = new Map([
      ["CardC", 3],
      ["CardD", 4],
      ["CardA", 1],
      ["CardB", 2],
      ["CardB2", 3],
      ["CardC2", 3],
    ]);
    const sortType = "descending";

    // Act
    const sortedMap: Map<string, number> = sortZoneView(
      sortParam,
      unsortedMap,
      sortType
    );

    // Expected Result
    const expectedSortedMap: Map<string, number> = new Map([
      ["CardA", 1],
      ["CardB", 2],
      ["CardC2", 3],
      ["CardC", 3],
      ["CardB2", 3],
      ["CardD", 4],
    ]);
    // Assert
    expect(getMapArray(sortedMap)).toEqual(getMapArray(expectedSortedMap));
  });
});
