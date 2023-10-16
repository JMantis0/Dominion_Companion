import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function playFromDiscard()", () => {
  it("should remove one instance of the the provided card from graveyard and add it to inPlay", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const graveyard = ["Copper", "Estate", "Estate", "Sentry"];
    const inPlay = ["Laboratory"];
    const card = "Sentry";
    deck.setGraveyard(graveyard);
    deck.setInPlay(inPlay);
    const expectedGraveyard = ["Copper", "Estate", "Estate"];
    const expectedInPlay = ["Laboratory", "Sentry"];

    // Act
    deck.playFromDiscard(card);
    const resultGraveyard = deck.getGraveyard();
    const resultInPlay = deck.getInPlay();

    // Assert
    expect(resultGraveyard).toStrictEqual(expectedGraveyard);
    expect(resultInPlay).toStrictEqual(expectedInPlay);
  });

  it("should throw an error when the provided card is not in graveyard", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const graveyard = ["Copper", "Estate", "Estate", "Sentry"];
    deck.setGraveyard(graveyard);
    const card = "Pot of Greed";

    // Act and Assert
    expect(() => deck.playFromDiscard(card)).toThrowError(
      `No Pot of Greed in discard pile.`
    );
  });
});
