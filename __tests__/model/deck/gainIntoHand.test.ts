import { it, describe, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function gainIntoLibrary()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pNick", "pName", []);
  // Spy on function dependency.
  const setHand = jest.spyOn(Deck.prototype, "setHand");
  const addCardToEntireDeck = jest.spyOn(Deck.prototype, "addCardToEntireDeck");

  afterEach(() => {
    deck = new Deck("", false, "", "pNick", "pName", []);
    jest.clearAllMocks();
  });

  it("should add the provided card to the hand", () => {
    // Arrange
    deck.hand = ["Copper"];
    deck.entireDeck = ["Estate", "Copper"];

    // Act - Simulate gaining a Chapel into hand (as with Artisan).
    deck.gainIntoHand("Chapel");

    // Assert
    expect(deck.hand).toStrictEqual(["Copper", "Chapel"]);
    expect(deck.entireDeck).toStrictEqual(["Estate", "Copper", "Chapel"]);
    expect(setHand).toBeCalledTimes(1);
    expect(setHand).toBeCalledWith(["Copper", "Chapel"]);
    expect(addCardToEntireDeck).toBeCalledTimes(1);
    expect(addCardToEntireDeck).toBeCalledWith("Chapel");
  });
});
