import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { Duration } from "../../../src/model/duration";
describe("cleanup", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should remove all members from the hand and inPlay field arrays, and add them to the graveyard field array", () => {
    // Arrange
    deck.graveyard = ["Copper"];
    deck.inPlay = ["Copper", "Laboratory", "Bandit"];
    deck.hand = ["Estate", "Duchy", "Remodel"];
    // Act
    deck.cleanup();
    // Assert - Verify cards were moved from inPlay and hand to graveyard.
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
  });

  it("should not remove active durations from inPlay, but age them", () => {
    // Arrange
    deck.graveyard = ["Copper"];
    deck.inPlay = ["Copper", "Laboratory", "Bandit", "Rope"];
    deck.hand = ["Estate", "Duchy", "Remodel"];
    deck.activeDurations = [new Duration("Rope")];
    // Act
    deck.cleanup();
    // Verify Rope duration is still in play after cleanup
    expect(deck.inPlay).toStrictEqual(["Rope"]);
    // Assert - Verify cards were moved from inPlay and hand to graveyard.
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
    // Verify the activeDurations field still contains the correct living duration.
    expect(deck.activeDurations).toStrictEqual([
      new Duration("Rope", { age: 0 }),
    ]);
  });

  it(
    "should not remove active durations from inPlay, but should remove durations with age 0 from inPlay " +
      "and age any remaining durations",
    () => {
      // Arrange
      deck.graveyard = ["Copper"];
      deck.inPlay = ["Copper", "Laboratory", "Bandit", "Rope", "Rope", "Rope"];
      deck.hand = ["Estate", "Duchy", "Remodel"];
      deck.activeDurations = [
        new Duration("Rope"),
        new Duration("Rope"),
        new Duration("Rope", { age: 0 }),
      ];
      // Act
      deck.cleanup();
      // Verify Rope duration is still in play after cleanup
      expect(deck.inPlay).toStrictEqual(["Rope", "Rope"]);
      // Assert - Verify cards were moved from inPlay and hand to graveyard.
      expect(deck.graveyard).toStrictEqual([
        "Copper",
        "Rope",
        "Bandit",
        "Laboratory",
        "Copper",
        "Remodel",
        "Duchy",
        "Estate",
      ]);
      expect(deck.hand).toStrictEqual([]);
      // Verify the activeDurations field still contains the correct living duration.
      expect(deck.activeDurations).toStrictEqual([
        new Duration("Rope", { age: 0 }),
        new Duration("Rope", { age: 0 }),
      ]);
    }
  );

  it("For each activeDuration with age > 0 that has a Throne Room source, a Throne room should be left in play after cleanup", () => {
    // Arrange
    deck.graveyard = ["Copper"];
    deck.inPlay = [
      "Copper",
      "Laboratory",
      "Bandit",
      "Rope",
      "Rope",
      "Rope",
      "Rope",
      "Throne Room", // These two Throne Rooms both played Durations with lifespan 1, and should be in play after cleanup
      "Throne Room",
    ];
    deck.hand = ["Estate", "Duchy", "Remodel"];
    deck.activeDurations = [
      new Duration("Rope"),
      new Duration("Throne Room", { age: 1 }),
      new Duration("Throne Room", { age: 1 }),
      new Duration("Rope", { playSource: "Throne Room" }),
      new Duration("Rope", { playSource: "Throne Room" }),
      new Duration("Rope", { age: 0 }),
    ];
    // Act
    deck.cleanup();
    // Verify Rope duration is still in play after cleanup
    expect(deck.inPlay).toStrictEqual([
      "Rope",
      "Throne Room",
      "Throne Room",
      "Rope",
      "Rope",
    ]);
    // Assert - Verify cards were moved from inPlay and hand to graveyard.
    expect(deck.graveyard).toStrictEqual([
      "Copper",
      "Rope",
      "Bandit",
      "Laboratory",
      "Copper",
      "Remodel",
      "Duchy",
      "Estate",
    ]);
    expect(deck.hand).toStrictEqual([]);
    // Verify the activeDurations field still contains the correct living duration.
    expect(deck.activeDurations).toStrictEqual([
      new Duration("Rope", { age: 0 }),
      new Duration("Throne Room", { age: 0 }),
      new Duration("Throne Room", { age: 0 }),
      new Duration("Rope", { age: 0, playSource: "Throne Room" }),
      new Duration("Rope", { age: 0, playSource: "Throne Room" }),

    ]);
  });
});
