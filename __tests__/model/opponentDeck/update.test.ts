import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { OpponentDeck } from "../../../src/model/opponentDeck";

describe("Method update", () => {
  // Instantiate Deck object.
  let deck: OpponentDeck;
  // Spy on method dependencies

  const setTreasurePopped = jest.spyOn(
    OpponentDeck.prototype,
    "setTreasurePopped"
  );
  const logEntryAppliesToThisDeck = jest.spyOn(
    OpponentDeck.prototype,
    "logEntryAppliesToThisDeck"
  );
  const consecutiveTreasurePlays = jest.spyOn(
    OpponentDeck.prototype,
    "consecutiveTreasurePlays"
  );
  const getConsecutiveTreasurePlayCounts = jest.spyOn(
    OpponentDeck.prototype,
    "getConsecutiveTreasurePlayCounts"
  );
  const getActCardsAndCounts = jest.spyOn(
    OpponentDeck.prototype,
    "getActCardsAndCounts"
  );

  const processDeckChanges = jest
    .spyOn(OpponentDeck.prototype, "processDeckChanges")
    .mockImplementation(() => null); // Remove implementation for processDeckChanges
  const updateArchives = jest.spyOn(OpponentDeck.prototype, "updateArchives");
  const updateVP = jest.spyOn(OpponentDeck.prototype, "updateVP");

  beforeEach(() => {
    deck = new OpponentDeck("", false, "", "oName", "oNick", [
      "Chapel",
      "Copper",
      "Estate",
      "Militia",
    ]);
    jest.clearAllMocks();
  });

  it("should process a single log that applies to the deck correctly", () => {
    // Arrange
    const log = ["oNick plays a Chapel"];
    // Act - simulate updating the opponent deck with a log that plays a Chapel
    deck.update(log);

    // Assert - Verify that the treasurePopped field is set to false
    expect(setTreasurePopped).toBeCalledWith(false);
    // Verify the logEntryAppliesToThisDeck method was called and returned true
    expect(logEntryAppliesToThisDeck).toBeCalledTimes(1);
    expect(logEntryAppliesToThisDeck).toBeCalledWith(log[0]);
    expect(logEntryAppliesToThisDeck.mock.results[0].value).toBe(true);
    // Verify consecutiveTreasurePlays was called once and returned false(called within getActCardsAndCounts)
    expect(consecutiveTreasurePlays).toBeCalledTimes(1);
    expect(consecutiveTreasurePlays.mock.results[0].value).toBe(false);
    // Verify getConsecutiveTreasurePlayCounts was not called (should only be called if the given line plays a treasure)
    expect(getConsecutiveTreasurePlayCounts).not.toBeCalled();
    // Verify getActCardsAndCounts was called with the given line and returned correctly.
    expect(getActCardsAndCounts).toBeCalledTimes(1);
    expect(getActCardsAndCounts).toBeCalledWith(log[0]);
    expect(getActCardsAndCounts.mock.results[0].value).toStrictEqual({
      act: "plays",
      cards: ["Chapel"],
      numberOfCards: [1],
    });
    // Verify processDeckChanges was called with the correct arguments.
    expect(processDeckChanges).toBeCalledTimes(1);
    expect(processDeckChanges).toBeCalledWith(log[0], "plays", ["Chapel"], [1]);
    expect(updateArchives).toBeCalledTimes(1);
    expect(updateArchives).toBeCalledWith(log[0]);
    expect(updateVP).toBeCalledTimes(1);
  });

  // Case: Doesn't apply to deck, non consecutive treasure play
  it("should correctly process a single log that doesn't apply to the deck", () => {
    // Arrange
    const log = ["pNick draws a Chapel."];
    consecutiveTreasurePlays.mockImplementation(() => false);

    // Act - simulate an update with a log that is not a consecutive treasure play
    deck.update(log);

    // Assert - Verify that the treasurePopped field is set to false
    expect(setTreasurePopped).toBeCalledWith(false);
    // Verify getActsCardsAndCounts is called with the correct arguments and returns correctly
    expect(getActCardsAndCounts).toBeCalledTimes(1);
    expect(getActCardsAndCounts).toBeCalledWith(log[0]);
    expect(getActCardsAndCounts.mock.results[0].value).toStrictEqual({
      act: "draws",
      cards: ["Chapel"],
      numberOfCards: [1],
    });
    // Verify check for treasure play occurred and returned false.
    expect(consecutiveTreasurePlays).toBeCalledTimes(1);
    expect(consecutiveTreasurePlays).toBeCalledWith(log[0]);
    expect(consecutiveTreasurePlays.mock.results[0].value).toBe(false);
    // Verify getConsecutiveTreasurePlayCounts was not called000
    expect(getConsecutiveTreasurePlayCounts).not.toBeCalled();
    // Verify logEntryAppliesToThisDeck was called with the correct argument and returned correctly
    expect(logEntryAppliesToThisDeck).toBeCalledTimes(1);
    expect(logEntryAppliesToThisDeck).toBeCalledWith(log[0]);
    expect(logEntryAppliesToThisDeck.mock.results[0].value).toBe(false);
    // Verify processDeckChanges was not called
    expect(processDeckChanges).not.toBeCalled();
    // Verify archives and vp were updated
    expect(updateArchives).toBeCalledTimes(1);
    expect(updateArchives).toBeCalledWith(log[0]);
    expect(updateVP).toBeCalledTimes(1);
  });

  // Case: Multiple logs, some apply to the deck, some do not.
  it("should handle log arrays with multiple lines correctly", () => {
    // Arrange
    const log = [
      "pNick plays a Militia.",
      "pNick gets +$2.",
      "oNick discards a Copper and an Estate.",
    ];
    consecutiveTreasurePlays.mockImplementation(() => false);

    // Act - Simulate updating with 3 logs in one call
    deck.update(log);

    // Assert - Verify setTreasurePopped was called 3 times (number of lines in log)
    expect(setTreasurePopped).toBeCalledTimes(3);
    // Verify getActCardsAndCounts was called 3 times, with the correct arguments.
    expect(getActCardsAndCounts).toBeCalledTimes(3);
    expect(getActCardsAndCounts).nthCalledWith(1, log[0]);
    expect(getActCardsAndCounts).nthCalledWith(2, log[1]);
    expect(getActCardsAndCounts).nthCalledWith(3, log[2]);
    // Verify consecutiveTreasurePlays was called 3 times.
    expect(consecutiveTreasurePlays).toBeCalledTimes(3);
    expect(consecutiveTreasurePlays.mock.results[0].value).toBe(false);
    expect(consecutiveTreasurePlays.mock.results[1].value).toBe(false);
    expect(consecutiveTreasurePlays.mock.results[2].value).toBe(false);
    // verify getActCardsAndCounts returned the correct values
    expect(getActCardsAndCounts.mock.results[0].value).toStrictEqual({
      act: "plays",
      cards: ["Militia"],
      numberOfCards: [1],
    });
    expect(getActCardsAndCounts.mock.results[1].value).toStrictEqual({
      act: "None",
      cards: [],
      numberOfCards: [],
    });
    expect(getActCardsAndCounts.mock.results[2].value).toStrictEqual({
      act: "discards",
      cards: ["Copper", "Estate"],
      numberOfCards: [1, 1],
    });
    // Verify no call made to getConsecutiveTreasureCounts
    expect(getConsecutiveTreasurePlayCounts).not.toBeCalled();
    // Verify calls and results from logEntryAppliesToThisDeck
    expect(logEntryAppliesToThisDeck).toBeCalledTimes(3);
    expect(logEntryAppliesToThisDeck).nthCalledWith(1, log[0]);
    expect(logEntryAppliesToThisDeck).nthCalledWith(2, log[1]);
    expect(logEntryAppliesToThisDeck).nthCalledWith(3, log[2]);
    expect(logEntryAppliesToThisDeck.mock.results[0].value).toBe(false);
    expect(logEntryAppliesToThisDeck.mock.results[1].value).toBe(false);
    expect(logEntryAppliesToThisDeck.mock.results[2].value).toBe(true);
    // Verify processDeckChanges was only called 1 time, for the line that applies to the deck
    expect(processDeckChanges).toBeCalledTimes(1);
    expect(processDeckChanges).toBeCalledWith(
      "oNick discards a Copper and an Estate.",
      "discards",
      ["Copper", "Estate"],
      [1, 1]
    );
    // Verify archives and VP updated
    expect(updateArchives).toBeCalledTimes(3);
    expect(updateArchives).nthCalledWith(1, log[0]);
    expect(updateArchives).nthCalledWith(2, log[1]);
    expect(updateArchives).nthCalledWith(3, log[2]);
    expect(updateVP).toBeCalledTimes(3);
  });

  // Case: Log entry doesn't apply to the deck and is a consecutive treasure play.

  it("should correctly process a log line that doesn't apply to the deck and is a consecutive treasure play", () => {
    // Arrange - mockResult true from consecutiveTreasurePlays
    consecutiveTreasurePlays.mockReturnValue(true);
    deck.lastEntryProcessed = "pNick plays a Copper.";
    // Act - simulate an opponent making a consecutive treasure play.
    deck.update(["pNick plays 2 Coppers."]);

    // Assert - Verify treasurePopped was set to false, and then set to true
    expect(setTreasurePopped).toBeCalledTimes(2);
    expect(setTreasurePopped).nthCalledWith(1, false);
    expect(setTreasurePopped).nthCalledWith(2, true);
    expect(logEntryAppliesToThisDeck.mock.results[0].value).toBe(false);
    // Verify consecutiveTreasurePlays was called and returned the mock value true
    expect(consecutiveTreasurePlays).toBeCalledTimes(1);
    expect(consecutiveTreasurePlays).toBeCalledWith("pNick plays 2 Coppers.");
    expect(consecutiveTreasurePlays.mock.results[0].value).toBe(true);
    // Verify calls and results from logEntryAppliesToThisDeck
    expect(logEntryAppliesToThisDeck).toBeCalledTimes(1);
    expect(logEntryAppliesToThisDeck).toBeCalledWith("pNick plays 2 Coppers.");
    // Verify  getConsecutiveTreasurePlayCounts was called and returned correctly
    expect(getConsecutiveTreasurePlayCounts).toBeCalledTimes(1);
    expect(getConsecutiveTreasurePlayCounts).toBeCalledWith(
      "pNick plays 2 Coppers."
    );
    expect(
      getConsecutiveTreasurePlayCounts.mock.results[0].value
    ).toStrictEqual([1, 0, 0, 0]);
    // Verify update to archives and VP are called.
    expect(updateArchives).toBeCalledTimes(1);
    expect(updateArchives).toBeCalledWith("pNick plays 2 Coppers.");
    expect(updateVP).toBeCalledTimes(1);
  });
});
