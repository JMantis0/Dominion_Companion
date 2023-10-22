import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { OpponentDeck } from "../../../src/model/opponentDeck";

describe("Function processGainsLine", () => {
  let deck = new OpponentDeck("", false, "", "oName", "oNick", []);
  // Mock function dependencies
  const checkForBuyAndGain = jest.spyOn(
    OpponentDeck.prototype,
    "checkForBuyAndGain"
  );
  const popLastLogArchiveEntry = jest
    .spyOn(OpponentDeck.prototype, "popLastLogArchiveEntry")
    .mockImplementation(() => null); //Remove actual implementation
  const checkPreviousLineProcessedForCurrentCardBuy = jest.spyOn(
    OpponentDeck.prototype,
    "checkPreviousLineProcessedForCurrentCardBuy"
  );
  const addCardToEntireDeck = jest
    .spyOn(OpponentDeck.prototype, "addCardToEntireDeck")
    .mockImplementation(() => null); //Remove actual implementation

  afterEach(() => {
    deck = new OpponentDeck("", false, "", "oName", "oNick", []);
    jest.clearAllMocks();
  });

  it("should correctly add cards to the entire deck", () => {
    // Arrange mock implementation
    checkForBuyAndGain.mockImplementation(() => true);
    checkPreviousLineProcessedForCurrentCardBuy.mockImplementation(() => false);

    // Act - Simulate opponent buying 2 Laboratories
    deck.processGainsLine(
      "oNick buys and gains 2 Laboratories.",
      ["Laboratory"],
      [2]
    );

    // Assert
    expect(checkForBuyAndGain).toBeCalledTimes(2);
    expect(checkForBuyAndGain).nthCalledWith(
      1,
      "oNick buys and gains 2 Laboratories.",
      "Laboratory"
    );
    expect(checkForBuyAndGain).nthCalledWith(
      2,
      "oNick buys and gains 2 Laboratories.",
      "Laboratory"
    );
    expect(checkPreviousLineProcessedForCurrentCardBuy).toBeCalledTimes(2);
    expect(checkPreviousLineProcessedForCurrentCardBuy).toBeCalledTimes(2);
    expect(checkPreviousLineProcessedForCurrentCardBuy).nthCalledWith(
      1,
      "Laboratory"
    );
    expect(checkPreviousLineProcessedForCurrentCardBuy).nthCalledWith(
      2,
      "Laboratory"
    );
    expect(popLastLogArchiveEntry).not.toBeCalled();
    expect(addCardToEntireDeck).toBeCalledTimes(2);
    expect(addCardToEntireDeck).nthCalledWith(1, "Laboratory");
    expect(addCardToEntireDeck).nthCalledWith(2, "Laboratory");
  });

  it("should correctly remove the most recent log entry if it is a 'buy without gain' for same card that is bought on the current line", () => {
    // Arrange mock implementation
    checkForBuyAndGain.mockImplementation(() => true);

    // Simulate situation where last entry in the log is a 'buy without gain' for current Line buy and gain.
    checkPreviousLineProcessedForCurrentCardBuy.mockImplementation(() => true);
    // Act
    deck.processGainsLine("oNick buys and gains a Smithy.", ["Smithy"], [1]);
    // Assert
    expect(checkForBuyAndGain).toBeCalledTimes(1);
    expect(checkForBuyAndGain).toBeCalledWith(
      "oNick buys and gains a Smithy.",
      "Smithy"
    );
    expect(checkPreviousLineProcessedForCurrentCardBuy).toBeCalledTimes(1);
    expect(
      checkPreviousLineProcessedForCurrentCardBuy.mock.results[0].value
    ).toBe(true); //Return value from mock implementation
    expect(popLastLogArchiveEntry).toBeCalledTimes(1);
    expect(addCardToEntireDeck).toBeCalledTimes(1);
    expect(addCardToEntireDeck).toBeCalledWith("Smithy");
  });
});
