import { it, describe, expect, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { afterEach } from "node:test";

describe("Function gain()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pNick", "pName", []);
  // Spy on function dependency.
  const setGraveyard = jest.spyOn(Deck.prototype, "setGraveyard");
  const addCardToEntireDeck = jest.spyOn(Deck.prototype, "addCardToEntireDeck");

  afterEach(() => {
    deck = new Deck("", false, "", "pNick", "pName", []);
    jest.clearAllMocks();
  });

  it("should add the provided card to the graveyard and to the entireDeck", () => {
    // Arrange
    deck.graveyard = ["Copper"];
    deck.entireDeck = ["Estate", "Copper"];
    // Act - Simulate gaining a Chapel into the graveyard.
    deck.gain("Chapel");

    // Assert
    expect(deck.graveyard).toStrictEqual(["Copper", "Chapel"]);
    expect(deck.entireDeck).toStrictEqual(["Estate", "Copper", "Chapel"]);
    expect(setGraveyard).toBeCalledTimes(1);
    expect(setGraveyard).toBeCalledWith(["Copper", "Chapel"]);
    expect(addCardToEntireDeck).toBeCalledTimes(1);
    expect(addCardToEntireDeck).toBeCalledWith("Chapel");
  });
});
