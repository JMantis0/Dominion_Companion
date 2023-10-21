import { describe, it, expect, afterEach, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function trashFromHand() ", () => {
  let deck = new Deck("", false, "", "pName", "pNick", []);
  const setTrash = jest.spyOn(Deck.prototype, "setTrash");
  const removeCardFromEntireDeck = jest.spyOn(
    Deck.prototype,
    "removeCardFromEntireDeck"
  );
  const setHand = jest.spyOn(Deck.prototype, "setHand");
  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
    jest.clearAllMocks();
  });

  it("should remove an instance of the provided card from hand, remove it from the entire deck, and add it to trash", () => {
    // Arrange
    deck.entireDeck = ["Harbinger", "Chapel", "Estate", "Silver", "Vassal"];
    deck.trash = ["Sentry", "Vassal"];
    deck.hand = ["Harbinger", "Chapel", "Estate", "Silver"];

    // Act - Simulate trashing a card from the hand.
    deck.trashFromHand("Harbinger");

    // Assert
    expect(setTrash).toBeCalledTimes(1);
    expect(setTrash).toBeCalledWith(["Sentry", "Vassal", "Harbinger"]);
    expect(removeCardFromEntireDeck).toBeCalledTimes(1);
    expect(removeCardFromEntireDeck).toBeCalledWith("Harbinger");
    expect(setHand).toBeCalledTimes(1);
    expect(setHand).toBeCalledWith(["Chapel", "Estate", "Silver"]);
  });

  it("should throw an error if the provided card is not in hand", () => {
    // Arrange
    deck.hand = ["Harbinger", "Chapel", "Estate", "Silver"];

    // Act and Assert
    expect(() => deck.trashFromHand("Pot of Greed")).toThrowError(
      "No Pot of Greed in hand."
    );
  });
});
