import { beforeEach, describe, it, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { Duration } from "../../../src/model/duration";

describe("ageAllActiveDurations", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should decrease the age of all living durations by 1", () => {
    // Arrange - set up activeDurations field with durations of various ages.
    deck.activeDurations = [
      new Duration("Rope"),
      new Duration("Rope", 2),
      new Duration("Rope", 3),
    ];

    // Act - age all active durations.
    deck.ageAllActiveDurations();

    // Assert - Verify all the activeDurations age decreased by 1
    expect(deck.activeDurations).toStrictEqual([
      new Duration("Rope", 0),
      new Duration("Rope", 1),
      new Duration("Rope", 2),
    ]);
  });
  
  it("should throw an error if a duration has an undefined age", () => {
    // Arrange - set up activeDurations field with durations of various ages.
    deck.activeDurations = [
      new Duration("Rope"),
      new Duration("Rope", 2),
      new Duration("Rope", 3),
    ];
    deck.activeDurations[0].setAge(undefined);

    // Act and Assert - verify an error is thrown when a duration has an undefined age
    expect(() => deck.ageAllActiveDurations()).toThrowError(
      "Duration age is undefined."
    );
  });
});
