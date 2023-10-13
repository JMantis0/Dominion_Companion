import { describe, expect, it } from "@jest/globals";
import { CardCounts } from "../../src/utils";
import { getMapArray } from "../testUtilFuncs";

describe("Function getMapArray()", () => {
  it("should return an array of a given map's entries", () => {
    const map = new Map<string, CardCounts>([
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
    ]);
    const expectedResult = [
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
    ];
    expect(getMapArray(map)).toStrictEqual(expectedResult);
  });
  it("should return an array of a given map's entries and order matters", () => {
    const map = new Map<string, CardCounts>([
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
    ]);
    const expectedResult = [
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
    ];
    const outOfOrderResult = [
      ["CardA", { entireDeckCount: 1, zoneCount: 1 }],
      ["CardB", { entireDeckCount: 2, zoneCount: 2 }],
      ["CardC", { entireDeckCount: 3, zoneCount: 3 }],
      ["CardD", { entireDeckCount: 4, zoneCount: 4 }],
    ];
    expect(getMapArray(map)).toStrictEqual(expectedResult);
    expect(getMapArray(map)).not.toStrictEqual(outOfOrderResult); 
  });
});
