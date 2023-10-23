import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method playFromDiscard()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on method dependencies
  const setGraveyard = jest.spyOn(Deck.prototype, "setGraveyard");
  const setInPlay = jest.spyOn(Deck.prototype, "setInPlay");
  
  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
    jest.clearAllMocks();
  });

  it("should remove one instance of the the provided card from graveyard and add it to inPlay.", () => {
    // Arrange
    deck.graveyard = ["Copper", "Estate", "Estate", "Sentry"];
    deck.inPlay = ["Laboratory"];

    // Act - Simulate playing a card from graveyard (as with a Vassal).
    deck.playFromDiscard("Sentry");

    // Assert
    expect(deck.graveyard).toStrictEqual(["Copper", "Estate", "Estate"]);
    expect(deck.inPlay).toStrictEqual(["Laboratory", "Sentry"]);
    expect(setGraveyard).toBeCalledTimes(1);
    expect(setGraveyard).toBeCalledWith(["Copper", "Estate", "Estate"]);
    expect(setInPlay).toBeCalledTimes(1);
    expect(setInPlay).toBeCalledWith(["Laboratory", "Sentry"]);
  });

  it("should throw an error when the provided card is not in graveyard.", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const graveyard = ["Copper", "Estate", "Estate", "Sentry"];
    deck.setGraveyard(graveyard);
    const card = "Pot of Greed";

    // Act and Assert - Simulate trying to play a card from the graveyard that isn't there.
    expect(() => deck.playFromDiscard(card)).toThrowError(
      `No Pot of Greed in discard pile.`
    );
  });
});
