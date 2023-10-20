import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function getActCardsAndCounts", () => {
  it("should return the act, the cards, and the counts of the cards from the current line", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", [
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
    const deck = new Deck("", false, "", "pNick", "pName", [
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
  });

  it("should handle consecutive treasure plays correctly", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", [
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
    const logArchive = ["Log1", "pNick plays 2 Coppers and a Silver."];
    deck.setLogArchive(logArchive);
    deck.setLastEntryProcessed("pNick plays 2 Coppers and a Silver.");
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
    const resultLogArchive = deck.getLogArchive();
    // Assert
    expect;
    expect(resultAct).toStrictEqual(expectedAct);
    expect(expectedCards).toStrictEqual(resultCards);
    expect(expectedNumber).toStrictEqual(resultNumbers);
    expect(resultLogArchive).toStrictEqual(expectedLogArchive);
  });

  it("should handle consecutive buys of the same card correctly", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", [
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
    const logArchive = ["Log1", "pNick buys and gains a Silver."];
    deck.setLogArchive(logArchive);
    deck.setLastEntryProcessed("pNick buys and gains a Silver.");
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
    expect;
    expect(resultAct).toStrictEqual(expectedAct);
    expect(expectedCards).toStrictEqual(resultCards);
    expect(expectedNumber).toStrictEqual(resultNumbers);
    expect(resultLogArchive).toStrictEqual(expectedLogArchive);
  });
});
