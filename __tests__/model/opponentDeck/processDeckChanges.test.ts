import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { OpponentDeck } from "../../../src/model/opponentDeck";

describe("Method processDeckChanges", () => {
  let deck = new OpponentDeck("", false, "", "pName", "pNick", []);
  // Spy on method dependencies
  const processGainsLine = jest
    .spyOn(OpponentDeck.prototype, "processGainsLine")
    .mockImplementation(() => null);
  const processTrashesLine = jest
    .spyOn(OpponentDeck.prototype, "processTrashesLine")
    .mockImplementation(() => null);

  afterEach(() => {
    jest.clearAllMocks();
    deck = new OpponentDeck("", false, "", "pName", "pNick", []);
  });

  it("Should use the provided act (gains) to call the correct line processor", () => {
    // Arrange

    // Arguments for function being tested
    const line = "pNick buys and gains a Copper.";
    const act = "gains";
    const cards: string[] = ["Copper"];
    const numberOfCards: number[] = [1];

    // Act - simulate processing a gains line.
    deck.processDeckChanges(line, act, cards, numberOfCards);
    // Assert

    expect(processGainsLine).toBeCalledTimes(1);
    expect(processGainsLine).toBeCalledWith(line, cards, numberOfCards);
    expect(processTrashesLine).not.toBeCalled();
  });

  it("Should use the provided act (trashes) to call the correct line processor", () => {
    // Arrange

    // Arguments for function being tested
    const line = "pNick trashes a Curse.";
    const act = "trashes";
    const cards: string[] = ["Curse"];
    const numberOfCards: number[] = [1];

    // Act - simulate processing a trashes line.
    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert
    expect(processTrashesLine).toBeCalledTimes(1);
    expect(processTrashesLine).toBeCalledWith(cards, numberOfCards);
    expect(processGainsLine).not.toBeCalled();
  });
});
