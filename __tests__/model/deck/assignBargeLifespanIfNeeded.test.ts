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
  });

  it("should assign lifespan 1 to last Duration in activeDurations if lastEntryProcessed plays a Barge that didn't draw this turn.", () => {
    //Case 1 - Lifespan 1
    // Arrange
    document.body.innerHTML =
      "<div class='log-scroll-container'>" +
      "<div class='log-line' id='previous'>P plays a Barge<div>" +
      "<div class='log-line' id='current'>P plays 3 Coppers and a Silver. (+$5)<div>" +
      "</div>";
    deck.activeDurations = [new Duration("Barge", 10)];
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
      "<div class='log-line' id='previous'>P plays a Barge<div>" +
      "<div class='log-line' id='current'>G draws a Copper, a Silver, and a Capital City<div>" +
      "</div>";
    deck.activeDurations = [new Duration("Barge", 10)];
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
      //Case 2 - Lifespan 0
      // Arrange
      document.body.innerHTML =
        "<div class='log-scroll-container'>" +
        "<div class='log-line' id='previous'>P plays a Barge<div>" +
        "<div class='log-line' id='current'>G shuffles their deck.<div>" +
        "</div>";
      deck.activeDurations = [new Duration("Barge", 10)];
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
});
