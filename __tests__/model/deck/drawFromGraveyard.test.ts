import { beforeEach, describe, expect, it } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("drawFromGraveyard", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });
  it("should remove one instance of the given card from graveyard and add one instance to hand", () => {
    // Arrange
    deck.graveyard = ["Copper", "Estate", "Fortune Hunter"];
    deck.hand = ["Bureaucrat"];

    // Act
    deck.drawFromGraveyard("Fortune Hunter");

    // Assert
    expect(deck.graveyard).toStrictEqual(["Copper", "Estate"]);
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Fortune Hunter"]);
  });
  it("should throw an error if the given card is not in the graveyard", () => {
    // Arrange
    deck.graveyard = ["Copper", "Estate", "Fortune Hunter"];

    // Act and Assert
    expect(() => deck.drawFromGraveyard("Fool's Gold")).toThrowError(
      "No Fool's Gold in discard."
    );
  });
});
