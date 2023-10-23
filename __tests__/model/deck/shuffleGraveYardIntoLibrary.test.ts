import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method shuffleGraveYardIntoLibrary() ", () => {
  it("should remove all cards from the graveyard and add them the library", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const graveyard = ["Harbinger", "Library", "Estate", "Silver"];
    const library = ["Sentry", "Vassal"];
    deck.setGraveyard(graveyard);
    deck.setLibrary(library);
    const expectedLibrary = [
      "Sentry",
      "Vassal",
      "Silver",
      "Estate",
      "Library",
      "Harbinger",
    ];
    const expectedGraveyard: string[] = [];

    // Act
    deck.shuffleGraveYardIntoLibrary();
    const resultLibrary = deck.getLibrary();
    const resultGraveyard = deck.getGraveyard();
  
    // Assert
    expect(resultGraveyard).toStrictEqual(expectedGraveyard);
    expect(resultLibrary).toStrictEqual(expectedLibrary);
  });
});
