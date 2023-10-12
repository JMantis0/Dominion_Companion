import { describe, it, expect } from "@jest/globals";
import { sortTwoCardsByName } from "../../src/utils/utils";

describe("Function sortTwoCardsByName()", () => {
  it("should sort two cards ascending correctly, ie: should return -1 if cardA comes alphabetically before cardB ", () => {
    //  Arrange
    const cardA = "Alpha";
    const cardB = "Omega";
    const sortType = "ascending";

    // Act
    const result = sortTwoCardsByName(cardA, cardB, sortType);
    const expectedResult = -1;

    // Assert
    expect(result).toBe(expectedResult);
  });

  it("should sort two cards ascending correctly, ie: should return 1 if cardA comes alphabetically after cardB ", () => {
    //  Arrange
    const cardA = "Zebra";
    const cardB = "Apple";
    const sortType = "ascending";

    // Act
    const result = sortTwoCardsByName(cardA, cardB, sortType);
    const expectedResult = 1;

    // Assert
    expect(result).toBe(expectedResult);
  });

  it("should sort two cards descending correctly,  ie: should return 1 if cardA comes alphabetically before cardB ", () => {
    //  Arrange
    const cardA = "Alpha";
    const cardB = "Omega";
    const sortType = "descending";

    // Act
    const result = sortTwoCardsByName(cardA, cardB, sortType);
    const expectedResult = 1;

    // Assert
    expect(result).toBe(expectedResult);
  });

  it("should sort two cards descending correctly,  ie: should return -1 if cardA comes alphabetically after cardB ", () => {
    //  Arrange
    const cardA = "Zebra";
    const cardB = "Apple";
    const sortType = "descending";

    // Act
    const result = sortTwoCardsByName(cardA, cardB, sortType);
    const expectedResult = -1;

    // Assert
    expect(result).toBe(expectedResult);
  });

  it("should return 0 for two equal strings for ascending ", () => {
    //  Arrange
    const cardA = "Same";
    const cardB = "Same";
    const sortType = "ascending";

    // Act
    const result = sortTwoCardsByName(cardA, cardB, sortType);
    const expectedResult = 0;

    // Assert
    expect(result).toEqual(expectedResult);
  });
  it("should return 0 for two equal strings for descending ", () => {
    //  Arrange
    const cardA = "Same";
    const cardB = "Same";
    const sortType = "descending";

    // Act
    const result = sortTwoCardsByName(cardA, cardB, sortType);
    const expectedResult = 0;

    // Assert
    expect(result).toBe(expectedResult);
  });
});
