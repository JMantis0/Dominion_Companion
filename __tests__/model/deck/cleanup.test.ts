import { it, describe, expect, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
describe("Function cleanup()", () => {
  // Instantiate Deck object
  const deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on function dependencies
  const setGraveyard = jest.spyOn(Deck.prototype, "setGraveyard");
  const setInPlay = jest.spyOn(Deck.prototype, "setInPlay");
  const setHand = jest.spyOn(Deck.prototype, "setHand");
  it("should remove all members from the hand and inPlay field arrays, and add them to the graveyard field array", () => {
    // Arrange
    deck.graveyard = ["Copper"];
    deck.inPlay = ["Copper", "Laboratory", "Bandit"];
    deck.hand = ["Estate", "Duchy", "Remodel"];
    // Act
    deck.cleanup();
    // Assert
    expect(deck.graveyard).toStrictEqual([
      "Copper",
      "Bandit",
      "Laboratory",
      "Copper",
      "Remodel",
      "Duchy",
      "Estate",
    ]);
    expect(deck.hand).toStrictEqual([]);
    expect(deck.inPlay).toStrictEqual([]);
    expect(setHand).toBeCalledTimes(1);
    expect(setHand).toBeCalledWith([]);
    expect(setInPlay).toBeCalledTimes(1);
    expect(setInPlay).toBeCalledWith([]);
    expect(setGraveyard).toBeCalledTimes(1);
    expect(setGraveyard).toBeCalledWith([
      "Copper",
      "Bandit",
      "Laboratory",
      "Copper",
      "Remodel",
      "Duchy",
      "Estate",
    ]);
  });
});
