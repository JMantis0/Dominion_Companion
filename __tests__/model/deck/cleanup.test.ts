import { it, describe, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
describe("Function cleanup()", () => {
  it("should remove all members from the hand and inPlay field arrays, and add them to the graveyard field array", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const graveyard = ["Copper"];
    const hand = ["Estate", "Duchy", "Remodel"];
    const inPlay = ["Copper", "Laboratory", "Bandit"];
    deck.setGraveyard(graveyard);
    deck.setHand(hand);
    deck.setInPlay(inPlay);

    // Act
    deck.cleanup();
    const result1 = deck.getGraveyard();
    const result2 = deck.getInPlay();
    const result3 = deck.getHand();

    // Assert
    expect(result1).toStrictEqual(graveyard.concat(hand.concat(inPlay)));
    expect(result2).toStrictEqual([]);
    expect(result3).toStrictEqual([]);
  });
});
