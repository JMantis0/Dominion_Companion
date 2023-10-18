import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function checkForMineGain()", () => {
  it("should return true when the most recent in the logArchive is a Mine", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = ["pNick plays a Mine.", "pNick trashes a copper."];
    deck.setLogArchive(logArchive);
    // Act
    const result = deck.checkForMineGain();
    // Assert
    expect(result).toBe(true);
  });
});
it("should return false if the most recent play in the logArchive is not a Mine", () => {
  // Arrange
  const deck = new Deck("", false, "", "pName", "pNick", []);
  const logArchive = [
    "pNick plays a Village.",
    "pNick draws a Copper.",
    "pNick gets +2 Actions.",
  ];
  deck.setLogArchive(logArchive);
  // Act
  const result = deck.checkForMineGain();
  // Assert
  expect(result).toBe(false);
});
