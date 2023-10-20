import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function checkForBanditTrash()", () => {
  it("should return true if the trash activity in the last line of the logArchive was caused by a Bandit", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "oNick plays a Bandit.",
      "oNick gains a Gold.",
      "pNick reveals a Silver and an Estate.",
      "pNick trashes a Silver.", // trash caused by a Bandit
    ];
    deck.setLogArchive(logArchive);

    // Act
    const result = deck.checkForBanditTrash();

    // Assert
    expect(result).toBeTruthy();
  });
  it("should return false if the trash activity in the last line of the logArchive was not caused by a Bandit", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const logArchive = [
      "pNick plays a Chapel.",
      "pNick trashes an Estate.", // trash caused by a Chapel
    ];
    deck.setLogArchive(logArchive);

    // Act
    const result = deck.checkForBanditTrash();

    // Assert
    expect(result).toBeFalsy();
  });
});
