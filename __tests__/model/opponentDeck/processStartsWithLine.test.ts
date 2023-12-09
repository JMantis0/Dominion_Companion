import { describe, expect, it, beforeEach } from "@jest/globals";
import { OpponentDeck } from "../../../src/model/opponentDeck";

describe("processStartsWithLine", () => {
  let oDeck: OpponentDeck;
  beforeEach(() => {
    oDeck = new OpponentDeck("", false, "", "Player", "P", []);
  });
  it("should add the given cards to the library and entireDeck", () => {
    // Arrange
    oDeck.entireDeck = [];
    // Act
    oDeck.processStartsWithLine(["Copper", "Estate"], [7, 3]);
    // Assert
    expect(oDeck.entireDeck).toStrictEqual([
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
    ]);
  });
  it("should work with shelters", () => {
    // Arrange
    oDeck.entireDeck = [];
    // Act
    oDeck.processStartsWithLine(
      ["Copper", "Hovel", "Necropolis", "Overgrown Estate"],
      [7, 1, 1, 1]
    );
    // Assert
    expect(oDeck.entireDeck).toStrictEqual([
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Hovel",
      "Necropolis",
      "Overgrown Estate",
    ]);
  });
});
