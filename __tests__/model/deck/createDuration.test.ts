import { describe, it, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { Duration } from "../../../src/model/duration";

describe("createDuration", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });

  it("should create a Duration object and add it to the activeDurations field", () => {
    // Arrange
    const line = "P plays a Barge.";
    const card = "Barge";
    const source = "Throne Room";
    // Act
    deck.createDuration(line, card, source);
    // Assert - Verify the duration was created.
    expect(deck.activeDurations).toStrictEqual([
      new Duration(card, { playSource: "Throne Room" }),
    ]);
  });

  it("should not create a Duration object if the card is being played again as an effect", () => {
    // Arrange
    const line = "P plays a Barge again.";
    const card = "Barge";
    // Act
    deck.createDuration(line, card);
    // Assert - Verify a duration was not created.
    expect(deck.activeDurations).toStrictEqual([]);
  });

  it(
    "should not set the playSource as a Throne Room, if the Throne Room is being played again by " +
      "another Throne Room",
    () => {
      // Arrange
      deck.lastEntryProcessed = "P plays a Throne Room again.";
      const line = "P plays a Barge.";
      const card = "Barge";
      // Act
      deck.createDuration(line, card);
      // Assert - Verify a duration was not created.
      expect(deck.activeDurations).toStrictEqual([new Duration("Barge")]);
    }
  );
});
