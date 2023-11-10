import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { OpponentDeck } from "../../../src/model/opponentDeck";

describe("processGainsLine", () => {
  // Declare OpponentDeck reference
  let deck: OpponentDeck;

  beforeEach(() => {
    deck = new OpponentDeck("", false, "", "oName", "oNick", []);
    jest.clearAllMocks();
  });

  // 2 Cases
  // 1) The most recent logArchive line is not a 'buy without gain' for the card being bought on the given line.
  //  No change to the logArchive
  // 2)- The most recent logArchive entry is a 'buy without gain' of the card being bought on the given line.
  //  The last logArchive entry should be removed

  it(
    "should add cards gained by any means to the entireDeck.  If the previous line is not " +
      "a 'buy without gain' line, logArchive should not be altered.",
    () => {
      // Arrange
      deck.logArchive = ["Turn 3 - pName", "pNick plays a Gold. (+$3)"];
      const cards = ["Silver"];
      const numberOfCards = [1];
      const line = "pNick buys and gains a Silver.";

      // Mock a mid turn game board.

      deck.entireDeck = ["Copper", "Gold"];
      // Act
      deck.processGainsLine(line, cards, numberOfCards);
      // Assert - Verify the card is added to entireDeck and logArchive is unchanged
      expect(deck.entireDeck).toStrictEqual(["Copper", "Gold", "Silver"]);
      expect(deck.logArchive).toStrictEqual([
        "Turn 3 - pName",
        "pNick plays a Gold. (+$3)",
      ]);
    }
  );

  it("should handle gaining a card was bought but not gained yet correctly, by removing an entry from the logArchive", () => {
    // Arrange
    deck.logArchive = ["pNick plays a Gold. (+$3)", "pNick buys a Silver."];
    deck.lastEntryProcessed = "pNick buys a Silver.";
    const cards = ["Silver"];
    const numberOfCards = [1];
    const line = "pNick buys and gains a Silver.";

    // Mock a mid turn game board.
    deck.entireDeck = ["Copper", "Gold"];

    // Act - Simulate opponent buying 2 Laboratories
    deck.processGainsLine(line, cards, numberOfCards);

    // Assert - Verify the card was added to the entireDeck, and the 'buy without gain' line was removed from logArchive
    expect(deck.entireDeck).toStrictEqual(["Copper", "Gold", "Silver"]);
    expect(deck.logArchive).toStrictEqual(["pNick plays a Gold. (+$3)"]);
  });
});
