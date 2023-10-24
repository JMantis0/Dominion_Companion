import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method shuffleGraveYardIntoLibrary() ", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on method dependencies.
  const setLibrary = jest.spyOn(Deck.prototype, "setLibrary");
  const setGraveyard = jest.spyOn(Deck.prototype, "setGraveyard");

  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
    jest.clearAllMocks();
  });

  it("should remove all cards from the graveyard and add them the library", () => {
    // Arrange
    deck.graveyard = ["Harbinger", "Library", "Estate", "Silver"];
    deck.library = ["Sentry", "Vassal"];

    // Act - Simulate shuffling a small graveyard into the library
    deck.shuffleGraveYardIntoLibrary();

    // Assert
    expect(deck.graveyard).toStrictEqual([]);
    expect(deck.library).toStrictEqual([
      "Sentry",
      "Vassal",
      "Silver",
      "Estate",
      "Library",
      "Harbinger",
    ]);
    expect(setLibrary).toBeCalledTimes(1);
    expect(setLibrary).toBeCalledWith([
      "Sentry",
      "Vassal",
      "Silver",
      "Estate",
      "Library",
      "Harbinger",
    ]);
    expect(setGraveyard).toBeCalledTimes(1);
    expect(setGraveyard).toBeCalledWith([]);
  });
});
