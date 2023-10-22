import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function processDiscardsLine()", () => {
  // jest.mock("../../../src/model/deck");
  let deck = new Deck("", false, "", "pNick", "pName", []);
  // Mock dependency functions
  const discardFromSetAside = jest
    .spyOn(Deck.prototype, "discardFromSetAside")
    .mockImplementation(() => null);
  const discardFromLibrary = jest
    .spyOn(Deck.prototype, "discardFromLibrary")
    .mockImplementation(() => null);
  const discard = jest
    .spyOn(Deck.prototype, "discard")
    .mockImplementation(() => null);

  afterEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "pNick", "pName", []);
  });
  // Case discard from hand
  it("should handle discarding cards from hand correctly", () => {
    // Arrange
    deck.latestPlay = "Militia";
    const cards = ["Copper", "Estate"];
    const numberOfCards = [1, 1];

    // Act - Simulate discarding two cards to an opponent's Militia.
    deck.processDiscardsLine(cards, numberOfCards);

    // Assert
    expect(discard).toBeCalledTimes(2);
    expect(discard).nthCalledWith(1, "Copper");
    expect(discard).nthCalledWith(2, "Estate");
    //  Negative Assertions
    expect(discardFromSetAside).not.toBeCalled();
    expect(discardFromLibrary).not.toBeCalled();
  });

  // Case discard from library (deck)
  it("should discard from the library when caused by Vassal", () => {
    // Arrange
    deck.latestPlay = "Vassal";
    const cards = ["Silver"];
    const numberOfCards = [1];

    // Act - Simulate discarding from library with Vassal.
    deck.processDiscardsLine(cards, numberOfCards);

    // Assert
    expect(discardFromLibrary).toBeCalledTimes(1);
    expect(discardFromLibrary).toBeCalledWith("Silver");
    expect(discardFromSetAside).not.toBeCalled();
    expect(discard).not.toBeCalled();
  });

  it("should discard from setAside when cause by Bandit", () => { // This will fail until we get a reveals handler
    // Arrange
    deck.latestPlay = "Bandit";
    const cards = ["Smithy"];
    const numberOfCards = [1];

    // Act - Simulate discarding from library with Vassal.
    deck.processDiscardsLine(cards, numberOfCards);

    // Assert

    expect(discardFromSetAside).toBeCalledTimes(1);
    expect(discardFromSetAside).toBeCalledWith("Smithy");
    expect(discard).not.toBeCalled();
    expect(discardFromLibrary).not.toBeCalled();
  });

  // Case discard from set aside zone
  it("should discarding cards from the set aside zone correctly", () => {
    // Arrange
    deck.latestPlay = "Library";
    const cards = ["Chapel", "Poacher"];
    const numberOfCards = [1, 2];

    // Act - simulate discarding 3 cards by playing a Library.
    deck.processDiscardsLine(cards, numberOfCards);

    expect(discardFromSetAside).toBeCalledTimes(3);
    expect(discardFromSetAside).nthCalledWith(1, "Chapel");
    expect(discardFromSetAside).nthCalledWith(2, "Poacher");
    expect(discardFromSetAside).nthCalledWith(3, "Poacher");
    expect(discardFromLibrary).not.toBeCalled();
    expect(discard).not.toBeCalled();
  });
});
