import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function processTopDecksLine()", () => {
  let deck = new Deck("", false, "", "pNick", "pName", []);

  // Mock function dependencies
  const getMostRecentPlay = jest.spyOn(Deck.prototype, "getMostRecentPlay");
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
  it("should handle top decking caused by an Artisan correctly", () => {
    // Arrange deck state
    const logArchive = [
      "Turn 12 - pName",
      "pNick plays a Market.",
      "pNick draws a card.",
      "pNick gets +1 Action.",
      "pNick gets +1 Buy.",
      "pNick gets +$1.",
      "pNick plays an Artisan.",
      "pNick gains a Market.",
    ];
    deck.setLogArchive(logArchive);

    // Arguments for function being tested.
    const cards = ["Bandit"];
    const numberOfCards = [1];

    // Act - Simulate top decking a card with an Artisan
    deck.processTopDecksLine(cards, numberOfCards);

    // Assert
    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(getMostRecentPlay).toBeCalledWith(logArchive);
    expect(getMostRecentPlay.mock.results[0].value).toBe("Artisan");
    expect(topDeckFromHand).toBeCalledTimes(1);
    expect(topDeckFromHand).toBeCalledWith("Bandit");
    expect(topDeckFromGraveyard).not.toBeCalled();
    expect(topDeckFromSetAside).not.toBeCalled();
  });

  it("should handle top decking caused by a Harbinger correctly", () => {
    // Arrange deck state
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive = [
      "pNick plays a Festival.",
      "pNick gets +2 Actions.",
      "pNick gets +1 Buy.",
      "pNick gets +$2.",
      "pNick plays a Harbinger.",
      "pNick draws a Silver.",
      "pNick gets +1 Action.",
      "pNick looks at 3 Coppers, 3 Estates, a Moat, and 2 Poachers.",
    ];
    deck.setLogArchive(logArchive);

    // Arguments for function being tested.
    const cards = ["Poacher"];
    const numberOfCards = [1];

    // Act - Simulate top decking a card with an Artisan
    deck.processTopDecksLine(cards, numberOfCards);

    // Assert
    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(getMostRecentPlay).toBeCalledWith(logArchive);
    expect(getMostRecentPlay.mock.results[0].value).toBe("Harbinger");
    expect(topDeckFromGraveyard).toBeCalledTimes(1);
    expect(topDeckFromGraveyard).toBeCalledWith("Poacher");
    expect(topDeckFromHand).not.toBeCalled();
    expect(topDeckFromSetAside).not.toBeCalled();
  });

  it("should handle top decking caused by a Sentry correctly", () => {
    // Arrange deck state
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive = [
      "pNick plays a Sentry.",
      "pNick draws a Vassal.",
      "pNick gets +1 Action.",
      "pNick shuffles their deck.",
      "pNick looks at a Copper and a Vassal.",
      "pNick trashes a Copper.",
    ];
    deck.setLogArchive(logArchive);

    // Arguments for function being tested.
    const cards = ["Vassal"];
    const numberOfCards = [1];

    // Act - Simulate top decking a card with an Artisan
    deck.processTopDecksLine(cards, numberOfCards);

    // Assert
    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(getMostRecentPlay).toBeCalledWith(logArchive);
    expect(getMostRecentPlay.mock.results[0].value).toBe("Sentry");
    expect(topDeckFromSetAside).toBeCalledTimes(1);
    expect(topDeckFromSetAside).toBeCalledWith("Vassal");
    expect(topDeckFromHand).not.toBeCalled();
    expect(topDeckFromGraveyard).not.toBeCalled();
  });
});
