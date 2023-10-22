import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function processTopDecksLine()", () => {
  let deck = new Deck("", false, "", "pNick", "pName", []);

  // Mock function dependencies
  const trashFromLibrary = jest
    .spyOn(Deck.prototype, "trashFromLibrary")
    .mockImplementation(() => null);
  const trashFromHand = jest
    .spyOn(Deck.prototype, "trashFromHand")
    .mockImplementation(() => null);
  const trashFromSetAside = jest
    .spyOn(Deck.prototype, "trashFromSetAside")
    .mockImplementation(() => null);

  afterEach(() => {
    deck = new Deck("", false, "", "pNick", "pName", []);
    jest.clearAllMocks();
  });

  it("should handle trashing a card from hand correctly", () => {
    //Arrange
    deck.latestPlay = "Moneylender";

    // Arguments for function being tested.
    const cards = ["Copper"];
    const numberOfCards = [1];

    // Act - simulate trashing a Copper from hand by a Moneylender.
    deck.processTrashesLine(cards, numberOfCards);

    // Assert

    expect(trashFromHand).toBeCalledTimes(1);
    expect(trashFromHand).toBeCalledWith("Copper");

    expect(trashFromLibrary).not.toBeCalled();
  });

  it("should handle trashing a card with a Sentry correctly", () => {
    // Arrange
    deck.latestPlay = "Sentry";

    // Arguments for function being tested.
    const cards = ["Estate", "Copper"];
    const numberOfCards = [1, 1];

    // Act - simulate trashing an Estate and a Copper from setAside by a Sentry.
    deck.processTrashesLine(cards, numberOfCards);

    // Assert
    expect(trashFromSetAside).toBeCalledTimes(2);
    expect(trashFromSetAside).nthCalledWith(1, "Estate");
    expect(trashFromSetAside).nthCalledWith(2, "Copper");
    expect(trashFromHand).not.toBeCalled();
    expect(trashFromLibrary).not.toBeCalled();
  });

  it("should handle trashing a card with a Bandit correctly", () => {
    // Arrange
    deck.latestPlay = "Bandit";
    // Arguments for function being tested.
    const cards = ["Silver"];
    const numberOfCards = [1];

    // Act - simulate trashing a Silver from library by a Bandit.
    deck.processTrashesLine(cards, numberOfCards);

    // Assert
    expect(trashFromLibrary).toBeCalledTimes(1);
    expect(trashFromLibrary).toBeCalledWith("Silver");
    expect(trashFromHand).not.toBeCalled();
    expect(trashFromSetAside).not.toBeCalled();
  });
});
