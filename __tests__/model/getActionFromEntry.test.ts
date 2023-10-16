import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function getActionFromEntry()", () => {
  it("should return an act for the provided line, if there is one", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const line = "pNick trashes a Copper.";

    // Act
    const result = deck.getActionFromEntry(line);

    // Assert
    expect(result).toStrictEqual("trashes");
  });
  it("should return 'None' if no action is found in the provided line", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const line = "pNick gets +$3.";

    // Act
    const result = deck.getActionFromEntry(line);

    // Assert
    expect(result).toBe("None");
  });
});
