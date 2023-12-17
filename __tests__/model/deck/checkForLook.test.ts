import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("checkForLook", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should return true when the current line is looking at a card due to a play matching the given card", () => {
    // Arrange
    deck.latestAction = "Library";

    // Act and Assert
    expect(
      deck.checkForLook("pNick looks at a Silver.", "Library")
    ).toBeTruthy();
    // Arrange 2
    deck.latestAction = "Crystal Ball";

    // Act and Assert
    expect(
      deck.checkForLook("pNick looks at a Silver.", "Crystal Ball")
    ).toBeTruthy();
  });

  it("should return false when the curring line is looking at a card but it was not due to a play of the given Card", () => {
    // Arrange
    deck.latestAction = "Sentry";

    // Act and Assert
    expect(
      deck.checkForLook("pNick looks at 2 Coppers.", "Library")
    ).toBeFalsy();
  });

  it("should return false if the current line is not looking at a card", () => {
    // Act and Assert
    expect(
      deck.checkForLook("pNick discards 2 Coppers.", "Library")
    ).toBeFalsy();
  });
});
