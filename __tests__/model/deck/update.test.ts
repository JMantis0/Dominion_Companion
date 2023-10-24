import { describe, it, expect, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { afterEach } from "node:test";

describe("Method update()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", [
    "Sentry",
    "Witch",
    "Copper",
    "Curse",
  ]);
  // Spy on method dependencies
  const setTreasurePopped = jest.spyOn(Deck.prototype, "setTreasurePopped");
  const logEntryAppliesToThisDeck = jest.spyOn(
    Deck.prototype,
    "logEntryAppliesToThisDeck"
  );
  const consecutiveTreasurePlays = jest.spyOn(
    Deck.prototype,
    "consecutiveTreasurePlays"
  );
  const getMostRecentPlay = jest
    .spyOn(Deck.prototype, "getMostRecentPlay")
    .mockImplementation(() => "");
  const setLatestPlay = jest.spyOn(Deck.prototype, "setLatestPlay");
  const getConsecutiveTreasurePlayCounts = jest.spyOn(
    Deck.prototype,
    "getConsecutiveTreasurePlayCounts"
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should correctly handle single log lines that are consecutive treasure plays that do not apply to the deck", () => {
    // Arrange
    const log = ["oNick plays 2 Coppers and a Silver."];
    consecutiveTreasurePlays.mockImplementation(() => true);
    getConsecutiveTreasurePlayCounts.mockImplementation(() => []);

    // Act - Simulate update deck with a line that doesn't apply to the deck and is a consecutive treasure play.
    deck.update(log);

    // Assert
    expect(setTreasurePopped).toBeCalledTimes(1);
    expect(setTreasurePopped).toBeCalledWith(false);
    expect(logEntryAppliesToThisDeck).toBeCalledTimes(1);
    expect(logEntryAppliesToThisDeck).toBeCalledWith(log[0]);
    expect(logEntryAppliesToThisDeck.mock.results[0].value).toBe(false);
    expect(consecutiveTreasurePlays).toBeCalledTimes(1);
    expect(consecutiveTreasurePlays).toBeCalledWith(log[0]);
    expect(getConsecutiveTreasurePlayCounts).toBeCalledTimes(1);
    expect(getConsecutiveTreasurePlayCounts).toBeCalledWith(log[0]);
    expect(shuffleAndCleanUpIfNeeded).not.toBeCalled();
    expect(getActCardsAndCounts).not.toBeCalled();
    expect(drawLookedAtCardIfNeeded).not.toBeCalled();
    expect(processDeckChanges).not.toBeCalled();
    expect(updateArchives).toBeCalledTimes(1);
    expect(updateArchives).toBeCalledWith(log[0]);
    expect(updateVP).toBeCalledTimes(1);
    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(setLatestPlay).toBeCalledTimes(1);
  });

  it("should correctly handle single log lines that are non-consecutive treasure plays that do not apply to the deck", () => {
    // Arrange
    const log = ["oNick draws a card."];
    consecutiveTreasurePlays.mockImplementation(() => false);

    // Act - Simulate update deck with a line that doesn't apply to the deck and is not a consecutive treasure play.
    deck.update(log);

    // Assert
    expect(setTreasurePopped).toBeCalledTimes(1);
    expect(setTreasurePopped).toBeCalledWith(false);
    expect(logEntryAppliesToThisDeck).toBeCalledTimes(1);
    expect(logEntryAppliesToThisDeck).toBeCalledWith(log[0]);
    expect(logEntryAppliesToThisDeck.mock.results[0].value).toBe(false);
    expect(consecutiveTreasurePlays).toBeCalledTimes(1);
    expect(consecutiveTreasurePlays).toBeCalledWith(log[0]);
    expect(consecutiveTreasurePlays.mock.results[0].value).toBe(false);
    expect(getConsecutiveTreasurePlayCounts).not.toBeCalled();
    expect(shuffleAndCleanUpIfNeeded).not.toBeCalled();
    expect(getActCardsAndCounts).not.toBeCalled();
    expect(drawLookedAtCardIfNeeded).not.toBeCalled();
    expect(processDeckChanges).not.toBeCalled();
    expect(updateArchives).toBeCalledTimes(1);
    expect(updateArchives).toBeCalledWith(log[0]);
    expect(updateVP).toBeCalledTimes(1);
    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(setLatestPlay).toBeCalledTimes(1);
  });

  it("should correctly handle single log lines that apply to the deck", () => {
    // Arrange
    const log = ["pNick draws a Sentry."];

    // Act - Simulate update deck with a line that applies to the deck.
    deck.update(log);

    // Assert
    expect(setTreasurePopped).toBeCalledTimes(1);
    expect(setTreasurePopped).toBeCalledWith(false);
    expect(logEntryAppliesToThisDeck).toBeCalledTimes(1);
    expect(logEntryAppliesToThisDeck).toBeCalledWith(log[0]);
    expect(logEntryAppliesToThisDeck.mock.results[0].value).toBe(true);
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
    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(setLatestPlay).toBeCalledTimes(1);
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
    expect(setTreasurePopped).toBeCalledTimes(3);
    expect(logEntryAppliesToThisDeck).toBeCalledTimes(3);
    expect(consecutiveTreasurePlays).toBeCalledTimes(3);
    expect(shuffleAndCleanUpIfNeeded).toBeCalledTimes(2);
    expect(shuffleAndCleanUpIfNeeded).nthCalledWith(1, log[0]);
    expect(shuffleAndCleanUpIfNeeded).nthCalledWith(2, log[1]);
    expect(getActCardsAndCounts).toBeCalledTimes(2);
    expect(getActCardsAndCounts).nthCalledWith(1, log[0]);
    expect(getActCardsAndCounts).nthCalledWith(2, log[1]);
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
    expect(getMostRecentPlay).toBeCalledTimes(3);
    expect(setLatestPlay).toBeCalledTimes(3);
  });
});
