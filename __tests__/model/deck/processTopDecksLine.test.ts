import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method processTopDecksLine()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pNick", "pName", []);

  // Spy on method dependencies
  const topDeckFromGraveyard = jest
    .spyOn(Deck.prototype, "topDeckFromGraveyard")
    .mockImplementation(() => null);
  const topDeckFromHand = jest
    .spyOn(Deck.prototype, "topDeckFromHand")
    .mockImplementation(() => null);
  const topDeckFromSetAside = jest
    .spyOn(Deck.prototype, "topDeckFromSetAside")
    .mockImplementation(() => null);

  afterEach(() => {
    deck = new Deck("", false, "", "pNick", "pName", []);
    jest.clearAllMocks();
  });

  it("should move cards topdecked by an Artisan from hand.", () => {
    // Arrange deck state
    deck.latestPlay = "Artisan";

    // Arguments for function being tested.
    const cards = ["Bandit"];
    const numberOfCards = [1];

    // Act - Simulate top decking a card with an Artisan.
    deck.processTopDecksLine(cards, numberOfCards);

    // Assert
    expect(topDeckFromHand).toBeCalledTimes(1);
    expect(topDeckFromHand).toBeCalledWith("Bandit");
    expect(topDeckFromGraveyard).not.toBeCalled();
    expect(topDeckFromSetAside).not.toBeCalled();
  });

  it("should move cards topdecked by a Harbinger from graveyard.", () => {
    // Arrange deck state
    deck.latestPlay = "Harbinger";

    // Arguments for function being tested.
    const cards = ["Poacher"];
    const numberOfCards = [1];

    // Act - Simulate top decking a card with a Harbinger.
    deck.processTopDecksLine(cards, numberOfCards);

    // Assert
    expect(topDeckFromGraveyard).toBeCalledTimes(1);
    expect(topDeckFromGraveyard).toBeCalledWith("Poacher");
    expect(topDeckFromHand).not.toBeCalled();
    expect(topDeckFromSetAside).not.toBeCalled();
  });

  it("should move cards topdecked by a Sentry from setAside.", () => {
    // Arrange deck state
    deck.latestPlay = "Sentry";
    // Arguments for function being tested.
    const cards = ["Vassal"];
    const numberOfCards = [1];

    // Act - Simulate top decking a card with an Sentry.
    deck.processTopDecksLine(cards, numberOfCards);

    // Assert
    expect(topDeckFromSetAside).toBeCalledTimes(1);
    expect(topDeckFromSetAside).toBeCalledWith("Vassal");
    expect(topDeckFromHand).not.toBeCalled();
    expect(topDeckFromGraveyard).not.toBeCalled();
  });
});
