import { expect, describe, it } from "@jest/globals";
import { combineDeckListMapAndZoneListMap } from "../../src/utils/utils";
import { CardCounts } from "../../src/utils";

describe("combineDeckListMapAndZoneListMap", () => {
  it("should combine deckListMap and zoneListMap correctly", () => {
    // Define sample input maps
    const deckListMap = new Map<string, number>([
      ["Card1", 3],
      ["Card2", 2],
    ]);

    const zoneListMap = new Map<string, number>([
      ["Card1", 1],
      ["Card3", 4],
    ]);

    // Call the function
    const result = combineDeckListMapAndZoneListMap(deckListMap, zoneListMap);

    // Define the expected output map
    const expected = new Map<string, CardCounts>([
      ["Card1", { entireDeckCount: 3, zoneCount: 1 }],
      ["Card2", { entireDeckCount: 2, zoneCount: 0 }],
      ["Card3", { entireDeckCount: 0, zoneCount: 4 }],
    ]);
    // Check if the result matches the expected output
    expect(result).toStrictEqual(expected);
  });
});
