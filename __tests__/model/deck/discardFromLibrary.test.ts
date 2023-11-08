import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { afterEach } from "node:test";

describe("Method discardFromLibrary()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", []);

  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should remove one instance of the provided card from the library and add it to the graveyard", () => {
    // Arrange
    deck.library = ["Estate", "Copper", "Copper", "Copper", "Copper"];
    deck.graveyard = ["Copper", "Copper", "Copper", "Estate", "Estate"];

    // Act - Simulate discarding a copper from the Library
    deck.discardFromLibrary("Copper");

    // Assert
    expect(deck.library).toEqual(["Estate", "Copper", "Copper", "Copper"]);
    expect(deck.graveyard).toStrictEqual([
      "Copper",
      "Copper",
      "Copper",
      "Estate",
      "Estate",
      "Copper",
    ]);
  });

  it("should throw an Error when the provided card is not in the Library", () => {
    // Arrange
    deck.library = ["Estate", "Copper", "Copper", "Copper", "Copper"];

    // Act and Assert - Simulate discarding a card from library that is not in library.
    expect(() => deck.discardFromLibrary("Pot of Greed")).toThrowError(
      "No Pot of Greed in library."
    );
  });
});
