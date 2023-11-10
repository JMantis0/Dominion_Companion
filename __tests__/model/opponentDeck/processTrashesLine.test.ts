import { describe, it, expect,  beforeEach } from "@jest/globals";
import { OpponentDeck } from "../../../src/model/opponentDeck";

describe("processTrashesLine", () => {
  // Declare OpponentDeck reference.
  let deck: OpponentDeck;

  beforeEach(() => {
    deck = new OpponentDeck("", false, "", "oName", "oNick", []);
  });

  it("should correctly add the given cards to trash and remove them from the entireDeck", () => {
    // Arrange sample trash and entireDeck zones
    deck.trash = ["Copper"];
    deck.entireDeck = ["Copper", "Copper", "Estate", "Estate", "Market"];
    // Act - Simulate opponent trashing 4 cards with a Chapel
    deck.processTrashesLine(["Copper", "Estate"], [2, 2]);
    expect(deck.trash).toStrictEqual([
      "Copper",
      "Copper",
      "Copper",
      "Estate",
      "Estate",
    ]);
    expect(deck.entireDeck).toStrictEqual(["Market"]);
  });
});
