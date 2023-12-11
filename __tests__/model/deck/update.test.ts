import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("update", () => {
  // Instantiate Deck object.
  let deck: Deck;
  // Spy on method dependencies
  const consecutiveTreasurePlays = jest.spyOn(
    Deck.prototype,
    "consecutiveTreasurePlays"
  );
  const getMostRecentAction = jest
    .spyOn(Deck.prototype, "getMostRecentAction")
    .mockImplementation(() => "");
  const setLatestPlay = jest.spyOn(Deck.prototype, "setLatestPlay");
  const handleConsecutiveDuplicates = jest.spyOn(
    Deck.prototype,
    "handleConsecutiveDuplicates"
  );
  const shuffleAndCleanUpIfNeeded = jest.spyOn(
    Deck.prototype,
    "shuffleAndCleanUpIfNeeded"
  );
  const getActCardsAndCounts = jest.spyOn(
    Deck.prototype,
    "getActCardsAndCounts"
  );
  const drawLookedAtCardIfNeeded = jest.spyOn(
    Deck.prototype,
    "drawLookedAtCardIfNeeded"
  );
  const processDeckChanges = jest
    .spyOn(Deck.prototype, "processDeckChanges")
    .mockImplementation(() => null);
  const updateArchives = jest.spyOn(Deck.prototype, "updateArchives");
  const updateVP = jest.spyOn(Deck.prototype, "updateVP");

  const isConsecutiveMerchantBonus = jest.spyOn(
    Deck.prototype,
    "isConsecutiveMerchantBonus"
  );
  const handleConsecutiveMerchantBonus = jest.spyOn(
    Deck.prototype,
    "handleConsecutiveMerchantBonus"
  );
  const handleIncomingPasses = jest.spyOn(
    Deck.prototype,
    "handleIncomingPasses"
  );

  const setLogArchive = jest.spyOn(Deck.prototype, "setLogArchive");
  jest.spyOn(Deck.prototype, "checkLogAccuracy").mockReturnValue(true);

  beforeEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "pName", "pNick", [
      "Sentry",
      "Witch",
      "Copper",
      "Curse",
      "Vassal",
    ]);
  });

  it("should correctly handle single log lines that are consecutive treasure plays that do not apply to the deck", () => {
    // Arrange
    const log = ["oNick plays 2 Coppers and a Silver."];
    consecutiveTreasurePlays.mockImplementation(() => true);
    handleConsecutiveDuplicates.mockImplementation(() => [[],[]]);

    // Act - Simulate update deck with a line that doesn't apply to the deck and is a consecutive treasure play.
    deck.update(log);

    // Verify getActCardsAndCounts is called with the correct argument
    expect(getActCardsAndCounts).toBeCalledTimes(1);
    expect(getActCardsAndCounts).toBeCalledWith(log[0]);
    // Verify a check for consecutiveTreasurePlays occurred and returned true
    expect(consecutiveTreasurePlays).toBeCalledTimes(1);
    expect(consecutiveTreasurePlays).toBeCalledWith(log[0]);
    // Verify the consecutive treasure play was handled, and the logArchive line was removed
    expect(handleConsecutiveDuplicates).toBeCalledTimes(1);
    expect(handleConsecutiveDuplicates).toBeCalledWith(log[0]);
    expect(isConsecutiveMerchantBonus).toBeCalledTimes(1);
    expect(setLogArchive).toBeCalledTimes(1);
    // Verify a check for consecutive merchant bonus
    expect(handleConsecutiveMerchantBonus).not.toBeCalled();
    // Verify calls are not made to methods that are called for log lines that apply to this deck
    expect(shuffleAndCleanUpIfNeeded).not.toBeCalled();
    expect(drawLookedAtCardIfNeeded).not.toBeCalled();
    expect(processDeckChanges).not.toBeCalled();

    // Verify the archive and VP are updated
    expect(updateArchives).toBeCalledTimes(1);
    expect(updateArchives).toBeCalledWith(log[0]);
    expect(updateVP).toBeCalledTimes(1);

    // Add spy assertions for setLastEntryProcessed, addLogToLogArchive, etc

    expect(getMostRecentAction).toBeCalledTimes(1);
    expect(setLatestPlay).toBeCalledTimes(1);
    expect(handleIncomingPasses).not.toBeCalled();
  });

  it("should correctly handle single log lines that are non-consecutive treasure plays that do not apply to the deck", () => {
    // Arrange
    const log = ["oNick draws a card."];
    consecutiveTreasurePlays.mockImplementation(() => false);

    // Act - Simulate update deck with a line that doesn't apply to the deck and is not a consecutive treasure play.
    deck.update(log);

    // Assert
    expect(consecutiveTreasurePlays).toBeCalledTimes(1);
    expect(consecutiveTreasurePlays).toBeCalledWith(log[0]);
    expect(consecutiveTreasurePlays.mock.results[0].value).toBe(false);
    expect(handleConsecutiveDuplicates).not.toBeCalled();
    expect(shuffleAndCleanUpIfNeeded).not.toBeCalled();
    expect(getActCardsAndCounts).toBeCalledTimes(1);
    expect(drawLookedAtCardIfNeeded).not.toBeCalled();
    expect(processDeckChanges).not.toBeCalled();
    expect(updateArchives).toBeCalledTimes(1);
    expect(updateArchives).toBeCalledWith(log[0]);
    expect(updateVP).toBeCalledTimes(1);
    expect(getMostRecentAction).toBeCalledTimes(1);
    expect(setLatestPlay).toBeCalledTimes(1);
    expect(handleIncomingPasses).not.toBeCalled();
  });

  it("should correctly handle single log lines that apply to the deck", () => {
    // Arrange
    const log = ["pNick draws a Sentry."];

    // Act - Simulate update deck with a line that applies to the deck.
    deck.update(log);

    // Assert
    expect(shuffleAndCleanUpIfNeeded).toBeCalledTimes(1);
    expect(shuffleAndCleanUpIfNeeded).toBeCalledWith(log[0]);
    expect(getActCardsAndCounts).toBeCalledTimes(1);
    expect(getActCardsAndCounts).toBeCalledWith(log[0]);
    expect(getActCardsAndCounts.mock.results[0].value).toStrictEqual({
      act: "draws",
      cards: ["Sentry"],
      numberOfCards: [1],
    });
    expect(drawLookedAtCardIfNeeded).toBeCalledTimes(1);
    expect(drawLookedAtCardIfNeeded).toBeCalledWith("draws");
    expect(processDeckChanges).toBeCalledTimes(1);
    expect(processDeckChanges).toBeCalledWith(log[0], "draws", ["Sentry"], [1]);
    expect(updateArchives).toBeCalledTimes(1);
    expect(updateArchives).toBeCalledWith(log[0]);
    expect(updateVP).toBeCalledTimes(1);
    expect(getMostRecentAction).toBeCalledTimes(1);
    expect(setLatestPlay).toBeCalledTimes(1);
    expect(handleIncomingPasses).not.toBeCalled();
  });

  it("should correctly handle log arrays with multiple lines ", () => {
    // Arrange
    const log = [
      "pNick plays a Witch.",
      "pNick draws 2 Coppers.",
      "oNick gains a Curse.",
    ];

    // Act - Simulate update deck with a line that doesn't apply to the deck and is not a consecutive treasure play.
    deck.update(log);

    // Assert
    expect(consecutiveTreasurePlays).toBeCalledTimes(3);
    expect(shuffleAndCleanUpIfNeeded).toBeCalledTimes(2);
    expect(shuffleAndCleanUpIfNeeded).nthCalledWith(1, log[0]);
    expect(shuffleAndCleanUpIfNeeded).nthCalledWith(2, log[1]);
    expect(getActCardsAndCounts).toBeCalledTimes(3);
    expect(getActCardsAndCounts).nthCalledWith(1, log[0]);
    expect(getActCardsAndCounts).nthCalledWith(2, log[1]);
    expect(getActCardsAndCounts).nthCalledWith(3, log[2]);
    expect(processDeckChanges).toBeCalledTimes(2);
    expect(processDeckChanges).nthCalledWith(
      1,
      log[0],
      "plays",
      ["Witch"],
      [1]
    );
    expect(processDeckChanges).nthCalledWith(
      2,
      log[1],
      "draws",
      ["Copper"],
      [2]
    );
    expect(updateArchives).toBeCalledTimes(3);
    expect(updateArchives).nthCalledWith(1, log[0]);
    expect(updateArchives).nthCalledWith(2, log[1]);
    expect(updateArchives).nthCalledWith(3, log[2]);
    expect(updateVP).toBeCalledTimes(3);
    expect(getMostRecentAction).toBeCalledTimes(3);
    expect(setLatestPlay).toBeCalledTimes(3);
    expect(handleIncomingPasses).not.toBeCalled();
  });

  it("should correctly identify and remove repeat buy gains done by an opponent", () => {
    deck.logArchive = [
      "b gets +2 Actions.",
      "b gets +1 Buy.",
      "b gets +$2.",
      "b plays 3 Coppers. (+$3)",
      "b buys and gains a Vassal.",
    ];
    deck.lastEntryProcessed = "b buys and gains a Vassal.";
    deck.update(["b buys and gains 2 Vassals."]);
    expect(deck.logArchive).toStrictEqual([
      "b gets +2 Actions.",
      "b gets +1 Buy.",
      "b gets +$2.",
      "b plays 3 Coppers. (+$3)",
      "b buys and gains 2 Vassals.",
    ]);
  });

  it("should not remove treasure play log lines that are played by Courier", () => {
    deck.logArchive = [
      "t plays a Courier.",
      "t gets +$1.",
      "t shuffles their deck.",
      "t discards a Copper.",
      "t looks at a Copper.",
      "t plays a Copper. (+$1)",
    ];
    deck.latestPlaySource = "Courier";
    deck.update(["t plays a Silver and 2 Coppers. (+$4)"]);
    expect(deck.logArchive).toStrictEqual([
      "t plays a Courier.",
      "t gets +$1.",
      "t shuffles their deck.",
      "t discards a Copper.",
      "t looks at a Copper.",
      "t plays a Copper. (+$1)",
      "t plays a Silver and 2 Coppers. (+$4)",
    ]);
  });

  it("should not remove treasure play log lines that are played by Fortune Hunter", () => {
    deck.logArchive = [
      "t plays a Fortune Hunter.",
      "t gets +$2.",
      "t looks at 3 Coppers.",
      "t puts a Copper into their hand.",
      "t topdecks 2 Coppers.",
      "t plays a Copper. (+$1)",
    ];
    deck.latestPlaySource = "Fortune Hunter";
    deck.update(["t plays a Silver and 2 Coppers. (+$4)"]);
    expect(deck.logArchive).toStrictEqual([
      "t plays a Fortune Hunter.",
      "t gets +$2.",
      "t looks at 3 Coppers.",
      "t puts a Copper into their hand.",
      "t topdecks 2 Coppers.",
      "t plays a Copper. (+$1)",
      "t plays a Silver and 2 Coppers. (+$4)",
    ]);
  });
});
