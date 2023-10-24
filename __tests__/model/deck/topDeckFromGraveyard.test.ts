import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method topDeckFromGraveyard() ", () => {
  // Instantiate Deck object
  let deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on method dependencies
  const setLibrary = jest.spyOn(Deck.prototype, "setLibrary");
  const setGraveyard = jest.spyOn(Deck.prototype, "setGraveyard");

  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
    jest.clearAllMocks();
  });

  it("should remove an instance of the provided card from graveyard, and add it to library", () => {
    // Arrange
    deck.graveyard = ["Harbinger", "Library", "Estate", "Silver"];
    deck.library = ["Sentry", "Vassal"];

    // Act - Simulate topdecking a Harbinger from graveyard.
    deck.topDeckFromGraveyard("Harbinger");

    // Assert
    expect(deck.graveyard).toStrictEqual(["Library", "Estate", "Silver"]);
    expect(deck.library).toStrictEqual(["Sentry", "Vassal", "Harbinger"]);
    expect(setLibrary).toBeCalledTimes(1);
    expect(setLibrary).toBeCalledWith(["Sentry", "Vassal", "Harbinger"]);
    expect(setGraveyard).toBeCalledTimes(1);
    expect(setGraveyard).toBeCalledWith(["Library", "Estate", "Silver"]);
  });

  it("should throw an error if the provided card is not in graveyard", () => {
    // Arrange
    deck.graveyard = ["Harbinger", "Library", "Estate", "Silver"];

    // Act and Assert
    expect(() => deck.topDeckFromGraveyard("Pot of Greed")).toThrowError(
      "No Pot of Greed in discard pile."
    );
  });
});
