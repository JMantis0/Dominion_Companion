import { beforeEach, describe, expect, it } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("drawFromDurationSetAside", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });
  it("should remove one instance of the given card from durationSetAside and add one instance to hand", () => {
    // Arrange
    deck.durationSetAside = ["Copper", "Estate", "Fortune Hunter"];
    deck.hand = ["Bureaucrat"];

    // Act
    deck.drawFromDurationSetAside("Fortune Hunter");

    // Assert
    expect(deck.durationSetAside).toStrictEqual(["Copper", "Estate"]);
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Fortune Hunter"]);
  });

  it("should throw an error if the given card is not in the durationSetAside", () => {
    // Arrange
    deck.durationSetAside = ["Copper", "Estate", "Fortune Hunter"];

    // Act and Assert
    expect(() => deck.drawFromDurationSetAside("Fool's Gold")).toThrowError(
      "No Fool's Gold in durationSetAside."
    );
  });
});
