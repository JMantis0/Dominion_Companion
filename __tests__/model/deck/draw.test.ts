import { describe, it, expect, afterEach, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method draw()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on method dependencies
  const setLibrary = jest.spyOn(Deck.prototype, "setLibrary");
  const setHand = jest.spyOn(Deck.prototype, "setHand");

  afterEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should remove one instance of the provided card from the library and add it to the hand", () => {
    // Arrange
    deck.hand = ["Copper", "Copper", "Copper", "Estate", "Estate"];
    deck.library = ["Estate", "Copper", "Copper", "Copper", "Copper"];

    // Act - Simulate drawing a Copper from library to hand.
    deck.draw("Copper");

    expect(deck.hand).toStrictEqual([
      "Copper",
      "Copper",
      "Copper",
      "Estate",
      "Estate",
      "Copper",
    ]);
    expect(deck.library).toStrictEqual([
      "Estate",
      "Copper",
      "Copper",
      "Copper",
    ]);
    expect(setLibrary).toBeCalledTimes(1);
    expect(setLibrary).toBeCalledWith(["Estate", "Copper", "Copper", "Copper"]);
    expect(setHand).toBeCalledTimes(1);
    expect(setHand).toBeCalledWith([
      "Copper",
      "Copper",
      "Copper",
      "Estate",
      "Estate",
      "Copper",
    ]);
  });

  it("should throw an error when the provided card is not in library", () => {
    // Arrange
    deck.library = ["Estate", "Copper", "Copper", "Copper", "Copper"];

    // Act and Assert - Simulate drawing a card that is not in library.
    expect(() => deck.draw("Sentry")).toThrowError("No Sentry in library.");
  });
});
