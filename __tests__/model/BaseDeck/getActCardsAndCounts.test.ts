import { it, describe, expect, afterEach, jest } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("Function getActCardsAndCounts", () => {
  let deck = new BaseDeck("", false, "", "pNick", "pName", [
    "Cellar",
    "Chapel",
    "Moat",
    "Harbinger",
    "Merchant",
    "Vassal",
    "Village",
    "Workshop",
    "Copper",
    "Curse",
    "Estate",
    "Silver",
    "Duchy",
    "Gold",
    "Province",
  ]);

  const consecutiveTreasurePlays = jest.spyOn(
    BaseDeck.prototype,
    "consecutiveTreasurePlays"
  );
  const getConsecutiveTreasurePlayCounts = jest.spyOn(
    BaseDeck.prototype,
    "getConsecutiveTreasurePlayCounts"
  );
  const getActionFromEntry = jest.spyOn(
    BaseDeck.prototype,
    "getActionFromEntry"
  );
  const getCardsAndCountsFromEntry = jest.spyOn(
    BaseDeck.prototype,
    "getCardsAndCountsFromEntry"
  );
  const consecutiveBuysOfSameCard = jest.spyOn(
    BaseDeck.prototype,
    "consecutiveBuysOfSameCard"
  );
  const getRepeatBuyGainCounts = jest.spyOn(
    BaseDeck.prototype,
    "getRepeatBuyGainCounts"
  );

  afterEach(() => {
    jest.clearAllMocks();
    deck = new BaseDeck("", false, "", "pNick", "pName", [
      "Cellar",
      "Chapel",
      "Moat",
      "Harbinger",
      "Merchant",
      "Vassal",
      "Village",
      "Workshop",
      "Copper",
      "Curse",
      "Estate",
      "Silver",
      "Duchy",
      "Gold",
      "Province",
    ]);
  });

  it("should return the act, the cards, and the counts of the cards from the current line", () => {
    // Arrange
    const line = "pNick plays a Vassal.";
    const expectedAct: string = "plays";
    const expectedCards: string[] = ["Vassal"];
    const expectedNumber: number[] = [1];

    // Act
    const {
      act: resultAct,
      cards: resultCards,
      numberOfCards: resultNumbers,
    } = deck.getActCardsAndCounts(line);

    // Assert
    expect(resultAct).toStrictEqual(expectedAct);
    expect(expectedCards).toStrictEqual(resultCards);
    expect(expectedNumber).toStrictEqual(resultNumbers);
    expect(consecutiveTreasurePlays).toBeCalledTimes(1);
    expect(consecutiveTreasurePlays.mock.results[0].value).toBe(false);
    expect(getConsecutiveTreasurePlayCounts).not.toBeCalled();
    expect(getActionFromEntry).toBeCalledTimes(1);
    expect(getActionFromEntry).toBeCalledWith(line);
    expect(getActionFromEntry.mock.results[0].value).toBe("plays");
    expect(getCardsAndCountsFromEntry).toBeCalledTimes(1);
    expect(getCardsAndCountsFromEntry).toBeCalledWith(line);
    expect(getCardsAndCountsFromEntry.mock.results[0].value).toStrictEqual([
      ["Vassal"],
      [1],
    ]);
    expect(consecutiveBuysOfSameCard).toBeCalledTimes(1);
    expect(consecutiveBuysOfSameCard).toBeCalledWith("plays", line, "Vassal");
    expect(getRepeatBuyGainCounts).not.toBeCalled();
  });

  it("should work for lines with multiple cards with different amounts", () => {
    // Arrange
    const line = "pNick discards a Vassal, an Estate, 2 Curses, and 5 Golds.";
    const expectedAct: string = "discards";

    // Note about order of cards in the array:
    // Order is coming from the order than the cards appear in the kingdom, not the line.
    const expectedCards: string[] = ["Vassal", "Curse", "Estate", "Gold"];
    const expectedNumber: number[] = [1, 2, 1, 5];

    // Act
    const {
      act: resultAct,
      cards: resultCards,
      numberOfCards: resultNumbers,
    } = deck.getActCardsAndCounts(line);

    // Assert
    expect(resultAct).toStrictEqual(expectedAct);
    expect(expectedCards).toStrictEqual(resultCards);
    expect(expectedNumber).toStrictEqual(resultNumbers);
    expect(consecutiveTreasurePlays).toBeCalledTimes(1);
    expect(consecutiveTreasurePlays).toBeCalledWith(line);
    expect(consecutiveTreasurePlays.mock.results[0].value).toBe(false);
    expect(getConsecutiveTreasurePlayCounts).not.toBeCalled();
    expect(getActionFromEntry).toBeCalledTimes(1);
    expect(getActionFromEntry).toBeCalledWith(line);
    expect(getActionFromEntry.mock.results[0].value).toStrictEqual("discards");
    expect(getCardsAndCountsFromEntry).toBeCalledTimes(1);
    expect(getCardsAndCountsFromEntry).toBeCalledWith(line);
    expect(getCardsAndCountsFromEntry.mock.results[0].value).toStrictEqual([
      expectedCards,
      expectedNumber,
    ]);
    expect(consecutiveBuysOfSameCard).toBeCalledTimes(1);
    expect(consecutiveBuysOfSameCard).toBeCalledWith(
      "discards",
      line,
      "Vassal"
    );
    expect(consecutiveBuysOfSameCard.mock.results[0].value).toBe(false);
    expect(getRepeatBuyGainCounts).not.toBeCalled();
  });

  it("should handle consecutive treasure plays correctly", () => {
    // Arrange
    deck.logArchive = ["Log1", "pNick plays 2 Coppers and a Silver."];
    deck.lastEntryProcessed = "pNick plays 2 Coppers and a Silver.";
    const line = "pNick plays 2 Coppers and 2 Silvers.";
    const expectedAct: string = "plays";

    // Note about order of cards in the array:
    // Order is coming from the order than the cards appear in the kingdom, not the line.
    const expectedCards: string[] = ["Copper", "Silver", "Gold"];
    const expectedNumber: number[] = [0, 1, 0];
    const expectedLogArchive = ["Log1"];
    // Act
    const {
      act: resultAct,
      cards: resultCards,
      numberOfCards: resultNumbers,
    } = deck.getActCardsAndCounts(line);
    const resultLogArchive = deck.logArchive;

    // Assert
    expect;
    expect(resultAct).toStrictEqual(expectedAct);
    expect(expectedCards).toStrictEqual(resultCards);
    expect(expectedNumber).toStrictEqual(resultNumbers);
    expect(resultLogArchive).toStrictEqual(expectedLogArchive);
    expect(consecutiveTreasurePlays).toBeCalledTimes(1);
    expect(consecutiveTreasurePlays).toBeCalledWith(line);
    expect(consecutiveTreasurePlays.mock.results[0].value).toBe(true);
    expect(getConsecutiveTreasurePlayCounts).toBeCalledTimes(1);
    expect(getConsecutiveTreasurePlayCounts).toBeCalledWith(line);
    expect(
      getConsecutiveTreasurePlayCounts.mock.results[0].value
    ).toStrictEqual([0, 1, 0]);
    expect(getActionFromEntry).not.toBeCalled();
    expect(getCardsAndCountsFromEntry).not.toBeCalled();
    expect(consecutiveBuysOfSameCard).not.toBeCalled();
    expect(getRepeatBuyGainCounts).not.toBeCalled();
  });

  it("should handle consecutive buys of the same card correctly", () => {
    // Arrange
    const initialLogArchive = ["Log1", "pNick buys and gains a Silver."];
    deck.logArchive = initialLogArchive;
    deck.lastEntryProcessed = "pNick buys and gains a Silver.";
    const line = "pNick buys and gains 2 Silvers.";
    const expectedAct: string = "gains";

    // Note about order of cards in the array:
    // Order is coming from the order than the cards appear in the kingdom, not the line.
    const expectedCards: string[] = ["Silver"];
    const expectedNumber: number[] = [1];
    const expectedLogArchive = ["Log1"];

    // Act
    const {
      act: resultAct,
      cards: resultCards,
      numberOfCards: resultNumbers,
    } = deck.getActCardsAndCounts(line);
    const resultLogArchive = deck.getLogArchive();
    // Assert
    expect(resultAct).toStrictEqual(expectedAct);
    expect(expectedCards).toStrictEqual(resultCards);
    expect(expectedNumber).toStrictEqual(resultNumbers);
    expect(resultLogArchive).toStrictEqual(expectedLogArchive);
    expect(consecutiveTreasurePlays).toBeCalledTimes(1);
    expect(consecutiveTreasurePlays).toBeCalledWith(line);
    expect(consecutiveTreasurePlays.mock.results[0].value).toBe(false);
    expect(getConsecutiveTreasurePlayCounts).not.toBeCalled();
    expect(getActionFromEntry).toBeCalledTimes(1);
    expect(getActionFromEntry).toBeCalledWith(line);
    expect(getActionFromEntry.mock.results[0].value).toStrictEqual("gains");
    expect(getCardsAndCountsFromEntry).toBeCalledTimes(1);
    expect(getCardsAndCountsFromEntry).toBeCalledWith(line);
    expect(getCardsAndCountsFromEntry.mock.results[0].value).toStrictEqual([
      ["Silver"],
      [1],
    ]);
    expect(consecutiveBuysOfSameCard).toBeCalledTimes(1);
    expect(consecutiveBuysOfSameCard).toBeCalledWith("gains", line, "Silver");
    expect(consecutiveBuysOfSameCard.mock.results[0].value).toBe(true);
    expect(getRepeatBuyGainCounts).toBeCalledTimes(1);
    expect(getRepeatBuyGainCounts).toBeCalledWith(line, initialLogArchive);
    expect(getRepeatBuyGainCounts.mock.results[0].value).toBe(1);
  });
});
