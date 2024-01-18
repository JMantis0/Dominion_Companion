/**
 * @jest-environment jsdom
 */
import { beforeEach, describe, it, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { Duration } from "../../../src/model/duration";

describe("assignBargeLifespanIfNeeded", () => {
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
    deck.waitToAssignBargeLifespan = true;
  });

  it("should assign lifespan 1 to last Duration in activeDurations if lastEntryProcessed plays a Barge that didn't draw this turn.", () => {
    //Case 1 - Lifespan 1
    // Arrange
    document.body.innerHTML =
      "<div class='log-scroll-container'>" +
      "<div class='log-line' id='previous'>P plays a Barge.<div>" +
      "<div class='log-line' id='current'>P plays 3 Coppers and a Silver. (+$5)<div>" +
      "</div>";
    deck.logArchive = ["P plays a Barge."];
    deck.activeDurations = [new Duration("Barge")];
    deck.lastEntryProcessed = "P plays a Barge.";
    // Assign paddingLeft as they would appear in an actual client game-log
    const prevEl = document.getElementById("previous");
    if (prevEl !== null) {
      prevEl.style.paddingLeft = "0%";
    }
    const currEl = document.getElementById("current");
    if (currEl !== null) {
      currEl.style.paddingLeft = "0%";
    }
    // Act
    deck.assignBargeLifespanIfNeeded("plays");
    // Assert - Verify the duration lifespan was set to 1 and waitToAssignBargeLifespan was set to false.
    expect(deck.activeDurations[0].age).toBe(1);
    expect(deck.waitToAssignBargeLifespan).toBe(false);
  });

  it("should assign lifespan 0 to last Duration in activeDurations if lastEntryProcessed plays a Barge that drew this turn.", () => {
    //Case 2 - Lifespan 0
    // Arrange
    document.body.innerHTML =
      "<div class='log-scroll-container'>" +
      "<div class='log-line' id='previous'>P plays a Barge.<div>" +
      "<div class='log-line' id='current'>P draws a Copper, a Silver, and a Capital City.<div>" +
      "</div>";
    deck.logArchive = ["P plays a Barge."];
    deck.activeDurations = [new Duration("Barge")];
    deck.lastEntryProcessed = "P plays a Barge.";
    // Assign paddingLeft as they would appear in an actual client game-log
    const prevEl = document.getElementById("previous");
    if (prevEl !== null) {
      prevEl.style.paddingLeft = "0%";
    }
    const currEl = document.getElementById("current");
    if (currEl !== null) {
      currEl.style.paddingLeft = "4%";
    }
    // Act
    deck.assignBargeLifespanIfNeeded("draws");
    // Assert - Verify the duration lifespan was set to 0 and waitToAssignBargeLifespan was set to false.
    expect(deck.activeDurations[0].age).toBe(0);
    expect(deck.waitToAssignBargeLifespan).toBe(false);
  });

  it(
    "should assign lifespan 0 to last Duration in activeDurations if lastEntryProcessed plays a Barge that drew this turn, " +
      "with the last entryProcessed being a shuffle",
    () => {
      //Case 3 - Lifespan 0
      // Arrange
      document.body.innerHTML =
        "<div class='log-scroll-container'>" +
        "<div class='log-line' id='previous'>P plays a Barge<div>" +
        "<div class='log-line' id='current'>P shuffles their deck.<div>" +
        "</div>";
      deck.logArchive = ["P plays a Barge."];
      deck.activeDurations = [new Duration("Barge")];
      deck.lastEntryProcessed = "P plays a Barge.";
      // Assign paddingLeft as they would appear in an actual client game-log
      const prevEl = document.getElementById("previous");
      if (prevEl !== null) {
        prevEl.style.paddingLeft = "0%";
      }
      const currEl = document.getElementById("current");
      if (currEl !== null) {
        currEl.style.paddingLeft = "4%";
      }
      // Act
      deck.assignBargeLifespanIfNeeded("shuffles their deck");
      // Assert - Verify the duration lifespan was set to 0 and waitToAssignBargeLifespan was set to false.
      expect(deck.activeDurations[0].age).toBe(0);
      expect(deck.waitToAssignBargeLifespan).toBe(false);
    }
  );
  it(
    "if the Barge duration age is already set to 1, do not assign a new age. " +
      "with the last entryProcessed being a shuffle",
    () => {
      //Case 4 - Lifespan 1
      // Arrange
      document.body.innerHTML =
        "<div class='log-scroll-container'>" +
        "<div class='log-line' id='previous'>P plays a Barge<div>" +
        "<div class='log-line' id='current'>P shuffles their deck.<div>" +
        "</div>";
      deck.logArchive = ["P plays a Barge."];
      deck.activeDurations = [new Duration("Barge", { age: 1 })];
      deck.lastEntryProcessed = "P plays a Barge.";
      // Assign paddingLeft as they would appear in an actual client game-log
      const prevEl = document.getElementById("previous");
      if (prevEl !== null) {
        prevEl.style.paddingLeft = "0%";
      }
      const currEl = document.getElementById("current");
      if (currEl !== null) {
        currEl.style.paddingLeft = "4%";
      }
      // Act
      deck.assignBargeLifespanIfNeeded("shuffles their deck");
      // Assert - Verify the duration lifespan not set to 0 and waitToAssignBargeLifespan was set to false.
      expect(deck.activeDurations[0].age).toBe(1);
      expect(deck.waitToAssignBargeLifespan).toBe(false);
    }
  );

  it("should, if the Barge's play source is a Duration, set the play sources' lifespan correctly", () => {
    // Case 5
    // Arrange
    document.body.innerHTML =
      "<div class='log-scroll-container'>" +
      "<div class='log-line' id='previous'>P plays a Barge.<div>" +
      "<div class='log-line' id='current'>P plays 3 Coppers and a Silver. (+$5)<div>" +
      "</div>";
    deck.logArchive = ["P plays a Barge."];
    deck.activeDurations = [new Duration("Barge")];
    deck.lastEntryProcessed = "P plays a Barge.";
    // Assign paddingLeft as they would appear in an actual client game-log
    const prevEl = document.getElementById("previous");
    if (prevEl !== null) {
      prevEl.style.paddingLeft = "0%";
    }
    const currEl = document.getElementById("current");
    if (currEl !== null) {
      currEl.style.paddingLeft = "0%";
    }
    // Create a Barge with a Mastermind playSource of age 0.
    const bargePlaySource = new Duration("Mastermind", { age: 0 });
    const barge = new Duration("Barge", {
      playSource: bargePlaySource,
    });

    deck.activeDurations = [barge];
    deck.waitToAssignBargeLifespan = true;
    // Act
    deck.assignBargeLifespanIfNeeded("plays");
    // Assert - Verify the bargePlaySource lifeSpan is set
    expect(barge.age).toBe(1);
    expect(bargePlaySource.age).toBe(1);
  });
});
