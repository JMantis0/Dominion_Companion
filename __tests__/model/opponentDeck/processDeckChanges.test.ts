import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { OpponentDeck } from "../../../src/model/opponentDeck";

describe("Method processDeckChanges", () => {
  let deck: OpponentDeck;
  // Spy on method dependencies
  const processGainsLine = jest
    .spyOn(OpponentDeck.prototype, "processGainsLine")
    .mockImplementation(() => null);
  const processTrashesLine = jest
    .spyOn(OpponentDeck.prototype, "processTrashesLine")
    .mockImplementation(() => null);
  const processPassesLine = jest
    .spyOn(OpponentDeck.prototype, "handleIncomingPasses")
    .mockImplementation(() => null);
  beforeEach(() => {
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

    // Assert - Verify only the processGainsLine method is called and is called with the correct arguments.
    expect(processGainsLine).toBeCalledTimes(1);
    expect(processGainsLine).toBeCalledWith(line, cards, numberOfCards);
    expect(processTrashesLine).not.toBeCalled();
    expect(processPassesLine).not.toBeCalled();
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

    // Assert - Verify only the processTrashesLine method is called and it is called with the correct arguments.
    expect(processTrashesLine).toBeCalledTimes(1);
    expect(processTrashesLine).toBeCalledWith(cards, numberOfCards);
    expect(processGainsLine).not.toBeCalled();
    expect(processPassesLine).not.toBeCalled();
  });

  it("Should use the provided act (passes) to call the correct line processor", () => {
    // Arrange

    // Arguments for function being tested
    const line = "pNick passes a Curse to oNick.";
    const act = "passes";
    const cards: string[] = ["Curse"];
    const numberOfCards: number[] = [1];

    // Act - simulate processing a trashes line.
    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert - Verify only the processTrashesLine method is called and it is called with the correct arguments.
    expect(processPassesLine).toBeCalledTimes(1);
    expect(processPassesLine).toBeCalledWith(act, line, cards, numberOfCards);
    expect(processGainsLine).not.toBeCalled();
    expect(processTrashesLine).not.toBeCalled();
  });
});
