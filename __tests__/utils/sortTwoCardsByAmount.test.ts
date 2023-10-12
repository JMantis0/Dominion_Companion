import { describe, it, expect } from "@jest/globals";
import { sortTwoCardsByAmount } from "../../src/utils/utils";

describe("Function sortTwoCardsByAmount() ", () => {
  describe("should ascending sort two cards by amount of that card in the library correctly", () => {
    it("...by returning a value of 1 when the amount of cardALibCount is lesser than the amount of cardBLibCount", () => {
      //Arrange
      const sortType = "ascending";
      const cardALibCount = 1; // cardA amount is less
      const cardBLibCount = 2;
      // Act
      const result = sortTwoCardsByAmount(
        cardALibCount,
        cardBLibCount,
        sortType
      );
      // Assert
      expect(result).toEqual(1);
    });
    it("...by returning a value of -1 when the amount of cardA is greater than the amount of cardBLibCount", () => {
      //Arrange
      const sortType = "ascending";
      const cardALibCount = 2; //cardALibCount is greater
      const cardBLibCount = 1;
      // Act
      const result = sortTwoCardsByAmount(
        cardALibCount,
        cardBLibCount,
        sortType
      );
      // Assert
      expect(result).toEqual(-1);
    });
    it("...by returning a value of 0 when the amount of cardALibCount and cardBLibCount are equal", () => {
      //Arrange
      const sortType = "ascending";
      const cardALibCount = 1; //card mounts are equal
      const cardBLibCount = 1;
      // Act
      const result = sortTwoCardsByAmount(
        cardALibCount,
        cardBLibCount,
        sortType
      );
      // Assert
      expect(result).toEqual(0);
    });
  });
  describe("should descending sort two cards by amount of that card in the library correctly", () => {
    it("...by returning a value of -1 when the amount of cardALibCount is lesser than the amount of cardBLibCount", () => {
      //Arrange
      const sortType = "descending";
      const cardALibCount = 1; //cardALibCount is lesser
      const cardBLibCount = 2;
      // Act
      const result = sortTwoCardsByAmount(
        cardALibCount,
        cardBLibCount,
        sortType
      );
      // Assert
      expect(result).toEqual(-1);
    });
    it("...by returning a value of 1 when the amount of cardALibCount is greater than the amount of cardBLibCount", () => {
      //Arrange
      const sortType = "descending";
      const cardALibCount = 2; //cardALibCount is greater
      const cardBLibCount = 1;
      // Act
      const result = sortTwoCardsByAmount(
        cardALibCount,
        cardBLibCount,
        sortType
      );
      // Assert
      expect(result).toEqual(1);
    });
    it("...by returning a value of 0 when the amount of cardALibCount and cardBLibCount are equal", () => {
      //Arrange
      const sortType = "descending";
      const cardALibCount = 1; // card amounts equal
      const cardBLibCount = 1;
      // Act
      const result = sortTwoCardsByAmount(
        cardALibCount,
        cardBLibCount,
        sortType
      );
      // Assert
      expect(result).toEqual(0);
    });
  });
});
