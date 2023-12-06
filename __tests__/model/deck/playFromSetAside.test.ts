import { beforeEach, describe, expect, it } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("playFromSetAside", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });
  it("should remove one instance of the given card from setAside and add it to inPlay", () => {
    // Arrange
    deck.setAside = ["Chapel", "Copper", "Estate"];
    deck.inPlay = ["Fortune Hunter"];
    // Act
    deck.playFromSetAside("Copper");
    // Assert
    expect(deck.setAside).toStrictEqual(["Chapel", "Estate"]);
    expect(deck.inPlay).toStrictEqual(["Fortune Hunter", "Copper"]);
  });
});
