import { describe, it, expect, jest } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function processDiscardsLine()", () => {
  // Case discard from hand
  it("should discarding cards from hand correctly", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive = ["Turn 5 - oName", "o plays a Militia.", "o gets +$2."];
    deck.setLogArchive(logArchive);
    deck.setLastEntryProcessed("o gets +$2.");
    deck.setHand(["Copper", "Estate"]);
    const cards = ["Copper", "Estate"];
    const numberOfCards = [1, 1];

    // Mock dependency functions
    const getMostRecentPlay = jest.spyOn(Deck.prototype, "getMostRecentPlay");
    const discardFromSetAside = jest.spyOn(
      Deck.prototype,
      "discardFromSetAside"
    );
    const discardFromLibrary = jest.spyOn(Deck.prototype, "discardFromLibrary");
    const discard = jest.spyOn(Deck.prototype, "discard");

    // Act - Simulate discarding two cards to an opponent's Militia.
    deck.processDiscardsLine(cards, numberOfCards);

    // Assert
    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(getMostRecentPlay.mock.results[0].value).toBe("Militia");
    expect(discard).toBeCalledTimes(2);
    expect(discard).nthCalledWith(1, "Copper");
    expect(discard).nthCalledWith(2, "Estate");
    //  Negative Assertions
    expect(discardFromSetAside).not.toBeCalled();
    expect(discardFromLibrary).not.toBeCalled();
  });
  // Case discard from library (deck)
  it("should discarding cards from the library correctly", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive = [
      "pNick plays a Merchant.",
      "pNick draws a Copper.",
      "pNick gets +1 Action.",
      "pNick plays a Vassal.",
      "pNick gets +$2.",
    ];
    deck.setLogArchive(logArchive);
    deck.setLastEntryProcessed("pNick gets +$2.");
    deck.setLibrary(["Silver"]);
    const cards = ["Silver"];
    const numberOfCards = [1];

    // Mock dependency functions
    const getMostRecentPlay = jest.spyOn(Deck.prototype, "getMostRecentPlay");
    const discardFromSetAside = jest.spyOn(
      Deck.prototype,
      "discardFromSetAside"
    );
    const discardFromLibrary = jest.spyOn(Deck.prototype, "discardFromLibrary");
    const discard = jest.spyOn(Deck.prototype, "discard");

    // Act - Simulate discarding from library with Vassal.
    deck.processDiscardsLine(cards, numberOfCards);

    // Assert
    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(getMostRecentPlay.mock.results[0].value).toBe("Vassal");
    expect(discardFromLibrary).toBeCalledTimes(1);
    expect(discardFromLibrary).toBeCalledWith("Silver");
    // Negative Assertions
    expect(discardFromSetAside).not.toBeCalled();
    expect(discard).not.toBeCalled();
  });

  // Case discard from set aside zone
  it("should discarding cards from the set aside zone correctly", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive = [
      "R plays a Library.",
      "R looks at a card.",
      "R looks at a card.",
      "R sets a card aside with Library.",
      "R shuffles their deck.",
      "R looks at a card.",
      "R sets a card aside with Library.",
    ];

    deck.setLogArchive(logArchive);
    deck.setLastEntryProcessed("pNick gets +$2.");
    deck.setSetAside(["Chapel", "Poacher", "Poacher"]);
    const cards = ["Chapel", "Poacher"];
    const numberOfCards = [1, 2];

    // Mock dependency functions
    const getMostRecentPlay = jest.spyOn(Deck.prototype, "getMostRecentPlay");
    const discardFromSetAside = jest.spyOn(
      Deck.prototype,
      "discardFromSetAside"
    );
    const discardFromLibrary = jest.spyOn(Deck.prototype, "discardFromLibrary");
    const discard = jest.spyOn(Deck.prototype, "discard");

    // Act - simulate discarding 3 cards by playing a Library.
    deck.processDiscardsLine(cards, numberOfCards);

    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(getMostRecentPlay.mock.results[0].value).toBe("Library");
    expect(discardFromSetAside).toBeCalledTimes(3);
    expect(discardFromSetAside).nthCalledWith(1, "Chapel");
    expect(discardFromSetAside).nthCalledWith(2, "Poacher");
    expect(discardFromSetAside).nthCalledWith(3, "Poacher");
    expect(discardFromLibrary).not.toBeCalled();
    expect(discard).not.toBeCalled();
  });
});
