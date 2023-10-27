import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method processGainsLine()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on dependency functions.
  const checkForBuyAndGain = jest.spyOn(Deck.prototype, "checkForBuyAndGain");
  const checkPreviousLineProcessedFoCurrentCardBuy = jest.spyOn(
    Deck.prototype,
    "checkPreviousLineProcessedForCurrentCardBuy"
  );
  const isBureaucratGain = jest.spyOn(Deck.prototype, "isBureaucratGain");
  const isArtisanGain = jest.spyOn(Deck.prototype, "isArtisanGain");
  const isMineGain = jest.spyOn(Deck.prototype, "isMineGain");
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
    deck = new Deck("", false, "", "pName", "pNick", []);
    jest.clearAllMocks();
  });

  it("should add card gained by purchasing to graveyard.", () => {
    // Arrange
    deck.logArchive = ["Turn 3 - pName", "pNick plays a Gold. (+$3)"];
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick buys and gains a Silver.";

    // Act - Simulate gaining a Silver by buying.
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert
    expect(isBureaucratGain).toBeCalledTimes(1);
    expect(isBureaucratGain.mock.results[0].value).toBe(false);
    expect(isArtisanGain).toBeCalledTimes(1);
    expect(isArtisanGain.mock.results[0].value).toBe(false);
    expect(isMineGain).toBeCalledTimes(1);
    expect(isMineGain.mock.results[0].value).toBe(false);
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
    expect(gainIntoHand).not.toBeCalled();
    expect(gainIntoLibrary).not.toBeCalled();
    expect(popLastLogArchiveEntry).not.toBeCalled();
  });

  // This case occurs when a 'Buy without gain' line is processed into the logArchive.
  // The function should remove this entry from the logArchive to maintain it as a precise the
  // copy of the client game-log.
  it("should handle gaining a card was bought but not gained yet correctly, by removing an entry from the logArchive", () => {
    // Arrange

    deck.lastEntryProcessed = "pNick buys a Silver.";
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick buys and gains 2 Silvers.";

    // Act - Simulate buy a second Silver consecutively.
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert
    expect(isBureaucratGain).toBeCalledTimes(1);
    expect(isBureaucratGain.mock.results[0].value).toBe(false);
    expect(isArtisanGain).toBeCalledTimes(1);
    expect(isArtisanGain.mock.results[0].value).toBe(false);
    expect(isMineGain).toBeCalledTimes(1);
    expect(isMineGain.mock.results[0].value).toBe(false);
    expect(checkForBuyAndGain).toBeCalledTimes(1);
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
    expect(gainIntoHand).not.toBeCalled();
    expect(gainIntoLibrary).not.toBeCalled();
  });

  it("should add cards gained by a Mine to hand", () => {
    // Arrange
    deck.latestPlay = "Mine";
    deck.lastEntryProcessed = "pNick trashes a Copper.";
    deck.logArchive = ["pNick plays a Mine.", "pNick trashes a Copper."];
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick gains a Silver.";

    // Act - Simulate gaining a Silver by playing a Mine.
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert
    expect(isBureaucratGain).toBeCalledTimes(1);
    expect(isBureaucratGain.mock.results[0].value).toBe(false);
    expect(isArtisanGain).toBeCalledTimes(1);
    expect(isArtisanGain.mock.results[0].value).toBe(false);
    expect(isMineGain).toBeCalledTimes(1);
    expect(isMineGain.mock.results[0].value).toBe(true);
    expect(addCardToEntireDeck).toHaveBeenCalledTimes(1);
    expect(addCardToEntireDeck).toHaveBeenCalledWith("Silver");
    expect(gainIntoHand).toBeCalledTimes(1);
    expect(gainIntoHand).toBeCalledWith("Silver");
    expect(gain).not.toBeCalled();
    expect(checkForBuyAndGain).not.toBeCalled();
    expect(popLastLogArchiveEntry).not.toBeCalled();
    expect(checkPreviousLineProcessedFoCurrentCardBuy).not.toBeCalled();
    expect(gainIntoLibrary).not.toBeCalled();
  });

  it("should add cards gained by an Artisan to hand", () => {
    // Arrange
    deck.lastEntryProcessed = "pNick plays an Artisan.";

    // Arguments for function being tested
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick gains a Silver.";

    // Act - Simulate gaining a Silver by playing an Artisan.
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert
    expect(isBureaucratGain).toBeCalledTimes(1);
    expect(isBureaucratGain.mock.results[0].value).toBe(false);
    expect(isArtisanGain).toBeCalledTimes(1);
    expect(isArtisanGain.mock.results[0].value).toBe(true);
    expect(addCardToEntireDeck).toHaveBeenCalledTimes(1);
    expect(addCardToEntireDeck).toHaveBeenCalledWith("Silver");
    expect(gainIntoHand).toBeCalledTimes(1);
    expect(gainIntoHand).toBeCalledWith("Silver");
    expect(isMineGain).not.toBeCalled();
    expect(gain).not.toBeCalled();
    expect(checkForBuyAndGain).not.toBeCalled();
    expect(popLastLogArchiveEntry).not.toBeCalled();
    expect(checkPreviousLineProcessedFoCurrentCardBuy).not.toBeCalled();
    expect(gainIntoLibrary).not.toBeCalled();
  });

  // Case Gain into library
  it("should add cards gained by Bureaucrat to library.", () => {
    // Arrange
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick gains a Silver.";
    deck.lastEntryProcessed = "pNick plays a Bureaucrat.";
    // Act - Simulate gaining a Silver by playing a Bureaucrat
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert
    expect(isBureaucratGain).toBeCalledTimes(1);
    expect(isBureaucratGain.mock.results[0].value).toBe(true);
    expect(addCardToEntireDeck).toHaveBeenCalledTimes(1);
    expect(addCardToEntireDeck).toHaveBeenCalledWith("Silver");
    expect(gainIntoLibrary).toBeCalledTimes(1);
    expect(gainIntoLibrary).toBeCalledWith("Silver");
    expect(isArtisanGain).not.toBeCalled();
    expect(isMineGain).not.toBeCalled();
    expect(gain).not.toBeCalled();
    expect(gainIntoHand).not.toBeCalled();
    expect(checkForBuyAndGain).not.toBeCalled();
    expect(popLastLogArchiveEntry).not.toBeCalled();
    expect(checkForBuyAndGain).not.toBeCalled();
    expect(checkPreviousLineProcessedFoCurrentCardBuy).not.toBeCalled();
  });

  it("should not gain purchases into library even when the most recent play is a Bureaucrat", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays a Vassal.",
      "pNick gets +$2.",
      "pNick discards a Laboratory.",
      "pNick plays a Laboratory.",
      "pNick shuffles their deck.",
      "pNick draws a Copper and a Bureaucrat.",
      "pNick gets +1 Action.",
      "pNick plays a Bureaucrat.",
      "pNick gains a Silver.",
      "oNick topdecks an Estate.",
      "pNick plays 5 Coppers. (+$5)",
    ];

    const line = "pNick buys and gains a Gold.";
    const numberOfCards = [1];
    const cards = ["Gold"];

    // Act - Simulate buying a gold after making a Bureaucrat play.
    deck.processGainsLine(line, cards, numberOfCards);

    expect(isBureaucratGain).toBeCalledTimes(1);
    expect(isBureaucratGain.mock.results[0].value).toBe(false);
    expect(isArtisanGain).toBeCalledTimes(1);
    expect(isArtisanGain.mock.results[0].value).toBe(false);
    expect(isMineGain).toBeCalledTimes(1);
    expect(isMineGain.mock.results[0].value).toBe(false);
    expect(gain).toBeCalledTimes(1);
    expect(gain).toBeCalledWith("Gold");
    expect(gainIntoHand).not.toBeCalled();
    expect(checkForBuyAndGain).toBeCalledTimes(1);
    expect(checkForBuyAndGain).toBeCalledWith(line, "Gold");
    expect(checkForBuyAndGain.mock.results[0].value).toBe(true);
    expect(checkPreviousLineProcessedFoCurrentCardBuy).toBeCalledTimes(1);
    expect(checkPreviousLineProcessedFoCurrentCardBuy).toBeCalledWith("Gold");
    expect(
      checkPreviousLineProcessedFoCurrentCardBuy.mock.results[0].value
    ).toBe(false);
    expect(popLastLogArchiveEntry).not.toBeCalled();
    expect(gainIntoLibrary).not.toBeCalled();
  });
});
