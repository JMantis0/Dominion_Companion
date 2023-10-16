import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function checkForCleanup()", () => {
  it("should return true when a cleanup might be needed", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const line1 = `${deck.getPlayerNick} draws a Sentry, a Copper, an Estate, a Vassal, and a Gold.`;
    const line2 = `${deck.getPlayerNick} draws a Sentry, a Copper, an Estate, and 2 Golds.`;
    const line3 = `${deck.getPlayerNick} draws a Sentry, a Copper, and 3 Festivals.`;
    const line4 = `${deck.getPlayerNick} draws a Sentry and 4 Libraries`;
    const line5 = `${deck.getPlayerNick} draws 5 Libraries.`;
    const line6 = `${deck.getPlayerNick} draws 4 Libraries and a Sentry.`;
    const line7 = `${deck.getPlayerNick} draws 3 Libraries, a Sentry, and an Estate.`;
    const line8 = `${deck.getPlayerNick} draws 2 Libraries, a Sentry, an Estate, and a Vassal.`;
    const line9 = `${deck.getPlayerNick} draws a Copper, a Sentry, an Estate, a Vassal, and a Gold.`;
    const line10 = `${deck.getPlayerNick} draws 5 Festivals.`;

    // Act
    const result1 = deck.checkForCleanUp(line1);
    const result2 = deck.checkForCleanUp(line2);
    const result3 = deck.checkForCleanUp(line3);
    const result4 = deck.checkForCleanUp(line4);
    const result5 = deck.checkForCleanUp(line5);
    const result6 = deck.checkForCleanUp(line6);
    const result7 = deck.checkForCleanUp(line7);
    const result8 = deck.checkForCleanUp(line8);
    const result9 = deck.checkForCleanUp(line9);
    const result10 = deck.checkForCleanUp(line10);

    // Assert
    expect(result1).toBeTruthy();
    expect(result2).toBeTruthy();
    expect(result3).toBeTruthy();
    expect(result4).toBeTruthy();
    expect(result5).toBeTruthy();
    expect(result6).toBeTruthy();
    expect(result7).toBeTruthy();
    expect(result8).toBeTruthy();
    expect(result9).toBeTruthy();
    expect(result10).toBeTruthy();
  });

  it("should return false when a cleanup is not needed", () => {
    //Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const line1 = "rNick draws a Sentry."; // 1 draw
    const line2 = "rNick draws a Sentry and a Vassal."; // 2 draws
    const line3 = "rNick draws a Sentry, a Duchy, and a Vassal."; // 3 draws
    const line4 = "rNick draws a Sentry, a Duchy, a Festival, and a Vassal."; // 4 draws
    const line5 = "rNick draws 5 Witches ,a Vassal."; // 6 draws
    const line6 = "rNick draws 4 Witches  a Sentry, and a Vassal."; // 6 draws
    const line7 = "rNick draws 3 Witches ,a Sentry, a Merchant, and a Vassal."; // 6 draws
    const line8 =
      "rNick draws 2 Witches ,a Sentry, a Merchant, a Curse, and a Vassal."; // 6 draws
    const line9 =
      "rNick draws a Duchy, a Cellar, a Merchant, a Curse, a Gold, and a Vassal."; // 6 Draws
    const line10 = "rNick draws a Curse and a Vassal."; // 2 draws

    // Act
    const result1 = deck.checkForCleanUp(line1);
    const result2 = deck.checkForCleanUp(line2);
    const result3 = deck.checkForCleanUp(line3);
    const result4 = deck.checkForCleanUp(line4);
    const result5 = deck.checkForCleanUp(line5);
    const result6 = deck.checkForCleanUp(line6);
    const result7 = deck.checkForCleanUp(line7);
    const result8 = deck.checkForCleanUp(line8);
    const result9 = deck.checkForCleanUp(line9);
    const result10 = deck.checkForCleanUp(line10);

    // Assert
    expect(result1).toBeFalsy();
    expect(result2).toBeFalsy();
    expect(result3).toBeFalsy();
    expect(result4).toBeFalsy();
    expect(result5).toBeFalsy();
    expect(result6).toBeFalsy();
    expect(result7).toBeFalsy();
    expect(result8).toBeFalsy();
    expect(result9).toBeFalsy();
    expect(result10).toBeFalsy();
  });
  
  // Case where entire deck is less than 5 cards.
  it("should work correctly when where are less than 5 cards in the entire deck", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    deck.setEntireDeck(["Copper", "Copper", "Estate"]);
    const line1 = "rNick draws 2 Coppers and an Estate";
    const line2 = "rNick draws 2 Coppers";

    // Act
    const result1 = deck.checkForCleanUp(line1);
    const result2 = deck.checkForCleanUp(line2);

    // Assert
    expect(result1).toBeTruthy();
    expect(result2).toBeFalsy();
  });
});
