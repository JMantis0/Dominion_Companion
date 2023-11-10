import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("trashFromLibrary", () => {
  // Declare Deck reference
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should remove an instance of the provided card from library, and add it to trash", () => {
    // Arrange
    deck.entireDeck = ["Harbinger", "Chapel", "Estate", "Silver", "Cellar"];
    deck.library = ["Harbinger", "Chapel", "Estate", "Silver"];
    deck.trash = ["Sentry", "Vassal"];

    // Act - Simulate trashing a Harbinger from library.
    deck.trashFromLibrary("Harbinger");

    // Assert - Verify the card was removed from entireDeck and library, and added to trash
    expect(deck.entireDeck).toStrictEqual([
      "Chapel",
      "Estate",
      "Silver",
      "Cellar",
    ]);
    expect(deck.library).toStrictEqual(["Chapel", "Estate", "Silver"]);
    expect(deck.trash).toStrictEqual(["Sentry", "Vassal", "Harbinger"]);
  });

  it("should throw an error if the provided card is not in library", () => {
    // Arrange
    deck.library = ["Harbinger", "Chapel", "Estate", "Silver"];

    // Act and Assert
    expect(() => deck.trashFromLibrary("Pot of Greed")).toThrowError(
      "No Pot of Greed in library."
    );
  });
});
