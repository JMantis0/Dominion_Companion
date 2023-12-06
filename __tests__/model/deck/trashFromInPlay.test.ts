import { beforeEach, describe, expect, it } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("trashFromInPlay", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });
  it("should move the given cards from the inPlay field to the trash field", () => {
    // Arrange
    deck.inPlay = ["Vassal", "Treasure Map"];
    deck.trash = ["Estate"];
    deck.entireDeck = ["Vassal", "Treasure Map", "Sentry", "Silver"];
    // Act
    deck.trashFromInPlay("Treasure Map");
    // Assert - Verify the card was removed from inPlay, and entireDeck.
    expect(deck.inPlay).toStrictEqual(["Vassal"]);
    expect(deck.entireDeck).toStrictEqual(["Vassal", "Sentry", "Silver"]);
    // Verify card was added to the trash.
    expect(deck.trash).toStrictEqual(["Estate", "Treasure Map"]);
  });
});
