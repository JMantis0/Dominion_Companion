import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method topDeckFromHand() ", () => {
  // Instantiate Deck object
  let deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on method dependency
  const setLibrary = jest.spyOn(Deck.prototype, "setLibrary");
  const setHand = jest.spyOn(Deck.prototype, "setHand");

  afterEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should remove an instance of the provided card from hand, and add it to library", () => {
    // Arrange
    deck.hand = ["Harbinger", "Library", "Estate", "Silver"];
    deck.library = ["Sentry", "Vassal"];

    // Act - Simulate topdecking a Harbinger from hand.
    deck.topDeckFromHand("Harbinger");

    // Assert
    expect(deck.hand).toStrictEqual(["Library", "Estate", "Silver"]);
    expect(deck.library).toStrictEqual(["Sentry", "Vassal", "Harbinger"]);
    expect(setLibrary).toBeCalledTimes(1);
    expect(setLibrary).toBeCalledWith(["Sentry", "Vassal", "Harbinger"]);
    expect(setHand).toBeCalledTimes(1);
    expect(setHand).toBeCalledWith(["Library", "Estate", "Silver"]);
  });

  it("should throw an error if the provided card is not in hand", () => {
    // Arrange

    // Act and Assert
    expect(() => deck.topDeckFromHand("Pot of Greed")).toThrowError(
      "No Pot of Greed in hand."
    );
  });
});
