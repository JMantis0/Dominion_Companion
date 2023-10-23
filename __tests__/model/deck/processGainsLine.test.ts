import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function processGainsLine()", () => {
  let deck = new Deck("", false, "", "pNick", "pName", []);
  // Spy on dependency functions
  const checkForBuyAndGain = jest.spyOn(Deck.prototype, "checkForBuyAndGain");
  const checkPreviousLineProcessedFoCurrentCardBuy = jest.spyOn(
    Deck.prototype,
    "checkPreviousLineProcessedForCurrentCardBuy"
  );
  const gain = jest.spyOn(Deck.prototype, "gain");
  const addCardToEntireDeck = jest.spyOn(Deck.prototype, "addCardToEntireDeck");
  const gainIntoHand = jest.spyOn(Deck.prototype, "gainIntoHand");
  const gainIntoLibrary = jest.spyOn(Deck.prototype, "gainIntoLibrary");
  const popLastLogArchiveEntry = jest.spyOn(
    Deck.prototype,
    "popLastLogArchiveEntry"
  );
  const checkPreviousLineProcessedForCurrentCardBuy = jest.spyOn(
    Deck.prototype,
    "checkPreviousLineProcessedForCurrentCardBuy"
  );
  afterEach(() => {
    deck = new Deck("", false, "", "pNick", "pName", []);
    jest.clearAllMocks();
  });

  it("should handle gaining a card from a normal purchase correctly", () => {
    // Arrange deck state
    deck.logArchive = [
      "Turn 3 - pName",
      "pNick plays a Copper and a Silver. (+$3)",
    ];

    // Arguments for function being tested
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick buys and gains a Silver.";

    // Act - Simulate gaining a Silver by buying.
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert

    expect(checkForBuyAndGain).toBeCalledTimes(1);
    expect(checkForBuyAndGain).toHaveBeenCalledWith(line, "Silver");
    expect(checkForBuyAndGain.mock.results[0].value).toStrictEqual(true);
    expect(checkPreviousLineProcessedFoCurrentCardBuy).toBeCalledTimes(1);
    expect(checkPreviousLineProcessedFoCurrentCardBuy).toHaveBeenCalledWith(
      "Silver"
    );
    expect(
      checkPreviousLineProcessedFoCurrentCardBuy.mock.results[0].value
    ).toBe(false);
    expect(gain).toHaveBeenCalledTimes(1);
    expect(gain).toHaveBeenCalledWith("Silver");
    expect(addCardToEntireDeck).toHaveBeenCalledTimes(1);
    expect(addCardToEntireDeck).toHaveBeenCalledWith("Silver");
    // Negative Assertions
    expect(gainIntoHand).not.toBeCalled();
    expect(gainIntoLibrary).not.toBeCalled();
    expect(popLastLogArchiveEntry).not.toBeCalled();
  });

  // This case occurs when a 'Buy without gain' line is processed into the logArchive.
  // The function should remove this entry from the logArchive to maintain it as a precise the
  // copy of the client game-log.
  it("should handle gaining a card was bought but not gained yet correctly, by removing an entry from the logArchive", () => {
    // Arrange deck state
    deck.logArchive = [
      "Turn 3 - pName",
      "pNick plays 2 Coppers and 2 Silvers. (+$6)",
      "pNick buys and gains a Silver.",
      "pNick buys a Silver.",
    ];

    deck.lastEntryProcessed = "pNick buys a Silver.";

    // Arguments for function being tested
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick buys and gains 2 Silvers.";

    // Act - Simulate gaining a Silver by buying.
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert

    expect(checkForBuyAndGain).toBeCalledTimes(1);
    expect(checkForBuyAndGain).toBeCalledWith(line, "Silver");
    expect(checkForBuyAndGain.mock.results[0].value).toStrictEqual(true);
    expect(checkPreviousLineProcessedForCurrentCardBuy).toBeCalledTimes(1);
    expect(checkPreviousLineProcessedForCurrentCardBuy).toHaveBeenCalledWith(
      "Silver"
    );
    expect(
      checkPreviousLineProcessedForCurrentCardBuy.mock.results[0].value
    ).toBe(true);
    expect(gain).toHaveBeenCalledTimes(1);
    expect(gain).toHaveBeenCalledWith("Silver");
    expect(addCardToEntireDeck).toHaveBeenCalledTimes(1);
    expect(addCardToEntireDeck).toHaveBeenCalledWith("Silver");
    expect(popLastLogArchiveEntry).toBeCalledTimes(1);
    // Negative Assertions
    expect(gainIntoHand).not.toBeCalled();
    expect(gainIntoLibrary).not.toBeCalled();
  });

  // Case Gain into hand
  it("should handle gaining a card into hand correctly", () => {
    // Arrange deck state
    deck.graveyard = ["Copper", "Copper"];
    deck.logArchive = [
      "pNick plays a Laboratory.",
      "pNick draws 2 Coppers.",
      "pNick gets +1 Action.",
      "pNick plays a Mine.",
      "pNick trashes a Copper.",
    ];
    deck.latestPlay = "Mine";
    // Arguments for function being tested
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick gains a Silver.";

    // Act - Simulate gaining a Silver by playing a Mine.
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert
    expect(addCardToEntireDeck).toHaveBeenCalledTimes(1);
    expect(addCardToEntireDeck).toHaveBeenCalledWith("Silver");
    expect(gainIntoHand).toBeCalledTimes(1);
    expect(gainIntoHand).toBeCalledWith("Silver");
    // Negative Assertions
    expect(gain).not.toBeCalled();
    expect(checkForBuyAndGain).not.toBeCalled();
    expect(popLastLogArchiveEntry).not.toBeCalled();
    expect(checkPreviousLineProcessedFoCurrentCardBuy).not.toBeCalled();
    expect(gainIntoLibrary).not.toBeCalled();
  });

  // Case Gain into library
  it("should handle gaining a card into library correctly", () => {
    // Arrange deck state
    deck.graveyard = ["Copper", "Copper"];
    deck.logArchive = [
      "pNick plays a Cellar.",
      "pNick gets +1 Action.",
      "pNick discards a Copper and an Estate.",
      "pNick draws a Copper and a Bureaucrat.",
      "pNick plays a Bureaucrat.",
    ];
    deck.latestPlay = "Bureaucrat";
    // Arguments for function being tested
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick gains a Silver.";

    // Act - Simulate gaining a Silver by playing a Bureaucrat
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert

    expect(addCardToEntireDeck).toHaveBeenCalledTimes(1);
    expect(addCardToEntireDeck).toHaveBeenCalledWith("Silver");
    expect(gainIntoLibrary).toBeCalledTimes(1);
    expect(gainIntoLibrary).toBeCalledWith("Silver");
    // Negative Assertions
    expect(gain).not.toBeCalled();
    expect(gainIntoHand).not.toBeCalled();
    expect(checkForBuyAndGain).not.toBeCalled();
    expect(popLastLogArchiveEntry).not.toBeCalled();
    expect(checkForBuyAndGain).not.toBeCalled();
    expect(checkPreviousLineProcessedFoCurrentCardBuy).not.toBeCalled();
  });
});
