import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { OpponentDeck } from "../../../src/model/opponentDeck";

describe("Function update", () => {
  let deck = new OpponentDeck("", false, "", "oName", "oNick", []);
  // Mock function dependencies
  const logEntryAppliesToThisDeck = jest.spyOn(
    OpponentDeck.prototype,
    "logEntryAppliesToThisDeck"
  );
  const consecutiveTreasurePlays = jest.spyOn(
    OpponentDeck.prototype,
    "consecutiveTreasurePlays"
  );
  const handleConsecutiveTreasurePlays = jest.spyOn(
    OpponentDeck.prototype,
    "handleConsecutiveTreasurePlays"
  );
  const getActCardsAndCounts = jest
    .spyOn(OpponentDeck.prototype, "getActCardsAndCounts")
    .mockImplementation(() => {
      return { act: "", cards: [], numberOfCards: [] };
    });
  const processDeckChanges = jest
    .spyOn(OpponentDeck.prototype, "processDeckChanges")
    .mockImplementation(() => null); // Remove implementation for processDeckChanges
  const updateArchives = jest.spyOn(OpponentDeck.prototype, "updateArchives");
  const updateVP = jest.spyOn(OpponentDeck.prototype, "updateVP");

  afterEach(() => {
    deck = new OpponentDeck("", false, "", "oName", "oNick", []);
    jest.clearAllMocks();
  });

  it("should process a single log that applies to the deck correctly", () => {
    // Arrange
    const log = ["oNick plays a Chapel"];
    deck.kingdom = ["Chapel"]; // Needed for getActAndCardCounts to find Chapel
    // Act - simulate updating the opponent deck with a log that plays a Chapel
    deck.update(log);

    // Assert
    expect(logEntryAppliesToThisDeck).toBeCalledTimes(1);
    expect(logEntryAppliesToThisDeck).toBeCalledWith(log[0]);
    expect(logEntryAppliesToThisDeck.mock.results[0].value).toBe(true);
    expect(consecutiveTreasurePlays).not.toBeCalled()
    expect(handleConsecutiveTreasurePlays).not.toBeCalled();
    expect(getActCardsAndCounts).toBeCalledTimes(1);
    expect(getActCardsAndCounts).toBeCalledWith(log[0]);
    expect(processDeckChanges).toBeCalledTimes(1);
    expect(updateArchives).toBeCalledTimes(1);
    expect(updateArchives).toBeCalledWith(log[0]);
    expect(updateVP).toBeCalledTimes(1);
  });

  // Case: Doesn't apply to deck, non consecutive treasure play
  it("should correctly process a single log that doesn't apply to the deck", () => {
    // Arrange
    const log = ["pNick draws 2 cards."];
    consecutiveTreasurePlays.mockImplementation(() => false);

    // Act - simulate an update with a log that is not a consecutive treasure play
    deck.update(log);

    // Assert
    expect(logEntryAppliesToThisDeck).toBeCalledTimes(1);
    expect(logEntryAppliesToThisDeck).toBeCalledWith(log[0]);
    expect(logEntryAppliesToThisDeck.mock.results[0].value).toBe(false);
    expect(consecutiveTreasurePlays).toBeCalledTimes(1);
    expect(consecutiveTreasurePlays).toBeCalledWith(log[0]);
    expect(consecutiveTreasurePlays.mock.results[0].value).toBe(false);
    expect(handleConsecutiveTreasurePlays).not.toBeCalled();
    expect(getActCardsAndCounts).not.toBeCalled();
    expect(processDeckChanges).not.toBeCalled();
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
    deck.kingdom = ["Copper", "Estate"]; // Needed for getCardsAndCountsFromEntry to find cards from the line

    // Act - Simulate updating with 3 logs in one call
    deck.update(log);

    // Assert
    expect(logEntryAppliesToThisDeck).toBeCalledTimes(3);
    expect(logEntryAppliesToThisDeck).nthCalledWith(1, log[0]);
    expect(logEntryAppliesToThisDeck).nthCalledWith(2, log[1]);
    expect(logEntryAppliesToThisDeck).nthCalledWith(3, log[2]);
    expect(logEntryAppliesToThisDeck.mock.results[0].value).toBe(false);
    expect(logEntryAppliesToThisDeck.mock.results[1].value).toBe(false);
    expect(logEntryAppliesToThisDeck.mock.results[2].value).toBe(true);
    expect(consecutiveTreasurePlays).toBeCalledTimes(2);
    expect(handleConsecutiveTreasurePlays).not.toBeCalled();
    expect(getActCardsAndCounts).toBeCalledTimes(1);
    expect(getActCardsAndCounts).toBeCalledWith(log[2]);
    expect(processDeckChanges).toBeCalledTimes(1);
    expect(updateArchives).toBeCalledTimes(3);
    expect(updateArchives).nthCalledWith(1, log[0]);
    expect(updateArchives).nthCalledWith(2, log[1]);
    expect(updateArchives).nthCalledWith(3, log[2]);
    expect(updateVP).toBeCalledTimes(3);
  });

  // Case: Log entry doesn't apply to the deck and is a consecutive treasure play.

  it("should correctly process a log line that doesn't apply to the deck and is a consecutive treasure play", () => {
    // Arrange
    consecutiveTreasurePlays.mockImplementation(() => true);

    // Act - simulate an opponent making a consecutive treasure play.
    deck.update(["pNick plays 2 Coppers."]);

    // Assert
    expect(logEntryAppliesToThisDeck).toBeCalledTimes(1);
    expect(logEntryAppliesToThisDeck).toBeCalledWith("pNick plays 2 Coppers.");
    expect(logEntryAppliesToThisDeck.mock.results[0].value).toBe(false);
    expect(consecutiveTreasurePlays).toBeCalledTimes(1);
    expect(consecutiveTreasurePlays).toBeCalledWith("pNick plays 2 Coppers.");
    expect(consecutiveTreasurePlays.mock.results[0].value).toBe(true);
    expect(handleConsecutiveTreasurePlays).toBeCalledTimes(1);
    expect(handleConsecutiveTreasurePlays).toBeCalledWith(
      "pNick plays 2 Coppers."
    );
    expect(updateArchives).toBeCalledTimes(1);
    expect(updateArchives).toBeCalledWith("pNick plays 2 Coppers.");
    expect(updateVP).toBeCalledTimes(1);
  });
});
