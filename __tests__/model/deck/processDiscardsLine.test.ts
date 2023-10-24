import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method processDiscardsLine()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pNick", "pName", []);
  // Spy on dependent methods.
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

  it("should discard from the library when latestPlay is a Vassal", () => {
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

  it("should discard from setAside when latestPlay is a Bandit", () => {
    // Arrange
    deck.latestPlay = "Bandit";
    const cards = ["Smithy"];
    const numberOfCards = [1];

    // Act - Simulate discarding from library with Bandit.
    deck.processDiscardsLine(cards, numberOfCards);

    // Assert
    expect(discardFromSetAside).toBeCalledTimes(1);
    expect(discardFromSetAside).toBeCalledWith("Smithy");
    expect(discard).not.toBeCalled();
    expect(discardFromLibrary).not.toBeCalled();
  });

  it("should from aside when latestPlay is a Library", () => {
    // Arrange
    deck.latestPlay = "Library";
    const cards = ["Chapel", "Poacher"];
    const numberOfCards = [1, 2];

    // Act - simulate discarding 3 cards with a Library.
    deck.processDiscardsLine(cards, numberOfCards);

    expect(discardFromSetAside).toBeCalledTimes(3);
    expect(discardFromSetAside).nthCalledWith(1, "Chapel");
    expect(discardFromSetAside).nthCalledWith(2, "Poacher");
    expect(discardFromSetAside).nthCalledWith(3, "Poacher");
    expect(discardFromLibrary).not.toBeCalled();
    expect(discard).not.toBeCalled();
  });
});
