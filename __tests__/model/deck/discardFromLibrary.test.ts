import { it, describe, expect, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { afterEach } from "node:test";

describe("Function discardFromLibrary()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on function dependencies
  const setLibrary = jest.spyOn(Deck.prototype, "setLibrary");
  const setGraveyard = jest.spyOn(Deck.prototype, "setGraveyard");

  afterEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "pName", "pNick", []);
  });
  
  it("should remove one instance of the provided card from the library and add it to the graveyard", () => {
    // Arrange
    deck.library = ["Estate", "Copper", "Copper", "Copper", "Copper"];
    deck.graveyard = ["Copper", "Copper", "Copper", "Estate", "Estate"];

    // Act - Simulate discarding a copper from the Library
    deck.discardFromLibrary("Copper");

    // Assert
    expect(deck.library).toEqual(["Estate", "Copper", "Copper", "Copper"]);
    expect(deck.graveyard).toStrictEqual([
      "Copper",
      "Copper",
      "Copper",
      "Estate",
      "Estate",
      "Copper",
    ]);
    expect(setGraveyard).toBeCalledTimes(1);
    expect(setGraveyard).toBeCalledWith([
      "Copper",
      "Copper",
      "Copper",
      "Estate",
      "Estate",
      "Copper",
    ]);
    expect(setLibrary).toBeCalledTimes(1);
    expect(setLibrary).toBeCalledWith(["Estate", "Copper", "Copper", "Copper"]);
  });

  it("should throw an Error when the provided card is not in the Library", () => {
    // Arrange
    deck.library = ["Estate", "Copper", "Copper", "Copper", "Copper"];

    // Act and Assert - Simulate discarding a card from library that is not in library.
    expect(() => deck.discardFromLibrary("Pot of Greed")).toThrowError(
      "No Pot of Greed in library."
    );
  });
});
