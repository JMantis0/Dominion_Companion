import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method topDeckFromGraveyard() ", () => {
  it("should remove an instance of the provided card from graveyard, and add it to library", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const graveyard = ["Harbinger", "Library", "Estate", "Silver"];
    const library = ["Sentry", "Vassal"];
    const card = "Harbinger";
    deck.setGraveyard(graveyard);
    deck.setLibrary(library);
    const expectedGraveyard = ["Library", "Estate", "Silver"];
    const expectedLibrary = ["Sentry", "Vassal", "Harbinger"];

    // Act
    deck.topDeckFromGraveyard(card);
    const resultLibrary = deck.getLibrary();
    const resultGraveyard = deck.getGraveyard();

    // Assert
    expect(resultGraveyard).toStrictEqual(expectedGraveyard);
    expect(resultLibrary).toStrictEqual(expectedLibrary);
  });

  it("should throw an error if the provided card is not in graveyard", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const graveyard = ["Harbinger", "Library", "Estate", "Silver"];
    deck.setGraveyard(graveyard);
    const card = "Pot of Greed";

    // Act and Assert
    expect(() => deck.topDeckFromGraveyard(card)).toThrowError(
      "No Pot of Greed in discard pile."
    );
  });
});
