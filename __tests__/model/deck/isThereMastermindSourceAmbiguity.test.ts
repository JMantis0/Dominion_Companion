import { beforeEach, describe, expect, it } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { Duration } from "../../../src/model/duration";

describe("isThereMastermindSourceAmbiguity", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });
  it("should return true if there are multiple active masterMind durations with different playSources", () => {
    //Arrange populate an activeDurations field with Mastermind durations with multiple sources.
    deck.activeDurations = [
      new Duration("Mastermind", { playSource: "Throne Room" }),
      new Duration("Mastermind", { playSource: "None" }),
      new Duration("Mastermind", { playSource: "Mastermind" }),
    ];
    // Assert
    expect(deck.isThereMastermindSourceAmbiguity()).toBe(true);
    // Arrange 2
    deck.activeDurations = [
      new Duration("Mastermind", { playSource: "None" }),
      new Duration("Mastermind", { playSource: "Mastermind" }),
    ];
    // Assert 2
    expect(deck.isThereMastermindSourceAmbiguity()).toBe(true);
    // Arrange 3
    deck.activeDurations = [
      new Duration("Mastermind", { playSource: "Throne Room" }),
      new Duration("Mastermind", { playSource: "Mastermind" }),
    ];
    // Assert 3
    expect(deck.isThereMastermindSourceAmbiguity()).toBe(true);
    // Arrange 4
    deck.activeDurations = [
      new Duration("Mastermind", { playSource: "Throne Room" }),
      new Duration("Mastermind", { playSource: "None" }),
    ];
    // Assert 4
    expect(deck.isThereMastermindSourceAmbiguity()).toBe(true);
  });
  it("should return false if there are not Mastermind durations with different playSources in the activeDurations field", () => {
    // Arrange - populate an activeDurations field with Mastermind duration having the same playSources.
    deck.activeDurations = [
      new Duration("Mastermind", { playSource: "None" }),
      new Duration("Mastermind", { playSource: "None" }),
      new Duration("Mastermind", { playSource: new Duration("Mastermind") }),
    ];
    // Assert
    expect(deck.isThereMastermindSourceAmbiguity()).toBe(false);
    // Arrange 2
    deck.activeDurations = [
      new Duration("Mastermind", { playSource: "Mastermind" }),
      new Duration("Mastermind", { playSource: "Mastermind" }),
    ];
    // Assert 2
    expect(deck.isThereMastermindSourceAmbiguity()).toBe(false);
    // Arrange 3
    deck.activeDurations = [
      new Duration("Mastermind", { playSource: "Throne Room" }),
      new Duration("Mastermind", { playSource: "Throne Room" }),
    ];
    // Assert 3
    expect(deck.isThereMastermindSourceAmbiguity()).toBe(false);
    // Arrange 4
    deck.activeDurations = [new Duration("Mastermind", { playSource: "None" })];
    // Assert 4
    expect(deck.isThereMastermindSourceAmbiguity()).toBe(false);
  });
});
