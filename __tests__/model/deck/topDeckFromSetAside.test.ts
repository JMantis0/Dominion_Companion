import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method processTopDecksLine()", () => {
  // Instantiate Deck object
  let deck = new Deck("", false, "", "pNick", "pName", []);
  // Spy on method dependencies
  const setSetAside = jest.spyOn(Deck.prototype, "setSetAside");
  const setLibrary = jest.spyOn(Deck.prototype, "setLibrary");

  afterEach(() => {
    deck = new Deck("", false, "", "pNick", "pName", []);
    jest.clearAllMocks();
  });

  it("should correctly move cards from setAside to library", () => {
    // Arrange
    deck.library = ["Copper", "Estate"];
    deck.setAside = ["Vassal", "Bandit"];

    // Assert - simulate topDecking a card from setAside
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
