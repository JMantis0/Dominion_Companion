import { beforeEach, describe, expect, it } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("masterMindEffectHandler", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });
  it("should increment the masterMindEffectCounter if masterMindEffectCounter is less than 3", () => {
    // Arrange
    deck.hand = ["Artisan"];
    // Act
    deck.masterMindEffectHandler(deck, "Artisan");
    // Assert
    expect(deck.masterMindEffectCount).toBe(1);
  });
  it("should play the given card if masterMindEffectCounter is 0", () => {
    // Arrange
    deck.hand = ["Artisan"];
    // Act
    deck.masterMindEffectHandler(deck, "Artisan");
    // Assert
    expect(deck.inPlay).toStrictEqual(["Artisan"]);
    expect(deck.hand).toStrictEqual([]);
  });
  it("should set masterMindEffectCounter to 0 if masterMindEffectCounter is 2", () => {
    // Arrange
    deck.hand = [];
    deck.masterMindEffectCount = 2;
    // Act
    deck.masterMindEffectHandler(deck, "Artisan");
    // Assert
    expect(deck.masterMindEffectCount).toBe(0);
  });
});
