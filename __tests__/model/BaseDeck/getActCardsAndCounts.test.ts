import { it, describe, expect, beforeEach } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("getActCardsAndCounts", () => {
  let deck: BaseDeck;

  beforeEach(() => {
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
  });

  it("should work for lines with multiple cards with different amounts", () => {
    // Arrange
    const line = "pNick discards a Vassal, an Estate, 2 Curses, and 5 Golds.";
    const expectedAct: string = "discards";
    const expectedCards: string[] = ["Vassal", "Estate", "Curse", "Gold"];
    const expectedNumber: number[] = [1, 1, 2, 5];

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
  });

  it("should handle consecutive treasure plays correctly", () => {
    // Arrange
    deck.logArchive = ["Log1", "pNick plays 2 Coppers and a Silver."];
    deck.lastEntryProcessed = "pNick plays 2 Coppers and a Silver.";
    const line = "pNick plays 2 Coppers and 2 Silvers.";
    const expectedAct: string = "plays";
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
  });

  it("should handle consecutive buys of the same card correctly", () => {
    // Arrange
    const initialLogArchive = ["Log1", "pNick buys and gains a Silver."];
    deck.logArchive = initialLogArchive;
    deck.lastEntryProcessed = "pNick buys and gains a Silver.";
    const line = "pNick buys and gains 2 Silvers.";
    const expectedAct: string = "gains";
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
  });
});
