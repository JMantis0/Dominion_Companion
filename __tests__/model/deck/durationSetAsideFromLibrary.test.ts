import { beforeEach, describe, expect, it } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("durationSetAsideFromLibrary", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });

  it("should move the given card from library to durationSetAside", () => {
    // Arrange
    deck.library = ["Royal Galley", "Copper", "Estate"];
    deck.durationSetAside = [];
    // Act
    deck.durationSetAsideFromLibrary("Royal Galley");

    // Assert - Verify Royal Galley was removed from library and added to durationSetAside
    expect(deck.library).toStrictEqual(["Copper", "Estate"]);
    expect(deck.durationSetAside).toStrictEqual(["Royal Galley"]);
  });
});
