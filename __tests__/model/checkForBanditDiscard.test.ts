import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function checkForBanditDiscard()", () => {
  it("should return true if the activity in the last line of the logArchive was caused by a bandit", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "oNick plays a Bandit.",
      "oNick gains a Gold.",
      "rNick reveals a Silver and a Province.",
      "rNick trashes a Silver",
      "rNick discards a Province", // discard activity caused by Bandit
    ];
    deck.setLogArchive(logArchive);

    // Act
    const result = deck.checkForBanditDiscard();

    // Assert
    expect(result).toBeTruthy();
  });
  it("should return false if the activity in the last line of the logArchive was not by a bandit", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "oNick", []);
    const logArchive = [
      "pNick plays a Vassal.",
      "pNick gets +$2.",
      "pNick discards a Silver", // discard activity caused by Vassal
    ];
    deck.setLogArchive(logArchive);

    // Act
    const result = deck.checkForBanditDiscard();

    // Assert
    expect(result).toBeFalsy();
  });
});
