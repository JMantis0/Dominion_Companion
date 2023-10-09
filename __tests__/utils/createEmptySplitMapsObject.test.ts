import { CardCounts, SplitMaps } from "../../src/utils";
import { expect, describe, it } from "@jest/globals";
import { createEmptySplitMapsObject } from "../../src/utils/utils";
describe("createEmptySplitMapsObject", () => {
  it("should create an empty SplitMaps object with all counts set to 0", () => {
    // Call the function
    const result = createEmptySplitMapsObject();

    // Define the expected empty SplitMaps object
    const expected: SplitMaps = {
      treasures: new Map<string, CardCounts>([
        ["None", { zoneCount: 0, entireDeckCount: 0 }],
      ]),
      actions: new Map<string, CardCounts>([
        ["None", { zoneCount: 0, entireDeckCount: 0 }],
      ]),
      victories: new Map<string, CardCounts>([
        ["None", { zoneCount: 0, entireDeckCount: 0 }],
      ]),
      curses: new Map<string, CardCounts>([]), // Assuming curses is an empty map
    };

    // Check if the result matches the expected output
    expect(result).toEqual(expected);
  });
});
