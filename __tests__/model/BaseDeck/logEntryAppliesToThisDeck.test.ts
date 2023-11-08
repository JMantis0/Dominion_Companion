import { it, describe, expect, beforeEach } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("logEntryAppliesToThisDeck", () => {
  // Declare BaseDeck reference.
  let deck: BaseDeck;

  beforeEach(() => {
    deck = new BaseDeck("", false, "", "pName", "pNick", []);
  });

  it("should return true when the line has a match for the playerName or playerNick", () => {
    // Act and Assert - Simulate check logs that apply to the deck.
    expect(deck.logEntryAppliesToThisDeck("pNick plays a Sentry.")).toBe(true);
    expect(deck.logEntryAppliesToThisDeck("Turn 3 - pName")).toBe(true);
  });

  it("should return false when the line does not match playerName or playerNick", () => {
    // Act and Assert - Simulate checking logs that do not apply to the deck.
    expect(deck.logEntryAppliesToThisDeck("oNick plays a Sentry.")).toBe(false);
    expect(deck.logEntryAppliesToThisDeck("Turn 3 - oName")).toBe(false);
  });
});
