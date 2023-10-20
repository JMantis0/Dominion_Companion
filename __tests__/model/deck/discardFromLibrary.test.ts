import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function discardFromLibrary()", () => {
  it("should remove one instance of the provided card from the library and add it to the graveyard", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const library = ["Estate", "Copper", "Copper", "Copper", "Copper"];
    const graveyard = ["Copper", "Copper", "Copper", "Estate", "Estate"];
    deck.setLibrary(library);
    deck.setGraveyard(graveyard);
    const card = "Copper";

    // Act
    deck.discardFromLibrary(card);
    const resultLibrary = deck.getLibrary();
    const resultGraveyard = deck.getGraveyard();

    const expectedLibrary = ["Estate", "Copper", "Copper", "Copper"]; // One Copper removed.
    const expectedGraveyard = [
      "Copper",
      "Copper",
      "Copper",
      "Estate",
      "Estate",
      "Copper",
    ]; // One Copper added.

    // Assert
    expect(resultLibrary).toEqual(expectedLibrary);
    expect(resultGraveyard).toStrictEqual(expectedGraveyard);
  });
  it("should throw an Error when the provided card is not in the Library", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const library = ["Estate", "Copper", "Copper", "Copper", "Copper"];
    deck.setLibrary(library);
    const card = "Pot of Greed";

    // Act and Assert
    expect(() => deck.discardFromLibrary(card)).toThrowError(
      "No Pot of Greed in library."
    );
  });
});
