import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method processDrawsLine", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on method dependencies.
  const checkForCleanup = jest.spyOn(Deck.prototype, "checkForCleanUp");
  const checkForShuffle = jest.spyOn(Deck.prototype, "checkForShuffle");
  const checkForCellarDraw = jest.spyOn(Deck.prototype, "checkForCellarDraw");
  const cleanup = jest.spyOn(Deck.prototype, "cleanup");
  const draw = jest.spyOn(Deck.prototype, "draw");

  afterEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  // Case where there are 5 draws taking place on one line and a shuffle occurred
  // on the previous line: no cleanup should occur.
  it("should not cleanup before drawing if lastLineProcessed is a shuffle", () => {
    // Arrange
    deck.library = ["Copper", "Copper", "Silver", "Gold", "Merchant"];
    deck.logArchive = [
      "pNick plays a Merchant.",
      "pNick draws an Estate.",
      "pNick gets +1 Action.",
      "pNick plays a Silver. (+$2)",
      "pNick gets +$1. (Merchant)",
      "pNick plays a Gold. (+$3)",
      "pNick buys and gains a Gold.",
      "pNick shuffles their deck.",
    ];
    deck.lastEntryProcessed = "pNick shuffles their deck.";

    // Arguments for function being tested
    const line = "pNick draws 2 Coppers, a Silver, a Gold, and a Merchant.";
    const cards = ["Copper", "Silver", "Gold", "Merchant"];
    const numberOfCards = [2, 1, 1, 1];

    // Act - simulate drawing where a shuffle already occurred on the previous line.
    // with draws that were caused by turn ending.
    deck.processDrawsLine(line, cards, numberOfCards);

    // Assert
    expect(checkForCleanup).toBeCalledTimes(1);
    expect(checkForCleanup).toBeCalledWith(line);
    expect(checkForCleanup.mock.results[0].value).toBe(true);
    expect(checkForShuffle).toBeCalledTimes(1);
    expect(checkForShuffle).toBeCalledWith(); // Call with no arguments
    expect(checkForShuffle.mock.results[0].value).toBe(true);
    expect(checkForCellarDraw).toBeCalledTimes(1);
    expect(checkForCellarDraw).toBeCalledWith(); // Call with no arguments
    expect(checkForCellarDraw.mock.results[0].value).toBe(false);
    expect(cleanup).not.toBeCalled();
    expect(draw).toBeCalledTimes(5);
    expect(draw).nthCalledWith(1, "Copper");
    expect(draw).nthCalledWith(2, "Copper");
    expect(draw).nthCalledWith(3, "Silver");
    expect(draw).nthCalledWith(4, "Gold");
    expect(draw).nthCalledWith(5, "Merchant");
  });

  // Case where there are 5 draws taking place on one line and
  // they were caused by playing a Cellar: no cleanup should occur.
  it("should not cleanup before drawing if draws are caused by a Cellar", () => {
    // Arrange
    deck.library = ["Copper", "Copper", "Silver", "Gold", "Estate"];
    deck.logArchive = [
      "pNick plays a Laboratory.",
      "pNick draws a Cellar and a Merchant.",
      "pNick gets +1 Action.",
      "pNick plays a Cellar.",
      "pNick gets +1 Action.",
      "pNick discards a Copper, 2 Silvers, a Cellar, and a Merchant.",
    ];
    deck.lastEntryProcessed =
      "pNick discards a Copper, 2 Silvers, a Cellar, and a Merchant.";

    // Arguments for function being tested
    const line = "pNick draws 2 Coppers, a Silver, a Gold, and an Estate.";
    const cards = ["Copper", "Silver", "Gold", "Estate"];
    const numberOfCards = [2, 1, 1, 1];

    // Act - simulate drawing where a shuffle already occurred on the previous line.
    // with draws that were caused by turn ending.
    deck.processDrawsLine(line, cards, numberOfCards);

    // Assert
    expect(checkForCleanup).toBeCalledTimes(1);
    expect(checkForCleanup).toBeCalledWith(line);
    expect(checkForCleanup.mock.results[0].value).toBe(true);
    expect(checkForShuffle).toBeCalledTimes(1);
    expect(checkForShuffle).toBeCalledWith(); // Call with no arguments
    expect(checkForShuffle.mock.results[0].value).toBe(false);
    expect(checkForCellarDraw).toBeCalledTimes(1);
    expect(checkForCellarDraw).toBeCalledWith(); // Call with no arguments
    expect(checkForCellarDraw.mock.results[0].value).toBe(true);
    expect(cleanup).not.toBeCalled();
    expect(draw).toBeCalledTimes(5);
    expect(draw).nthCalledWith(1, "Copper");
    expect(draw).nthCalledWith(2, "Copper");
    expect(draw).nthCalledWith(3, "Silver");
    expect(draw).nthCalledWith(4, "Gold");
    expect(draw).nthCalledWith(5, "Estate");
  });

  // Case where a cleanup is needed before drawing
  // (5 draws, no shuffle, no Cellar play)
  it("should cleanup correctly before drawing", () => {
    // Arrange
    deck.library = ["Copper", "Copper", "Estate", "Estate", "Bureaucrat"];
    deck.logArchive = [
      "Turn 3 - Lord Rattington",
      "L plays 3 Coppers. (+$3)",
      "L buys and gains a Silver.",
      "L draws 5 cards.",
      "Turn 3 - GoodBeard",
      "pNick plays a Silver and 3 Coppers. (+$5)",
      "pNick buys and gains a Festival.",
    ];
    deck.lastEntryProcessed = "pNick buys and gains a Festival.";

    // Arguments for the function being tested
    const line = "pNick draws 2 Coppers, 2 Estates, and a Bureaucrat.";
    const cards = ["Copper", "Estate", "Bureaucrat"];
    const numberOfCards = [2, 2, 1];

    // Act - Simulate drawing 5 cards at end of turn where a cleanup is needed.
    deck.processDrawsLine(line, cards, numberOfCards);

    // Assert
    expect(checkForCleanup).toBeCalledTimes(1);
    expect(checkForCleanup).toBeCalledWith(line);
    expect(checkForCleanup.mock.results[0].value).toBe(true);
    expect(checkForShuffle).toBeCalledTimes(1);
    expect(checkForShuffle).toBeCalledWith(); // Call with no arguments
    expect(checkForShuffle.mock.results[0].value).toBe(false);
    expect(checkForCellarDraw).toBeCalledTimes(1);
    expect(checkForCellarDraw).toBeCalledWith(); // Call with no arguments
    expect(checkForCellarDraw.mock.results[0].value).toBe(false);
    expect(cleanup).toBeCalledTimes(1);
    expect(draw).toBeCalledTimes(5);
    expect(draw).nthCalledWith(1, "Copper");
    expect(draw).nthCalledWith(2, "Copper");
    expect(draw).nthCalledWith(3, "Estate");
    expect(draw).nthCalledWith(4, "Estate");
    expect(draw).nthCalledWith(5, "Bureaucrat");
  });

  // Case where cleanUp is not needed because there are *not* exactly 5 cards
  // being drawn.
  it("should not cleanup when there are not exactly 5 draws occurring", () => {
    // Arrange
    deck.library = ["Cellar", "Merchant"];
    deck.logArchive = [
      "L plays a Silver, a Gold, and a Copper. (+$6)",
      "L buys and gains a Duchy.",
      "L shuffles their deck.",
      "L draws 5 cards.",
      "Turn 16 - GoodBeard",
      "pNick plays a Laboratory.",
    ];
    deck.lastEntryProcessed = "pNick plays a Laboratory.";

    // Arguments for the function being tested
    const line = "pNick draws a Cellar and a Merchant.";
    const cards = ["Cellar", "Merchant"];
    const numberOfCards = [1, 1];

    // Act - Simulate drawing 5 cards at end of turn where a cleanup is needed.
    deck.processDrawsLine(line, cards, numberOfCards);

    // Assert
    expect(checkForCleanup).toBeCalledTimes(1);
    expect(checkForCleanup).toBeCalledWith(line);
    expect(checkForCleanup.mock.results[0].value).toBe(false);
    expect(checkForShuffle).toBeCalledTimes(1);
    expect(checkForShuffle).toBeCalledWith(); // Call with no arguments
    expect(checkForShuffle.mock.results[0].value).toBe(false);
    expect(checkForCellarDraw).toBeCalledTimes(1);
    expect(checkForCellarDraw).toBeCalledWith(); // Call with no arguments
    expect(checkForCellarDraw.mock.results[0].value).toBe(false);
    expect(cleanup).toBeCalledTimes(0);
    expect(draw).toBeCalledTimes(2);
    expect(draw).nthCalledWith(1, "Cellar");
    expect(draw).nthCalledWith(2, "Merchant");
  });
});
