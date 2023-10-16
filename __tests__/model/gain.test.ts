import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function gain()", () => {
  it("should add the provided card to the graveyard", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const graveyard = ["Copper"];
    const card = "Chapel";
    deck.setGraveyard(graveyard);

    // Act
    deck.gain(card);
    const resultGraveyard = deck.getGraveyard();
    const expectedGraveyard = ["Copper", "Chapel"];

    // Assert
    expect(resultGraveyard).toStrictEqual(expectedGraveyard);
  });
});
