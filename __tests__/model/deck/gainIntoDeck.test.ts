import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function gainIntoDeck()", () => {
  it("should add one instance of the provided card to the library", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const library = ["Copper"];
    const card = "Chapel";
    deck.setLibrary(library);
    
    // Act
    deck.gainIntoDeck(card);
    const resultLibrary = deck.getLibrary();
    const expectedLibrary = ["Copper", "Chapel"];

    // Assert
    expect(resultLibrary).toStrictEqual(expectedLibrary);
  });
});
