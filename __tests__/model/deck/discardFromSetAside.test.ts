import { describe, it, expect, afterEach, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function discardFromSetAside()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on function dependencies
  const setSetAside = jest.spyOn(Deck.prototype, "setSetAside");
  const setGraveyard = jest.spyOn(Deck.prototype, "setGraveyard");

  afterEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should remove the provided card from the setAside zone and add it to the graveyard", () => {
    // Arrange
    deck.setAside = ["Sentry", "Vassal"];
    deck.graveyard = ["Curse"];

    // Act - Simulate discarding a Vassal from setAside.
    deck.discardFromSetAside("Vassal");

    // Assert
    expect(deck.setAside).toStrictEqual(["Sentry"]);
    expect(deck.graveyard).toStrictEqual(["Curse", "Vassal"]);
    expect(setGraveyard).toBeCalledTimes(1);
    expect(setGraveyard).toBeCalledWith(["Curse", "Vassal"]);
    expect(setSetAside).toBeCalledTimes(1);
    expect(setSetAside).toBeCalledWith(["Sentry"]);
  });

  it("throw an Error when the provided card is not in the setAside zone", () => {
    // Arrange
    deck.setAside = ["Sentry", "Vassal"];

    // Act and Assert
    expect(() => deck.discardFromSetAside("Pot of Greed")).toThrowError(
      "No Pot of Greed in setAside."
    );
  });
});
