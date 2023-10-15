import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function checkForVassalDiscard()", () => {
  it("should return true if the most recent play was a Vassal", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "pNick plays a Poacher.",
      "pNick draws a Vassal.",
      "pNick gets +1 Action.",
      "pNick gets +$1.",
      "pNick plays a Vassal.",
      "pNick gets +$2.",
    ];
    deck.setLogArchive(logArchive);

    // Act
    const result = deck.checkForVassalDiscard();

    // Assert
    expect(result).toBeTruthy();
  });

  it("should return true if the most recent play was a Vassal", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "oNick plays a Bandit.",
      "oNick gains a Gold.",
      "pNick reveals a Gold and a Smithy.",
      "pNick trashes a Gold.",
    ];
    deck.setLogArchive(logArchive);

    // Act
    const result = deck.checkForVassalDiscard();

    // Assert
    expect(result).toBeFalsy();
  });
});
