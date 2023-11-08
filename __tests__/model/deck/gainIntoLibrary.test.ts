import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("gainIntoLibrary", () => {
  // Instantiate Deck object.
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pNick", "pName", []);
  });

  it("should add one instance of the provided card to the library and to the entireDeck", () => {
    // Arrange
    deck.library = ["Copper"];
    deck.entireDeck = ["Estate"];

    // Act - Simulate gaining a Silver into the library (as with a Bureaucrat).
    deck.gainIntoLibrary("Silver");

    // Assert
    expect(deck.library).toStrictEqual(["Copper", "Silver"]);
    expect(deck.entireDeck).toStrictEqual(["Estate", "Silver"]);
  });
});
