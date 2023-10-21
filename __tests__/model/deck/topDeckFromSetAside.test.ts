import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function processTopDecksLine()", () => {
  let deck = new Deck("", false, "", "pNick", "pName", []);

  const setSetAside = jest.spyOn(Deck.prototype, "setSetAside");
  const setLibrary = jest.spyOn(Deck.prototype, "setLibrary");
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should correctly move cards from setAside to library", () => {
    // Arrange
    deck.library = ["Copper", "Estate"];
    deck.setAside = ["Vassal", "Bandit"];

    // Assert - simulate topDecking a card frop setAside
    deck.topDeckFromSetAside("Bandit");

    expect(setLibrary).toBeCalledTimes(1);
    expect(setLibrary).toBeCalledWith(["Copper", "Estate", "Bandit"]);
    expect(setSetAside).toBeCalledTimes(1);
    expect(setSetAside).toBeCalledWith(["Vassal"]);
  });

  it("should throw an error if the given card is not in setAside", () => {
    // Arrange
    deck.setAside = ["Vassal", "Bandit"];

    // Act and Assert
    expect(() => deck.topDeckFromSetAside("Pot of Greed")).toThrowError(
      "No Pot of Greed in setAside."
    );
  });
});
