import { describe, it, expect } from "@jest/globals";
import { sortTwoCardsByProbability } from "../../src/utils/utils";
import { StoreDeck } from "../../src/utils";

describe("Function sortTwoCardsByProbability()", () => {
  //Arrange

  const deck: StoreDeck = {
    currentVP: 0,
    gameResult: "Unfinished",
    gameTitle: "",
    gameTurn: 0,
    kingdom: [],
    lastEntryProcessed: "",
    logArchive: [],
    playerName: "",
    playerNick: "",
    rating: "",
    treasurePopped: false,
    waitToDrawLibraryLook: false,
    waitToShuffle: false,
    entireDeck: ["Card1", "Card1", "Card2", "Card3"],
    library: ["Card1", "Card1", "Card2", "Card3"],
    graveyard: [],
    inPlay: [],
    hand: [],
    trash: [],
    setAside: [],
  };
  const topCardsLookAmount = 1;
  const turn = "Current";
  describe("should sort ascending correctly", () => {
    it("...by returning value -1 if probability of drawing cardA is greater than cardB", () => {});
    // Arrange
    const cardA = "Card1"; // cardA has greater probability
    const cardB = "Card2";
    const sortType = "ascending";

    // Act
    const result = sortTwoCardsByProbability(
      cardA,
      cardB,
      sortType,
      deck,
      topCardsLookAmount,
      turn
    );
    // Assert
    expect(result).toBe(-1);

    it("... and by returning value 1 if probability of drawing cardA is lesser than cardB", () => {
      // Arrange
      const cardA = "Card2"; // cardA has lesser probability
      const cardB = "Card1";
      const sortType = "ascending";

      // Act
      const result = sortTwoCardsByProbability(
        cardA,
        cardB,
        sortType,
        deck,
        topCardsLookAmount,
        turn
      );
      // Assert
      expect(result).toBe(1);
    });

    it("...and by returning 0 if probability of drawing cardA is equal to cardB", () => {
      // Arrange
      const cardA = "Card2"; // equal probabilities
      const cardB = "Card3";
      const sortType = "ascending";

      // Act
      const result = sortTwoCardsByProbability(
        cardA,
        cardB,
        sortType,
        deck,
        topCardsLookAmount,
        turn
      );
      // Assert
      expect(result).toBe(0);
    });
  });
  describe("should sort descending correctly", () => {
    it("... by returning value 1 if probability of drawing cardA is greater than cardB,", () => {
      // Arrange
      const cardA = "Card1"; // cardA greater probability
      const cardB = "Card2";
      const sortType = "descending";

      // Act
      const result = sortTwoCardsByProbability(
        cardA,
        cardB,
        sortType,
        deck,
        topCardsLookAmount,
        turn
      );
      // Assert
      expect(result).toBe(1);
    });

    it("... by returning -1 if probability of drawing cardA is less than cardB", () => {
      // Arrange
      const cardA = "Card2"; // cardA lesser probability
      const cardB = "Card1";
      const sortType = "descending";

      // Act
      const result = sortTwoCardsByProbability(
        cardA,
        cardB,
        sortType,
        deck,
        topCardsLookAmount,
        turn
      );
      // Assert
      expect(result).toBe(-1);
    });

    it("...and by returning 0 if probability of drawing cardA is equal to cardB", () => {
      // Arrange
      const cardA = "Card2"; // equal probabilities
      const cardB = "Card3";
      const sortType = "descending";

      // Act
      const result = sortTwoCardsByProbability(
        cardA,
        cardB,
        sortType,
        deck,
        topCardsLookAmount,
        turn
      );
      // Assert
      expect(result).toBe(0);
    });
  });
});
