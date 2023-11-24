import { it, describe, expect, jest, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("setAsideFromLibrary", () => {
  // Declare Deck reference.
  let deck: Deck;

  beforeEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should remove an instance of the provided card from the library and add it to the setAside zone", () => {
    // Arrange
    deck.setAside = ["Bandit"];
    deck.library = ["Vassal", "Harbinger", "Copper"];

    // Act - Simulate setting aside a Harbinger from library.
    deck.setAsideFromLibrary("Harbinger");

    // Assert - Verify card was moved from library to setAside.
    expect(deck.setAside).toStrictEqual(["Bandit", "Harbinger"]);
    expect(deck.library).toStrictEqual(["Vassal", "Copper"]);
  });

  it("should throw an error when the provided card is not in the library", () => {
    // Arrange
    deck.library = ["Vassal", "Harbinger", "Copper"];

    // Act and Assert - Simulate trying to set aside a card that is not in the library.
    expect(() => deck.setAsideFromLibrary("Pot of Greed")).toThrowError(
      "No Pot of Greed in library."
    );
  });
});
