import { it, describe, expect } from "@jest/globals";
import { createRandomKingdom, getAllIndices } from "../testUtilFuncs";

describe("Function createRandomKingdom()", () => {
  const randomKingdom = createRandomKingdom();
  it("should return a string array of length 10", () => {
    expect(randomKingdom.length).toBe(17);
  });
  it("should have no duplicate members", () => {
    randomKingdom.forEach((card) => {
      expect(getAllIndices(randomKingdom, card).length).toBe(1);
    });
  });
});
