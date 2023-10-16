import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function trashFromLibrary() ", () => {
  it("should remove an instance of the provided card from library, and add it to trash", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const library = ["Harbinger", "Chapel", "Estate", "Silver"];
    const trash = ["Sentry", "Vassal"];
    const card = "Harbinger";
    deck.setLibrary(library);
    deck.setTrash(trash);
    const expectedLibrary = ["Chapel", "Estate", "Silver"];
    const expectedTrash = ["Sentry", "Vassal", "Harbinger"];

    // Act
    deck.trashFromLibrary(card);
    const resultTrash = deck.getTrash();
    const resultLibrary = deck.getLibrary();

    // Assert
    expect(resultLibrary).toStrictEqual(expectedLibrary);
    expect(resultTrash).toStrictEqual(expectedTrash);
  });

  it("should throw an error if the provided card is not in library", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const library = ["Harbinger", "Chapel", "Estate", "Silver"];
    deck.setLibrary(library);
    const card = "Pot of Greed";

    // Act and Assert
    expect(() => deck.trashFromLibrary(card)).toThrowError(
      "No Pot of Greed in library."
    );
  });
});
