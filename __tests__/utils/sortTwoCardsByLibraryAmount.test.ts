import { describe, it, expect } from "@jest/globals";

describe("Function sortTwoCardsByLibraryAmount() ", () => {
  // Arrange
  const library = ["Card1", "Card1", "Card2", "Card3"];

  describe("should ascending sort two cards by amount of that card in the library correctly", () => {
    it("...by returning a value of 1 when the amount of cardA is lesser than the amount of cardB", () => {
      //Arrange
      const sortType = "ascending";
      const cardA = "Card2"; // cardA amount is less
      const cardB = "Card1";
      // Act
      const result = sortTwoCardsByLibraryAmount(cardA, cardB, sortType);
      // Assert
      expect(result).toEqual(1);
    });
    it("...by returning a value of -1 when the amount of cardA is greater than the amount of cardB", () => {
      //Arrange
      const sortType = "ascending";
      const cardA = "Card1"; //cardA is greater
      const cardB = "Card2";
      // Act
      const result = sortTwoCardsByLibraryAmount(cardA, cardB, sortType);
      // Assert
      expect(result).toEqual(1);
    });
    it("...by returning a value of 0 when the amount of cardA and cardB are equal", () => {
      //Arrange
      const sortType = "ascending";
      const cardA = "Card2"; //card mounts are equal
      const cardB = "Card3";
      // Act
      const result = sortTwoCardsByLibraryAmount(cardA, cardB, sortType);
      // Assert
      expect(result).toEqual(0);
    });
  });
  describe("should ascending sort two cards by amount of that card in the library correctly", () => {
    it("...by returning a value of -1 when the amount of cardA is lesser than the amount of cardB", () => {
      //Arrange
      const sortType = "descending";
      const cardA = "Card2"; //cardA is lesser
      const cardB = "Card1";
      // Act
      const result = sortTwoCardsByLibraryAmount(cardA, cardB, sortType);
      // Assert
      expect(result).toEqual(-1);
    });
    it("...by returning a value of 1 when the amount of cardA is greater than the amount of cardB", () => {
      //Arrange
      const sortType = "descending";
      const cardA = "Card1"; //cardA is greater
      const cardB = "Card2";
      // Act
      const result = sortTwoCardsByLibraryAmount(cardA, cardB, sortType);
      // Assert
      expect(result).toEqual(1);
    });
    it("...by returning a value of 0 when the amount of cardA and cardB are equal", () => {
      //Arrange
      const sortType = "descending";
      const cardA = "Card3"; // card amounts equal
      const cardB = "Card2";
      // Act
      const result = sortTwoCardsByLibraryAmount(cardA, cardB, sortType);
      // Assert
      expect(result).toEqual(1);
    });
  });
});
