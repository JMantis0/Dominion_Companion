import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("drawCardFromPreviousLine", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", [
      "Vassal",
      "Library",
      "Copper",
    ]);
  });

  it("should draw one instance of the card in the most recent logArchive entry", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays a Library.",
      "pNick looks at a Copper.",
      "pNick looks at a Vassal.",
    ];
    deck.setAside = ["Vassal"];
    deck.hand = ["Copper"];

    // Act - Simulate drawing the card from the previous line.
    deck.drawCardFromPreviousLine();

    // Assert - Verify card was moved from setAside to hand.
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.hand).toStrictEqual(["Copper", "Vassal"]);
  });

  it("should throw an error when there is no card found in the most recent logArchive entry", () => {
    // Arrange
    deck.logArchive = ["pNick plays a Militia.", "pNick gets +$2."];

    // Act and Assert - Simulate drawing a card that is not found on the last line.
    expect(() => deck.drawCardFromPreviousLine()).toThrowError(
      "No card found in the most recent logArchive entry."
    );
  });
});
