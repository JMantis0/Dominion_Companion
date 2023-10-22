import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function setAsideFromLibrary()", () => {
  it("should remove an instance of the provided card from the library and add it to the setAside zone", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const setAside = ["Bandit"];
    const library = ["Vassal", "Harbinger", "Copper"];
    deck.setLibrary(library);
    deck.setSetAside(setAside);
    const card = "Harbinger";
    const expectedSetAside = ["Bandit", "Harbinger"];
    const expectedLibrary = ["Vassal", "Copper"];

    // Act
    deck.setAsideFromLibrary(card);
    const resultSetAside = deck.getSetAside();
    const resultLibrary = deck.getLibrary();

    // Assert
    expect(resultSetAside).toStrictEqual(expectedSetAside);
    expect(resultLibrary).toStrictEqual(expectedLibrary);
  });

  it("should throw an error when the provided card is not in the library", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const library = ["Vassal", "Harbinger", "Copper"];
    deck.setLibrary(library);
    const card = "Pot of Greed";

    // Act and Assert
    expect(() => deck.setAsideFromLibrary(card)).toThrowError(
      "No Pot of Greed in library."
    );
  });
});
