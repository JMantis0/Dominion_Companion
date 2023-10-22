import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { OpponentDeck } from "../../../src/model/opponentDeck";

describe("Function processTrashesLine", () => {
  let deck = new OpponentDeck("", false, "", "oName", "oNick", []);
  // Mock function dependencies
  const setTrash = jest.spyOn(OpponentDeck.prototype, "setTrash");
  const removeCardFromEntireDeck = jest.spyOn(
    OpponentDeck.prototype,
    "removeCardFromEntireDeck"
  );
  afterEach(() => {
    jest.clearAllMocks();
    deck = new OpponentDeck("", false, "", "oName", "oNick", []);
  });
  it("should correctly add the given cards to trash and remove them from the entireDeck", () => {
    // Arrange sample trash and entireDeck zones
    deck.trash = ["Copper"];
    deck.entireDeck = ["Copper", "Copper", "Estate", "Estate", "Moneylender"];
    // Act - Simulate opponent trashing 4 cards with a Chapel
    deck.processTrashesLine(["Copper", "Estate", "Moneylender"], [1, 2, 1]);
    expect(setTrash).toBeCalledTimes(4);
    expect(setTrash).nthCalledWith(1, ["Copper", "Copper"]);
    expect(setTrash).nthCalledWith(2, ["Copper", "Copper", "Estate"]);
    expect(setTrash).nthCalledWith(3, ["Copper", "Copper", "Estate", "Estate"]);
    expect(setTrash).nthCalledWith(4, [
      "Copper",
      "Copper",
      "Estate",
      "Estate",
      "Moneylender",
    ]);
    expect(removeCardFromEntireDeck).toBeCalledTimes(4);
    expect(removeCardFromEntireDeck).nthCalledWith(1, "Copper");
    expect(removeCardFromEntireDeck).nthCalledWith(2, "Estate");
    expect(removeCardFromEntireDeck).nthCalledWith(3, "Estate");
    expect(removeCardFromEntireDeck).nthCalledWith(4, "Moneylender");
  });
});
