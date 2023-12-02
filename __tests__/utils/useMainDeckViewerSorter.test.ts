/**
 * @jest-environment jsdom
 */

import { describe, expect, it, jest } from "@jest/globals";
import {
  CardCounts,
  MainDeckViewerState,
  SortButtonState,
} from "../../src/utils";
import { renderHook } from "@testing-library/react";
import { useMainDeckViewerSorter } from "../../src/utils/utils";
import { getMapArray } from "../testUtilFuncs";

describe("useMainDeckViewerSorter", () => {
  const setLibraryMapMock = jest.fn() as jest.MockedFunction<
    (value: React.SetStateAction<Map<string, CardCounts>>) => void
  >;
  it("should dispatch a sortedCombinedMap based on the given arguments", () => {
    // Arrange

    // Create a mainDeckViewerState object to pass to the hook.
    let mockMainDeckViewerState: MainDeckViewerState = {
      deck: {
        entireDeck: [
          "Copper",
          "Copper",
          "Copper",
          "Copper",
          "Copper",
          "Copper",
          "Copper",
          "Estate",
          "Estate",
          "Estate",
        ],
        graveyard: [],
        hand: [],
        inPlay: [],
        library: [
          "Copper",
          "Copper",
          "Copper",
          "Copper",
          "Copper",
          "Copper",
          "Copper",
          "Estate",
          "Estate",
          "Estate",
        ],
        setAside: [],
      },
      playerName: "",

      topCardsLookAmount: 1,
      turnToggleButton: "Current",
    };

    let sortButtonState: SortButtonState = {
      category: "card",
      sort: "ascending",
    };
    // Act 1 - initial render the hook
    const { rerender } = renderHook(
      ({ mainDeckViewerState, setLibraryMap }) =>
        useMainDeckViewerSorter(
          mainDeckViewerState,
          sortButtonState,
          setLibraryMap
        ),
      {
        initialProps: {
          mainDeckViewerState: mockMainDeckViewerState,
          setLibraryMap: setLibraryMapMock,
        },
      }
    );

    // Construct an expected sorted map
    const expected: Map<string, CardCounts> = new Map([
      ["Copper", { entireDeckCount: 7, zoneCount: 7 }],
      ["Estate", { entireDeckCount: 3, zoneCount: 3 }],
    ]);

    // Assert 1 - Verify
    expect(
      getMapArray(setLibraryMapMock.mock.calls[0][0] as Map<string, CardCounts>)
    ).toStrictEqual(getMapArray(expected));

    // Simulate buying a Vassal by adding one to the graveyard and entireDeck
    mockMainDeckViewerState.deck.entireDeck.push("Vassal");
    mockMainDeckViewerState.deck.graveyard.push("Vassal");

    // Give mockMainDeckViewerState a new reference by cloning.
    mockMainDeckViewerState = { ...mockMainDeckViewerState };

    // Act 2 - Trigger first rerender with a different state.
    rerender({
      mainDeckViewerState: mockMainDeckViewerState,
      setLibraryMap: setLibraryMapMock,
    });

    // Construct the expected map
    const expected2: Map<string, CardCounts> = new Map([
      ["Copper", { entireDeckCount: 7, zoneCount: 7 }],
      ["Estate", { entireDeckCount: 3, zoneCount: 3 }],
      ["Vassal", { entireDeckCount: 1, zoneCount: 0 }],
    ]);

    // Assert 2 - Verify the correct sortedMap is dispatched.
    expect(setLibraryMapMock).toBeCalledTimes(2);
    expect(getMapArray(expected2)).toStrictEqual(
      getMapArray(setLibraryMapMock.mock.calls[1][0] as Map<string, CardCounts>)
    );

    // Simulate a change in sortButtonState.
    sortButtonState = {
      category: "card",
      sort: "descending",
    };
    mockMainDeckViewerState = { ...mockMainDeckViewerState };
    // Act 3 - Trigger a rerender with a different sortButtonState
    rerender({
      mainDeckViewerState: mockMainDeckViewerState,
      setLibraryMap: setLibraryMapMock,
    });

    // Construct the expected map.
    const expected3: Map<string, CardCounts> = new Map([
      ["Vassal", { entireDeckCount: 1, zoneCount: 0 }],
      ["Estate", { entireDeckCount: 3, zoneCount: 3 }],
      ["Copper", { entireDeckCount: 7, zoneCount: 7 }],
    ]);
    // Assert 3 - Verify the correct sortedMap is dispatched.
    expect(setLibraryMapMock).toBeCalledTimes(3);
    expect(getMapArray(expected3)).toStrictEqual(
      getMapArray(setLibraryMapMock.mock.calls[2][0] as Map<string, CardCounts>)
    );
  });
});
