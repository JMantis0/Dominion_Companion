import { describe, it, expect, afterEach, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method play()", () => {
  //  Initialize Deck object
  let deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on method dependencies
  const setInPlay = jest.spyOn(Deck.prototype, "setInPlay");
  const setHand = jest.spyOn(Deck.prototype, "setHand");

  afterEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should remove one instance of the the provided card from hand and add it to inPlay", () => {
    // Arrange
    deck.hand = ["Copper", "Estate", "Estate", "Sentry"];
    deck.inPlay = ["Laboratory"];

    // Act - Simulate playing a Sentry from hand into play.
    deck.play("Sentry");

    // Assert
    expect(deck.hand).toStrictEqual(["Copper", "Estate", "Estate"]);
    expect(deck.inPlay).toStrictEqual(["Laboratory", "Sentry"]);
    expect(setInPlay).toBeCalledTimes(1);
    expect(setInPlay).toBeCalledWith(["Laboratory", "Sentry"]);
    expect(setHand).toBeCalledTimes(1);
    expect(setHand).toBeCalledWith(["Copper", "Estate", "Estate"]);
  });

  it("should throw an error when the provided card is not in hand", () => {
    // Arrange
    deck.hand = ["Copper", "Estate", "Estate", "Sentry"];

    // Act and Assert - Simulate trying to play a card that is not in hand.
    expect(() => deck.play("Pot of Greed")).toThrowError(
      `No Pot of Greed in hand.`
    );
  });
});
