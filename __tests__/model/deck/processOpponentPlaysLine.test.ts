import { it, expect, beforeEach, describe, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("processOpponentPlaysLine", () => {
  let deck: Deck;
  const checkForNonHandPlay = jest.spyOn(Deck.prototype, "checkForNonHandPlay");
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });
  it("should set the latestPlaySource", () => {
    // Arrange
    deck.latestPlaySource = "Hand";
    checkForNonHandPlay.mockReturnValue("Fortune Hunter");
    // Act
    deck.processOpponentPlaysLine();
    // Assert
    expect(deck.latestPlaySource).toBe("Fortune Hunter");
  });
});
