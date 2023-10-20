import { describe, it, expect, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function processGainLine()", () => {
  it("should handle gaining a card from a normal purchase correctly", () => {
    // Arrange deck state
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive = [
      "Turn 3 - pName",
      "pNick plays a Copper and a Silver. (+$3)",
    ];
    deck.setLogArchive(logArchive);

    // Arguments for function being tested
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick buys and gains a Silver.";

    // Mock dependency functions
    const getMostRecentPlay = jest.spyOn(Deck.prototype, "getMostRecentPlay");
    const checkForBuyAndGain = jest.spyOn(Deck.prototype, "checkForBuyAndGain");
    const checkPreviousLineProcessedFoCurrentCardBuy = jest.spyOn(
      Deck.prototype,
      "checkPreviousLineProcessedForCurrentCardBuy"
    );
    const gain = jest.spyOn(Deck.prototype, "gain");
    const addCardToEntireDeck = jest.spyOn(
      Deck.prototype,
      "addCardToEntireDeck"
    );
    const gainIntoHand = jest.spyOn(Deck.prototype, "gainIntoHand");
    const gainIntoDeck = jest.spyOn(Deck.prototype, "gainIntoDeck");
    const popLastLogArchiveEntry = jest.spyOn(
      Deck.prototype,
      "popLastLogArchiveEntry"
    );

    // Act - Simulate gaining a Silver by buying.
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert
    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(getMostRecentPlay).toBeCalledWith(logArchive);
    expect(getMostRecentPlay.mock.results[0].value).toBe("None");
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
    expect(gainIntoDeck).not.toBeCalled();
    expect(popLastLogArchiveEntry).not.toBeCalled();
  });

  // This case occurs when a 'Buy without gain' line is processed into the logArchive.
  // The function should remove this entry from the logArchive to maintain it as a precise the
  // copy of the client game-log.
  it("should handle gaining a card was bought but not gained yet correctly, by removing an entry from the logArchive", () => {
    // Arrange deck state
    const deck = new Deck("", false, "", "pNick", "pName", ["Province"]);
    const logArchive = [
      "Turn 3 - pName",
      "pNick plays 2 Coppers and 2 Silvers. (+$6)",
      "pNick buys and gains a Silver.",
      "pNick buys a Silver.",
    ];
    deck.setLogArchive(logArchive);
    deck.setLastEntryProcessed("pNick buys a Silver.");

    // Arguments for function being tested
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick buys and gains 2 Silvers.";

    // Mock dependency functions
    const getMostRecentPlay = jest.spyOn(Deck.prototype, "getMostRecentPlay");
    const checkForBuyAndGain = jest.spyOn(Deck.prototype, "checkForBuyAndGain");
    const checkPreviousLineProcessedForCurrentCardBuy = jest.spyOn(
      Deck.prototype,
      "checkPreviousLineProcessedForCurrentCardBuy"
    );
    const gain = jest.spyOn(Deck.prototype, "gain");
    const addCardToEntireDeck = jest.spyOn(
      Deck.prototype,
      "addCardToEntireDeck"
    );
    const popLastLogArchiveEntry = jest.spyOn(
      Deck.prototype,
      "popLastLogArchiveEntry"
    );
    const gainIntoHand = jest.spyOn(Deck.prototype, "gainIntoHand");
    const gainIntoDeck = jest.spyOn(Deck.prototype, "gainIntoDeck");

    // Act - Simulate gaining a Silver by buying.
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert
    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(getMostRecentPlay).toBeCalledWith(logArchive);
    expect(getMostRecentPlay.mock.results[0].value).toBe("None");
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
    expect(gainIntoDeck).not.toBeCalled();
  });

  // Case Gain into hand
  it("should handle gaining a card into hand correctly", () => {
    // Arrange deck state
    const deck = new Deck("", false, "", "pNick", "pName", []); // Deck with a Kingdom that includes the cards that gain into various zones.
    const graveyard = ["Copper", "Copper"];
    const logArchive = [
      "pNick plays a Laboratory.",
      "pNick draws 2 Coppers.",
      "pNick gets +1 Action.",
      "pNick plays a Mine.",
      "pNick trashes a Copper.",
    ];
    deck.setGraveyard(graveyard);
    deck.setLogArchive(logArchive);

    // Arguments for function being tested
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick gains a Silver.";

    // Mock dependency functions
    const gainIntoHand = jest.spyOn(Deck.prototype, "gainIntoHand");
    const getMostRecentPlay = jest.spyOn(Deck.prototype, "getMostRecentPlay");
    const addCardToEntireDeck = jest.spyOn(
      Deck.prototype,
      "addCardToEntireDeck"
    );
    const checkPreviousLineProcessedFoCurrentCardBuy = jest.spyOn(
      Deck.prototype,
      "checkPreviousLineProcessedForCurrentCardBuy"
    );
    const checkForBuyAndGain = jest.spyOn(Deck.prototype, "checkForBuyAndGain");
    const gain = jest.spyOn(Deck.prototype, "gain");
    const gainIntoDeck = jest.spyOn(Deck.prototype, "gainIntoDeck");
    const popLastLogArchiveEntry = jest.spyOn(
      Deck.prototype,
      "popLastLogArchiveEntry"
    );

    // Act - Simulate gaining a Silver by playing a Mine.
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert
    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(getMostRecentPlay).toBeCalledWith(logArchive);
    expect(getMostRecentPlay.mock.results[0].value).toBe("Mine");
    expect(addCardToEntireDeck).toHaveBeenCalledTimes(1);
    expect(addCardToEntireDeck).toHaveBeenCalledWith("Silver");
    expect(gainIntoHand).toBeCalledTimes(1);
    expect(gainIntoHand).toBeCalledWith("Silver");
    // Negative Assertions
    expect(gain).not.toBeCalled();
    expect(checkForBuyAndGain).not.toBeCalled();
    expect(popLastLogArchiveEntry).not.toBeCalled();
    expect(checkPreviousLineProcessedFoCurrentCardBuy).not.toBeCalled();
    expect(gainIntoDeck).not.toBeCalled();
  });

  // Case Gain into library
  it("should handle gaining a card into library correctly", () => {
    // Arrange deck state
    const deck = new Deck("", false, "", "pNick", "pName", []); // Deck with a Kingdom that includes the cards that gain into various zones.
    const graveyard = ["Copper", "Copper"];
    const logArchive = [
      "pNick plays a Cellar.",
      "pNick gets +1 Action.",
      "pNick discards a Copper and an Estate.",
      "pNick draws a Copper and a Bureaucrat.",
      "pNick plays a Bureaucrat.",
    ];
    deck.setGraveyard(graveyard);
    deck.setLogArchive(logArchive);

    // Arguments for function being tested
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick gains a Silver.";

    // Mock dependency functions
    const getMostRecentPlay = jest.spyOn(Deck.prototype, "getMostRecentPlay");
    const addCardToEntireDeck = jest.spyOn(
      Deck.prototype,
      "addCardToEntireDeck"
    );
    const gainIntoDeck = jest.spyOn(Deck.prototype, "gainIntoDeck");
    const gainIntoHand = jest.spyOn(Deck.prototype, "gainIntoHand");
    const checkPreviousLineProcessedFoCurrentCardBuy = jest.spyOn(
      Deck.prototype,
      "checkPreviousLineProcessedForCurrentCardBuy"
    );
    const checkForBuyAndGain = jest.spyOn(Deck.prototype, "checkForBuyAndGain");
    const gain = jest.spyOn(Deck.prototype, "gain");
    const popLastLogArchiveEntry = jest.spyOn(
      Deck.prototype,
      "popLastLogArchiveEntry"
    );

    // Act - Simulate gaining a Silver by playing a Bureaucrat
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert
    expect(getMostRecentPlay.mock.results[0].value).toBe("Bureaucrat");
    expect(addCardToEntireDeck).toHaveBeenCalledTimes(1);
    expect(addCardToEntireDeck).toHaveBeenCalledWith("Silver");
    expect(gainIntoDeck).toBeCalledTimes(1);
    expect(gainIntoDeck).toBeCalledWith("Silver");
    // Negative Assertions
    expect(gain).not.toBeCalled();
    expect(gainIntoHand).not.toBeCalled();
    expect(checkForBuyAndGain).not.toBeCalled();
    expect(popLastLogArchiveEntry).not.toBeCalled();
    expect(checkForBuyAndGain).not.toBeCalled();
    expect(checkPreviousLineProcessedFoCurrentCardBuy).not.toBeCalled();
  });
});
