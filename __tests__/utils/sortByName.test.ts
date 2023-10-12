import { describe, it, expect } from "@jest/globals";
import { sortByName } from "../../src/utils/utils";

describe("Function sortByName()", () => {
  it("should sort two cards ascending correctly", () => {
    //  Arrange
    const cardA = "Alpha";
    const cardB = "Omega";
    const sortType = "ascending";

    // Act
    const result = sortByName(cardA, cardB, sortType);
    const expectedResult = 1;

    // Assert
    expect(result).toBe(expectedResult);
  });
  it("should sort two cards descending correctly", () => {
    //  Arrange
    const cardA = "Alpha";
    const cardB = "Omega";
    const sortType = "descending";
    
    // Act
    const result = sortByName(cardA, cardB, sortType);
    const expectedResult = -1;

    // Assert
    expect(result).toBe(expectedResult);
  });
});
