import { beforeEach, describe, expect, it } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("processAsideWithLine", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });

  it("should move the given cards in the given amounts from hand to durationSetAside when caused by a Grotto", () => {
    // Arrange
    deck.hand = ["Estate", "Copper", "Estate", "Estate", "Vassal"];
    const cards = ["Estate", "Copper"];
    const numberOfCards = [3, 1];
    // Act
    deck.processAsideWithLine(cards, numberOfCards);
    // Assert
    expect(deck.durationSetAside).toStrictEqual([
      "Estate",
      "Estate",
      "Estate",
      "Copper",
    ]);
    expect(deck.hand).toStrictEqual(["Vassal"]);
  });
});
