import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("getActCardsAndCounts", () => {
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "pNick", "pName", [
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
      "Sentry",
      "Platinum",
      "Overgrown Estate",
      "Hovel"
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
    expect(resultCards).toStrictEqual(expectedCards);
    expect(resultNumbers).toStrictEqual(expectedNumber);
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
    expect(resultCards).toStrictEqual(expectedCards);
    expect(resultNumbers).toStrictEqual(expectedNumber);
  });

  it("should handle consecutive treasure plays correctly", () => {
    // Arrange
    deck.logArchive = ["Log1", "pNick plays 2 Coppers and a Silver."];
    deck.lastEntryProcessed = "pNick plays 2 Coppers and a Silver.";
    const line = "pNick plays 2 Coppers and 2 Silvers.";
    const expectedAct: string = "plays";
    const expectedCards: string[] = ["Copper", "Silver"];
    const expectedNumber: number[] = [0, 1];
    const expectedLogArchive = ["Log1"];
    // Act
    const {
      act: resultAct,
      cards: resultCards,
      numberOfCards: resultNumbers,
    } = deck.getActCardsAndCounts(line);
    const resultLogArchive = deck.logArchive;

    // Assert
    expect(resultAct).toStrictEqual(expectedAct);
    expect(resultCards).toStrictEqual(expectedCards);
    expect(resultNumbers).toStrictEqual(expectedNumber);
    expect(resultLogArchive).toStrictEqual(expectedLogArchive);
  });

  it("should handle consecutive Platinum plays correctly", () => {
    // Arrange
    deck.logArchive = ["Log1", "pNick plays 2 Coppers and a Silver."];
    deck.lastEntryProcessed = "pNick plays 2 Coppers and a Platinum.";
    const line = "pNick plays 2 Coppers and 2 Platina.";
    const expectedAct: string = "plays";
    const expectedCards: string[] = ["Copper", "Platinum"];
    const expectedNumber: number[] = [0, 1];
    const expectedLogArchive = ["Log1"];
    // Act
    const {
      act: resultAct,
      cards: resultCards,
      numberOfCards: resultNumbers,
    } = deck.getActCardsAndCounts(line);
    const resultLogArchive = deck.logArchive;

    // Assert
    expect(resultAct).toStrictEqual(expectedAct);
    expect(resultCards).toStrictEqual(expectedCards);
    expect(resultNumbers).toStrictEqual(expectedNumber);
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
    expect(resultCards).toStrictEqual(expectedCards);
    expect(resultNumbers).toStrictEqual(expectedNumber);
    expect(resultLogArchive).toStrictEqual(expectedLogArchive);
  });

  it("should handle consecutive Sage reveals correctly", () => {
    // Arrange
    const initialLogArchive = [
      "pNick plays a Sage.",
      "pNick gets +1 Action.",
      "pNick reveals 2 Coppers.",
      "pNick shuffles their deck.",
      "pNick reveals 3 Coppers and a Chapel.",
    ];
    deck.latestAction = "Sage";
    deck.logArchive = initialLogArchive;
    deck.lastEntryProcessed = "pNick reveals 3 Coppers and a Chapel.";
    const line = "pNick reveals 3 Coppers and 2 Chapels.";
    const expectedAct: string = "reveals";
    const expectedCards: string[] = ["Copper", "Chapel"];
    const expectedNumber: number[] = [0, 1];
    const expectedLogArchive = [
      "pNick plays a Sage.",
      "pNick gets +1 Action.",
      "pNick reveals 2 Coppers.",
      "pNick shuffles their deck.",
    ];
    // Act
    const {
      act: resultAct,
      cards: resultCards,
      numberOfCards: resultNumbers,
    } = deck.getActCardsAndCounts(line);
    const resultLogArchive = deck.getLogArchive();
    // Assert
    expect(resultAct).toStrictEqual(expectedAct);
    expect(resultCards).toStrictEqual(expectedCards);
    expect(resultNumbers).toStrictEqual(expectedNumber);
    expect(resultLogArchive).toStrictEqual(expectedLogArchive);
  });

  it(
    "should handle non-hand source consecutive treasure plays correctly when" +
      "a consecutive treasure is played by a Fortune Hunter ",
    () => {
      // Arrange
      deck.latestPlaySource = "Fortune Hunter";
      deck.logArchive = [
        "pNick plays a Fortune Hunter.",
        "pNick gets +$2.",
        "pNick looks at a Copper.",
        "pNick plays a Copper. (+$1)",
      ];
      deck.lastEntryProcessed = "pNick plays a Copper. (+$1)";
      const line = "pNick plays a Copper. (+$1)";
      // Act
      deck.getActCardsAndCounts(line);
      const resultLogArchive = deck.getLogArchive();
      // Assert
      expect(resultLogArchive).toStrictEqual([
        "pNick plays a Fortune Hunter.",
        "pNick gets +$2.",
        "pNick looks at a Copper.",
        "pNick plays a Copper. (+$1)",
      ]);
    }
  );

  it(
    "should handle non-hand source consecutive treasure plays correctly when" +
      "a consecutive treasure is played by a Courier",
    () => {
      // Arrange
      deck.latestPlaySource = "Courier";
      deck.logArchive = [
        "pNick plays a Courier.",
        "pNick gets +$1.",
        "pNick looks at a Copper.",
        "pNick plays a Copper. (+$1)",
      ];
      deck.lastEntryProcessed = "pNick plays a Copper. (+$1)";
      const line = "pNick plays a Copper. (+$1)";
      // Act
      deck.getActCardsAndCounts(line);
      const resultLogArchive = deck.getLogArchive();
      // Assert
      expect(resultLogArchive).toStrictEqual([
        "pNick plays a Courier.",
        "pNick gets +$1.",
        "pNick looks at a Copper.",
        "pNick plays a Copper. (+$1)",
      ]);
    }
  );

  it("should handle consecutive trashes correctly", () => {
    // Arrange
    const initialLogArchive = ["Log1", "pNick trashes a Silver."];
    deck.logArchive = initialLogArchive.slice();
    deck.lastEntryProcessed = "pNick trashes a Silver.";
    const line = "pNick trashes 2 Silvers.";
    const expectedAct: string = "trashes";
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

  it(
    "should handle consecutive trashes correctly when the current line contains a card type that" +
      "is not present on the previous line",
    () => {
      // Arrange
      const initialLogArchive = ["Log1", "pNick trashes a Silver."];
      deck.logArchive = initialLogArchive.slice();
      deck.lastEntryProcessed = "pNick trashes a Silver.";
      const line = "pNick trashes a Silver and a Sentry.";
      const expectedAct: string = "trashes";
      const expectedCards: string[] = ["Silver", "Sentry"];
      const expectedNumber: number[] = [0, 1];
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
    }
  );

  it("should handle consecutive gains without buys correctly", () => {
    // Arrange
    const initialLogArchive = [
      "pNick trashes a Treasure Map.",
      "pNick gains a Gold.",
    ];
    deck.logArchive = initialLogArchive.slice();
    deck.lastEntryProcessed = "pNick gains a Gold.";
    const line = "pNick gains 4 Golds.";
    const expectedAct: string = "gains";
    const expectedCards: string[] = ["Gold"];
    const expectedNumber: number[] = [3];
    const expectedLogArchive = ["pNick trashes a Treasure Map."];

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

  it("should handle consecutive 'into their hand' lines correctly", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays a Hunter.",
      "pNick gest +1 Action.",
      "pNick reveals a Copper and 2 Estates.",
      "pNick puts a Copper into their hand.",
    ];
    deck.lastEntryProcessed = "pNick puts a Copper into their hand.";

    // Act
    const { act, cards, numberOfCards } = deck.getActCardsAndCounts(
      "pNick puts a Copper and an Estate into their hand."
    );
    // Assert
    expect(act).toStrictEqual("into their hand");
    expect(cards).toStrictEqual(["Copper", "Estate"]);
    expect(numberOfCards).toStrictEqual([0, 1]);
    expect(deck.logArchive).toStrictEqual([
      "pNick plays a Hunter.",
      "pNick gest +1 Action.",
      "pNick reveals a Copper and 2 Estates.",
    ]);
  });

  it("should get Overgrown Estate from lines properly", () => {
    // Arrange

    // Act
    const { act, cards, numberOfCards } = deck.getActCardsAndCounts(
      "pNick draws an Overgrown Estate."
    );
    // Assert
    expect(act).toStrictEqual("draws");
    expect(cards).toStrictEqual(["Overgrown Estate"]);
    expect(numberOfCards).toStrictEqual([1]);
  });

  it("should handle consecutive 'in hand' lines correctly", () => {
    // Arrange
    deck.logArchive = [
      "pNick starts their turn.",
      "pNick puts a Hovel, and an Overgrown Estate in hand (Haven).",
    ];
    deck.lastEntryProcessed =
      "pNick puts a Hovel, and an Overgrown Estate in hand (Haven).";

    // Act
    const { act, cards, numberOfCards } = deck.getActCardsAndCounts(
      "G puts a Copper, a Hovel, and an Overgrown Estate in hand (Haven)."
    );
    // Assert
    expect(act).toStrictEqual("in hand");
    expect(cards).toStrictEqual(["Copper", "Hovel", "Overgrown Estate"]);
    expect(numberOfCards).toStrictEqual([1, 0, 0]);
    expect(deck.logArchive).toStrictEqual(["pNick starts their turn."]);
  });

  it("should get Overgrown Estate from lines properly", () => {
    // Arrange

    // Act
    const { act, cards, numberOfCards } = deck.getActCardsAndCounts(
      "pNick draws an Overgrown Estate."
    );
    // Assert
    expect(act).toStrictEqual("draws");
    expect(cards).toStrictEqual(["Overgrown Estate"]);
    expect(numberOfCards).toStrictEqual([1]);
  });
});
