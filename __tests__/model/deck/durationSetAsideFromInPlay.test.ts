import { beforeEach, describe, expect, it } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("durationSetAsideFromInPlay", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });

  it("should move the given card from library to durationSetAside", () => {
    // Arrange
    deck.inPlay = ["Research", "Royal Galley", "Secret Passage"];
    deck.durationSetAside = [];
    // Act
    deck.durationSetAsideFromInPlay("Secret Passage");

    // Assert - Verify Royal Galley was removed from library and added to durationSetAside
    expect(deck.inPlay).toStrictEqual(["Research", "Royal Galley"]);
    expect(deck.durationSetAside).toStrictEqual(["Secret Passage"]);
  });
});
