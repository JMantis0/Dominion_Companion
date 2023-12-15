import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("processDeckChanges", () => {
  // Declare Deck reference.
  let deck: Deck;

  // Spy on method dependencies
  const setWaitToShuffle = jest
    .spyOn(Deck.prototype, "setWaitToShuffle")
    .mockImplementation(() => null);
  const processGainsLine = jest
    .spyOn(Deck.prototype, "processGainsLine")
    .mockImplementation(() => null);
  const processDrawsLine = jest
    .spyOn(Deck.prototype, "processDrawsLine")
    .mockImplementation(() => null);
  const processDiscardsLine = jest
    .spyOn(Deck.prototype, "processDiscardsLine")
    .mockImplementation(() => null);
  const processPlaysLine = jest
    .spyOn(Deck.prototype, "processPlaysLine")
    .mockImplementation(() => null);
  const processTrashesLine = jest
    .spyOn(Deck.prototype, "processTrashesLine")
    .mockImplementation(() => null);
  const processTopDecksLine = jest
    .spyOn(Deck.prototype, "processTopDecksLine")
    .mockImplementation(() => null);
  const processLooksAtLine = jest
    .spyOn(Deck.prototype, "processLooksAtLine")
    .mockImplementation(() => null);
  const setAsideFromLibrary = jest
    .spyOn(Deck.prototype, "setAsideFromLibrary")
    .mockImplementation(() => null);
  const processRevealsLine = jest
    .spyOn(Deck.prototype, "processRevealsLine")
    .mockImplementation(() => null);
  const processPassesLine = jest
    .spyOn(Deck.prototype, "processPassesLine")
    .mockImplementation(() => null);
  const processIntoTheirHandLine = jest
    .spyOn(Deck.prototype, "processIntoTheirHandLine")
    .mockImplementation(() => null);
  const processMovesTheirDeckToTheDiscardLine = jest
    .spyOn(Deck.prototype, "processMovesTheirDeckToTheDiscardLine")
    .mockImplementation(() => null);
  const processStartsWithLine = jest
    .spyOn(Deck.prototype, "processStartsWithLine")
    .mockImplementation(() => null);
  const processAsideWithLine = jest
    .spyOn(Deck.prototype, "processAsideWithLine")
    .mockImplementation(() => null);

  beforeEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should only call method setWaitToShuffle when the act is 'shuffles their deck'.", () => {
    // Arguments for function being tested
    const line = "pNick shuffles their deck.";
    const act = "shuffles their deck";
    const cards: string[] = [];
    const numberOfCards: number[] = [];

    // Act - simulate processing a shuffle line.
    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert - Verify only the setWaitToShuffle method is called, and is called with true
    expect(setWaitToShuffle).toBeCalledTimes(1);
    expect(setWaitToShuffle).toBeCalledWith(true);
    expect(processGainsLine).not.toBeCalled();
    expect(processDrawsLine).not.toBeCalled();
    expect(processDiscardsLine).not.toBeCalled();
    expect(processPlaysLine).not.toBeCalled();
    expect(processTrashesLine).not.toBeCalled();
    expect(processTopDecksLine).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
    expect(processPassesLine).not.toBeCalled();
    expect(processIntoTheirHandLine).not.toBeCalled();
    expect(processMovesTheirDeckToTheDiscardLine).not.toBeCalled();
    expect(processStartsWithLine).not.toBeCalled();
  });

  it("should only call method processGainsLine when the act is 'gains'.", () => {
    // Arguments for function being tested
    const line = "pNick buys and gains a Copper.";
    const act = "gains";
    const cards: string[] = ["Copper"];
    const numberOfCards: number[] = [1];

    // Act - simulate processing a gains line.
    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert - Verify only the processGainsLine method is called, and is called with the correct arguments.
    expect(processGainsLine).toBeCalledTimes(1);
    expect(processGainsLine).toBeCalledWith(line, cards, numberOfCards);
    expect(setWaitToShuffle).not.toBeCalled();
    expect(processDrawsLine).not.toBeCalled();
    expect(processDiscardsLine).not.toBeCalled();
    expect(processPlaysLine).not.toBeCalled();
    expect(processTrashesLine).not.toBeCalled();
    expect(processTopDecksLine).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
    expect(processPassesLine).not.toBeCalled();
    expect(processIntoTheirHandLine).not.toBeCalled();
    expect(processMovesTheirDeckToTheDiscardLine).not.toBeCalled();
    expect(processStartsWithLine).not.toBeCalled();
  });

  it("should should only call method processDrawsLine when the act is 'draws'.", () => {
    // Arguments for function being tested
    const line = "pNick draws 4 Coppers and an Estate.";
    const act = "draws";
    const cards: string[] = ["Copper", "Estate"];
    const numberOfCards: number[] = [4, 1];

    // Act - simulate processing a draws line.
    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert - Verify only the processDraws method is called, and is called with the correct arguments.
    expect(processDrawsLine).toBeCalledTimes(1);
    expect(processDrawsLine).toBeCalledWith(line, cards, numberOfCards);
    expect(processGainsLine).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(processDiscardsLine).not.toBeCalled();
    expect(processPlaysLine).not.toBeCalled();
    expect(processTrashesLine).not.toBeCalled();
    expect(processTopDecksLine).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
    expect(processPassesLine).not.toBeCalled();
    expect(processIntoTheirHandLine).not.toBeCalled();
    expect(processMovesTheirDeckToTheDiscardLine).not.toBeCalled();
    expect(processStartsWithLine).not.toBeCalled();
  });

  it("should only call method processDiscardsLine when the act is 'discards'", () => {
    // Arguments for function being tested
    const line = "pNick discards 4 Coppers and an Estate.";
    const act = "discards";
    const cards: string[] = ["Copper", "Estate"];
    const numberOfCards: number[] = [4, 1];

    // Act - simulate processing a discards line.
    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert - Verify only the processDiscards method is called, and is called with the correct arguments.
    expect(processDiscardsLine).toBeCalledTimes(1);
    expect(processDiscardsLine).toBeCalledWith(line, cards, numberOfCards);
    expect(processDrawsLine).not.toBeCalled();
    expect(processGainsLine).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(processPlaysLine).not.toBeCalled();
    expect(processTrashesLine).not.toBeCalled();
    expect(processTopDecksLine).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
    expect(processPassesLine).not.toBeCalled();
    expect(processIntoTheirHandLine).not.toBeCalled();
    expect(processMovesTheirDeckToTheDiscardLine).not.toBeCalled();
    expect(processStartsWithLine).not.toBeCalled();
  });

  it("should only call processPlaysLine when the act is 'plays'", () => {
    // Arguments for function being tested.
    const line = "pNick plays a Bandit.";
    const act = "plays";
    const cards: string[] = ["Bandit"];
    const numberOfCards: number[] = [1];

    // Act - simulate processing a plays line.
    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert - Verify only the processPlaysLine method is called, and is called with the correct arguments.
    expect(processPlaysLine).toBeCalledTimes(1);
    expect(processPlaysLine).toBeCalledWith(line, cards, numberOfCards);
    expect(processDiscardsLine).not.toBeCalled();
    expect(processDrawsLine).not.toBeCalled();
    expect(processGainsLine).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(processTrashesLine).not.toBeCalled();
    expect(processTopDecksLine).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
    expect(processPassesLine).not.toBeCalled();
    expect(processIntoTheirHandLine).not.toBeCalled();
    expect(processMovesTheirDeckToTheDiscardLine).not.toBeCalled();
    expect(processStartsWithLine).not.toBeCalled();
  });

  it("should only call method processTrashesLine when the act is 'trashes'.", () => {
    // Arguments for function being tested.
    const line = "pNick trashes a Curse.";
    const act = "trashes";
    const cards: string[] = ["Curse"];
    const numberOfCards: number[] = [1];

    // Act - simulate processing a trashes line.
    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert - Verify only the processTrashes method is called, and is called with the correct arguments.
    expect(processTrashesLine).toBeCalledTimes(1);
    expect(processTrashesLine).toBeCalledWith(line, cards, numberOfCards);
    expect(processPlaysLine).not.toBeCalled();
    expect(processDiscardsLine).not.toBeCalled();
    expect(processDrawsLine).not.toBeCalled();
    expect(processGainsLine).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(processTopDecksLine).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
    expect(processPassesLine).not.toBeCalled();
    expect(processIntoTheirHandLine).not.toBeCalled();
    expect(processMovesTheirDeckToTheDiscardLine).not.toBeCalled();
    expect(processStartsWithLine).not.toBeCalled();
  });

  it("should only call method processTopDecksLine when the act is 'topdecks'.", () => {
    // Arguments for function being tested
    const line = "pNick topdecks a Festival.";
    const act = "topdecks";
    const cards: string[] = ["Festival"];
    const numberOfCards: number[] = [1];

    // Act - simulate processing a topdecks line.
    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert - Verify only the processTopDecks method is called, and is called with the correct arguments.
    expect(processTopDecksLine).toBeCalledTimes(1);
    expect(processTopDecksLine).toBeCalledWith(cards, numberOfCards);
    expect(processTrashesLine).not.toBeCalled();
    expect(processPlaysLine).not.toBeCalled();
    expect(processDiscardsLine).not.toBeCalled();
    expect(processDrawsLine).not.toBeCalled();
    expect(processGainsLine).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
    expect(processPassesLine).not.toBeCalled();
    expect(processIntoTheirHandLine).not.toBeCalled();
    expect(processMovesTheirDeckToTheDiscardLine).not.toBeCalled();
    expect(processStartsWithLine).not.toBeCalled();
  });

  it("should only call method processTopDecksLine when the act is 'back onto their deck'.", () => {
    // Arguments for function being tested
    const line = "pNick topdecks a Festival.";
    const act = "back onto their deck";
    const cards: string[] = ["Festival"];
    const numberOfCards: number[] = [1];

    // Act - simulate processing a topdecks line.
    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert - Verify only the processTopDecks method is called, and is called with the correct arguments.
    expect(processTopDecksLine).toBeCalledTimes(1);
    expect(processTopDecksLine).toBeCalledWith(cards, numberOfCards);
    expect(processTrashesLine).not.toBeCalled();
    expect(processPlaysLine).not.toBeCalled();
    expect(processDiscardsLine).not.toBeCalled();
    expect(processDrawsLine).not.toBeCalled();
    expect(processGainsLine).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
    expect(processPassesLine).not.toBeCalled();
    expect(processIntoTheirHandLine).not.toBeCalled();
    expect(processMovesTheirDeckToTheDiscardLine).not.toBeCalled();
    expect(processStartsWithLine).not.toBeCalled();
  });

  it("should only call method processLooksAtLine when the act is 'looks at'.", () => {
    // Arguments for function being tested
    const line = "pNick looks at a Cellar.";
    const act = "looks at";
    const cards: string[] = ["Cellar"];
    const numberOfCards: number[] = [1];

    // Act - simulate processing a looks at line.
    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert - Verify only the processLooksAt method is called, and is called with the correct arguments.
    expect(processLooksAtLine).toBeCalledTimes(1);
    expect(processLooksAtLine).toBeCalledWith(cards, numberOfCards);
    expect(processTopDecksLine).not.toBeCalled();
    expect(processTrashesLine).not.toBeCalled();
    expect(processPlaysLine).not.toBeCalled();
    expect(processDiscardsLine).not.toBeCalled();
    expect(processDrawsLine).not.toBeCalled();
    expect(processGainsLine).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
    expect(processPassesLine).not.toBeCalled();
    expect(processIntoTheirHandLine).not.toBeCalled();
    expect(processMovesTheirDeckToTheDiscardLine).not.toBeCalled();
    expect(processStartsWithLine).not.toBeCalled();
  });

  it("should only call method processRevealsLine when the act is 'reveals'.", () => {
    const line = "pNick reveals a Gold and a Chapel.";
    const act = "reveals";
    const cards = ["Gold", "Chapel"];
    const numberOfCards = [1, 1];

    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert - Verify only the processRevealsLine method is called, and is called with the correct arguments.
    expect(processRevealsLine).toBeCalledTimes(1);
    expect(processRevealsLine).toBeCalledWith(cards, numberOfCards);
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(processTopDecksLine).not.toBeCalled();
    expect(processTrashesLine).not.toBeCalled();
    expect(processPlaysLine).not.toBeCalled();
    expect(processDiscardsLine).not.toBeCalled();
    expect(processDrawsLine).not.toBeCalled();
    expect(processGainsLine).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(processPassesLine).not.toBeCalled();
    expect(processIntoTheirHandLine).not.toBeCalled();
    expect(processMovesTheirDeckToTheDiscardLine).not.toBeCalled();
    expect(processStartsWithLine).not.toBeCalled();
  });

  it("should only call method processPassesLine when the act is 'passes'.", () => {
    const line = "P passes a Lurker to L";
    const act = "passes";
    const cards = ["Lurker"];
    const numberOfCards = [1];

    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert - Verify only the processRevealsLine method is called, and is called with the correct arguments.
    expect(processPassesLine).toBeCalledTimes(1);
    expect(processPassesLine).toBeCalledWith(cards, numberOfCards);
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(processTopDecksLine).not.toBeCalled();
    expect(processTrashesLine).not.toBeCalled();
    expect(processPlaysLine).not.toBeCalled();
    expect(processDiscardsLine).not.toBeCalled();
    expect(processDrawsLine).not.toBeCalled();
    expect(processGainsLine).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
    expect(processIntoTheirHandLine).not.toBeCalled();
    expect(processMovesTheirDeckToTheDiscardLine).not.toBeCalled();
    expect(processStartsWithLine).not.toBeCalled();
  });

  it("should only call method processIntoTheirHandLine when the act is 'into their hand'.", () => {
    const line = "P puts a Vassal into their hand.";
    const act = "into their hand";
    const cards = ["Vassal"];
    const numberOfCards = [1];

    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert - Verify only the processRevealsLine method is called, and is called with the correct arguments.
    expect(processIntoTheirHandLine).toBeCalledTimes(1);
    expect(processIntoTheirHandLine).toBeCalledWith(cards, numberOfCards);
    expect(processPassesLine).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(processTopDecksLine).not.toBeCalled();
    expect(processTrashesLine).not.toBeCalled();
    expect(processPlaysLine).not.toBeCalled();
    expect(processDiscardsLine).not.toBeCalled();
    expect(processDrawsLine).not.toBeCalled();
    expect(processGainsLine).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
    expect(processMovesTheirDeckToTheDiscardLine).not.toBeCalled();
    expect(processStartsWithLine).not.toBeCalled();
  });

  it("should only call method processIntoTheirHandLine when the act is 'in hand'.", () => {
    const line = "pNick puts a Copper, a Silver, and a Sage in hand (Haven).";
    const act = "in hand";
    const cards = ["Copper", "Silver", "Sage"];
    const numberOfCards = [1, 1, 1];

    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert - Verify only the processRevealsLine method is called, and is called with the correct arguments.
    expect(processIntoTheirHandLine).toBeCalledTimes(1);
    expect(processIntoTheirHandLine).toBeCalledWith(cards, numberOfCards);
    expect(processPassesLine).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(processTopDecksLine).not.toBeCalled();
    expect(processTrashesLine).not.toBeCalled();
    expect(processPlaysLine).not.toBeCalled();
    expect(processDiscardsLine).not.toBeCalled();
    expect(processDrawsLine).not.toBeCalled();
    expect(processGainsLine).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
    expect(processMovesTheirDeckToTheDiscardLine).not.toBeCalled();
    expect(processStartsWithLine).not.toBeCalled();
  });

  it("should only call method processMovesTheirDeckToTheDiscardLine when the act is 'moves their deck to the discard'.", () => {
    const line = "P moves their deck to the discard.";
    const act = "moves their deck to the discard";
    const cards = ["Vassal"];
    const numberOfCards = [1];

    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert - Verify only the processRevealsLine method is called, and is called with the correct arguments.
    expect(processMovesTheirDeckToTheDiscardLine).toBeCalledTimes(1);
    expect(processMovesTheirDeckToTheDiscardLine).toBeCalledWith();
    expect(processIntoTheirHandLine).not.toBeCalled();
    expect(processPassesLine).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(processTopDecksLine).not.toBeCalled();
    expect(processTrashesLine).not.toBeCalled();
    expect(processPlaysLine).not.toBeCalled();
    expect(processDiscardsLine).not.toBeCalled();
    expect(processDrawsLine).not.toBeCalled();
    expect(processGainsLine).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
    expect(processStartsWithLine).not.toBeCalled();
  });

  it("should only call method processStartsWithLine when the act is 'starts with'.", () => {
    const line = "P starts with 7 Coppers and 3 Estates.";
    const act = "starts with";
    const cards = ["Copper", "Estate"];
    const numberOfCards = [7, 3];

    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert - Verify only the processRevealsLine method is called, and is called with the correct arguments.
    expect(processStartsWithLine).toBeCalledTimes(1);
    expect(processStartsWithLine).toBeCalledWith(cards, numberOfCards);
    expect(processMovesTheirDeckToTheDiscardLine).not.toBeCalled();
    expect(processIntoTheirHandLine).not.toBeCalled();
    expect(processPassesLine).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(processTopDecksLine).not.toBeCalled();
    expect(processTrashesLine).not.toBeCalled();
    expect(processPlaysLine).not.toBeCalled();
    expect(processDiscardsLine).not.toBeCalled();
    expect(processDrawsLine).not.toBeCalled();
    expect(processGainsLine).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
  });

  it("should only call method processAsideWithLine when the act is 'aside with'.", () => {
    const line = "pNick sets a 3 Coppers aside with Grotto.";
    const act = "aside with";
    const cards = ["Copper"];
    const numberOfCards = [3];

    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert - Verify only the processRevealsLine method is called, and is called with the correct arguments.
    expect(processAsideWithLine).toBeCalledTimes(1);
    expect(processAsideWithLine).toBeCalledWith(cards, numberOfCards);
    expect(processStartsWithLine).not.toBeCalled();
    expect(processMovesTheirDeckToTheDiscardLine).not.toBeCalled();
    expect(processIntoTheirHandLine).not.toBeCalled();
    expect(processPassesLine).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(processTopDecksLine).not.toBeCalled();
    expect(processTrashesLine).not.toBeCalled();
    expect(processPlaysLine).not.toBeCalled();
    expect(processDiscardsLine).not.toBeCalled();
    expect(processDrawsLine).not.toBeCalled();
    expect(processGainsLine).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
  });

  it("should only call method draw when the act is 'and finds it'.", () => {
    const line = "pNick wishes for Coppers and finds it.";
    const act = "and finds it";
    const cards = ["Copper"];
    const numberOfCards = [1];

    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert - Verify only the processRevealsLine method is called, and is called with the correct arguments.
    expect(processDrawsLine).toBeCalledTimes(1);
    expect(processDrawsLine).toBeCalledWith(line, cards, numberOfCards);
    expect(processAsideWithLine).not.toBeCalled();
    expect(processStartsWithLine).not.toBeCalled();
    expect(processMovesTheirDeckToTheDiscardLine).not.toBeCalled();
    expect(processIntoTheirHandLine).not.toBeCalled();
    expect(processPassesLine).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(processTopDecksLine).not.toBeCalled();
    expect(processTrashesLine).not.toBeCalled();
    expect(processPlaysLine).not.toBeCalled();
    expect(processDiscardsLine).not.toBeCalled();
    expect(processGainsLine).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
  });
});
