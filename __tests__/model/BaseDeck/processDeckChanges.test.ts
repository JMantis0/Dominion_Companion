import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function processDeckChanges", () => {
  let deck = new Deck("", false, "", "pName", "pNick", []);

  // Mock function dependencies
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
  afterEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("Should use the provided act to call the correct line processor (shuffles their deck)", () => {
    // Arguments for function being tested
    const line = "pNick shuffles their deck.";
    const act = "shuffles their deck";
    const cards: string[] = [];
    const numberOfCards: number[] = [];

    // Act - simulate processing a shuffle line.
    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert
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
  });

  it("Should use the provided act (gains) to call the correct line processor", () => {
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
    expect(setWaitToShuffle).not.toBeCalled();
    expect(processDrawsLine).not.toBeCalled();
    expect(processDiscardsLine).not.toBeCalled();
    expect(processPlaysLine).not.toBeCalled();
    expect(processTrashesLine).not.toBeCalled();
    expect(processTopDecksLine).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
  });

  it("Should use the provided act (draws) to call the correct line processor", () => {
    // Arguments for function being tested
    const line = "pNick draws 4 Coppers and an Estate.";
    const act = "draws";
    const cards: string[] = ["Copper", "Estate"];
    const numberOfCards: number[] = [4, 1];

    // Act - simulate processing a draws line.
    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert
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
  });

  it("Should use the provided act (discards) to call the correct line processor", () => {
    // Arguments for function being tested
    const line = "pNick discards 4 Coppers and an Estate.";
    const act = "discards";
    const cards: string[] = ["Copper", "Estate"];
    const numberOfCards: number[] = [4, 1];

    // Act - simulate processing a discards line.
    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert
    expect(processDiscardsLine).toBeCalledTimes(1);
    expect(processDiscardsLine).toBeCalledWith(cards, numberOfCards);
    expect(processDrawsLine).not.toBeCalled();
    expect(processGainsLine).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(processPlaysLine).not.toBeCalled();
    expect(processTrashesLine).not.toBeCalled();
    expect(processTopDecksLine).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
  });

  it("Should use the provided act (plays) to call the correct line processor", () => {
    // Arguments for function being tested
    const line = "pNick plays a Bandit.";
    const act = "plays";
    const cards: string[] = ["Bandit"];
    const numberOfCards: number[] = [1];

    // Act - simulate processing a plays line.
    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert
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
  });

  it("Should use the provided act (trashes) to call the correct line processor", () => {
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
    expect(processPlaysLine).not.toBeCalled();
    expect(processDiscardsLine).not.toBeCalled();
    expect(processDrawsLine).not.toBeCalled();
    expect(processGainsLine).not.toBeCalled();
    expect(setWaitToShuffle).not.toBeCalled();
    expect(processTopDecksLine).not.toBeCalled();
    expect(processLooksAtLine).not.toBeCalled();
    expect(setAsideFromLibrary).not.toBeCalled();
    expect(processRevealsLine).not.toBeCalled();
  });

  it("Should use the provided act (topdecks) to call the correct line processor", () => {
    // Arguments for function being tested
    const line = "pNick topdecks a Festival.";
    const act = "topdecks";
    const cards: string[] = ["Festival"];
    const numberOfCards: number[] = [1];

    // Act - simulate processing a topdecks line.
    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert
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
  });

  it("Should use the provided act (looks at) to call the correct line processor", () => {
    // Arguments for function being tested
    const line = "pNick looks at a Cellar.";
    const act = "looks at";
    const cards: string[] = ["Cellar"];
    const numberOfCards: number[] = [1];

    // Act - simulate processing a looks at line.
    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert
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
  });

  it("Should use the provided act (looks at) to call the correct line processor", () => {
    // Arguments for function being tested
    const line = "pNick sets Mine aside with Library.";
    const act = "aside with Library";
    const cards: string[] = ["Mine"];
    const numberOfCards: number[] = [1];

    // Act - simulate processing a aside with Library line.
    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert
    expect(setAsideFromLibrary).toBeCalledTimes(1);
    expect(setAsideFromLibrary).toBeCalledWith("Mine");
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

  it("should handle reveals lines correctly", () => {
    const line = "pNick reveals a Gold and a Chapel.";
    const act = "reveals";
    const cards = ["Gold", "Chapel"];
    const numberOfCards = [1, 1];

    deck.processDeckChanges(line, act, cards, numberOfCards);

    // Assert
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
  });
});
