import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function discardFromSetAside()", () => {
  it("should remove the provided card from the setAside zone and add it to the graveyard", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const setAside = ["Sentry", "Vassal"];
    const graveyard = ["Curse"];
    deck.setSetAside(setAside);
    deck.setGraveyard(graveyard);
    const card = "Vassal";

    // Act
    deck.discardFromSetAside(card);
    const resultSetAside = deck.getSetAside();
    const resultGraveyard = deck.getGraveyard();

    // Assert
    expect(resultSetAside).toStrictEqual(["Sentry"]);
    expect(resultGraveyard).toStrictEqual(["Curse", "Vassal"]);
  });
  
  it("throw an Error when the provided card is not in the setAside zone", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const setAside = ["Sentry", "Vassal"];
    deck.setSetAside(setAside);
    const card = "Pot of Greed";

    // Act and Assert
    expect(() => deck.discardFromSetAside(card)).toThrowError(
      "No Pot of Greed in setAside."
    );
  });
});
