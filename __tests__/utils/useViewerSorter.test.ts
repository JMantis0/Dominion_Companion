/**
 * @jest-environment jsdom
 */
import { describe, it, expect, jest } from "@jest/globals";
import { SortButtonState } from "../../src/utils";
import { useViewerSorter } from "../../src/utils/utils";
import { OpponentDeck } from "../../src/model/opponentDeck";
import { renderHook } from "@testing-library/react";
import { getMapArray } from "../testUtilFuncs";

describe("useViewerSorter", () => {
  const setMap = jest.fn() as jest.MockedFunction<
    (value: React.SetStateAction<Map<string, number>>) => void
  >;

  it("should, given an array, return a sortedMap containing the array Data", () => {
    // Arrange -
    const sortButtonState: SortButtonState = {
      category: "zone",
      sort: "ascending",
    };
    const opponentDeck = new OpponentDeck(
      "MockTitle",
      false,
      "MockRating",
      "Opponent",
      "O",
      []
    );

    // Act - Simulate an initial render
    const { rerender } = renderHook(
      ({ zone, sortButtonState, setMap }) =>
        useViewerSorter(zone, sortButtonState, setMap),
      {
        initialProps: {
          zone: opponentDeck.entireDeck,
          sortButtonState,
          setMap,
        },
      }
    );

    // Build the expected Map, sorted by zoneCount
    const expectedMap = new Map<string, number>([
      ["Copper", 7],
      ["Estate", 3],
    ]);
    // Get the map created by the hook.
    const sortedMap = setMap.mock.calls[0][0] as Map<string, number>;
    // Convert maps to arrays for comparing order.
    const expectedMapArray = getMapArray(expectedMap);
    const sortedMapArray = getMapArray(sortedMap);

    // Assert 1 - Verify setMap was called with the correct sortedMap
    expect(setMap).toBeCalledTimes(1);
    expect(sortedMapArray).toStrictEqual(expectedMapArray);

    // Add a card to the deck and reassign the opponentStoreDeck
    opponentDeck.addCardToEntireDeck("Vassal");

    // Rerender with the updated opponentStoreDeck
    rerender({
      zone: opponentDeck.entireDeck,
      sortButtonState,
      setMap,
    });

    // Build 2nd expected Map, for the rerender
    const expectedMap2 = new Map([
      ["Copper", 7],
      ["Estate", 3],
      ["Vassal", 1],
    ]);
    // Get the map created by the hook
    const sortedMap2 = setMap.mock.calls[1][0] as Map<string, number>;
    // Convert maps to arrays for order comparison.
    const expectedMapArray2 = getMapArray(expectedMap2);
    const sortedMapArray2 = getMapArray(sortedMap2);

    // Assert 12- Verify setMap was called with the correct sortedMap
    expect(setMap).toBeCalledTimes(2);
    expect(sortedMapArray2).toStrictEqual(expectedMapArray2);

    // Rerender with a descending sortButtonState
    rerender({
      zone: opponentDeck.entireDeck,
      sortButtonState: { category: "zone", sort: "descending" },
      setMap,
    });

    // Build 3rd expected map, for 2nd rerender
    const expectedMap3 = new Map([
      ["Vassal", 1],
      ["Estate", 3],
      ["Copper", 7],
    ]);
    // Get the map created by the hook.
    const sortedMap3 = setMap.mock.calls[2][0] as Map<string, number>;

    // Convert maps to arrays for comparing order.
    const expectedMapArray3 = getMapArray(expectedMap3);
    const sortedMapArray3 = getMapArray(sortedMap3);

    // Assert 3 - Verify setMap was called with the correct sortedMap
    expect(setMap).toBeCalledTimes(3);
    expect(sortedMapArray3).toStrictEqual(expectedMapArray3);

    // Rerender with a descending sortButtonState, with a different category.
    rerender({
      zone: opponentDeck.entireDeck,
      sortButtonState: { category: "card", sort: "ascending" },
      setMap,
    });

    // Build 4th expected map, for 3rd rerender
    const expectedMap4 = new Map([
      ["Copper", 7],
      ["Estate", 3],
      ["Vassal", 1],
    ]);
    // Get the map created by the hook.
    const sortedMap4 = setMap.mock.calls[3][0] as Map<string, number>;

    // Convert maps to arrays for comparing order.
    const expectedMapArray4 = getMapArray(expectedMap4);
    const sortedMapArray4 = getMapArray(sortedMap4);

    // Assert 4 - Verify setMap was called with the correct sortedMap
    expect(setMap).toBeCalledTimes(4);
    expect(sortedMapArray4).toStrictEqual(expectedMapArray4);

    // Rerender with the same props and confirm setMap is not called a 5th time
    rerender({
      zone: opponentDeck.entireDeck,
      sortButtonState: { category: "card", sort: "ascending" },
      setMap,
    });
    expect(setMap).toBeCalledTimes(4);
  });
});
