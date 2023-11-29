import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("Function setDecksGameResults", () => {
  // Instantiate Deck and OpponentDeck objects
  let pd: Deck;
  let epd: Deck;
  let od1: OpponentDeck;
  let eod1: OpponentDeck;
  describe("when there is exactly one opponent", () => {
    beforeEach(() => {
      pd = new Deck("", false, "", "Player", "", []);
      epd = new Deck("", false, "", "Player", "", []);
      od1 = new OpponentDeck("", false, "", "Opponent 1", "", []);
      eod1 = new OpponentDeck("", false, "", "Opponent 1", "", []);
      jest.clearAllMocks();
    });
    it("should set the game result by the ranks in the given resultMap (player wins)", () => {
      // Arrange - A result map where the player won.
      const resultMap: Map<number, string[]> = new Map([
        [1, ["Player"]],
        [2, ["Opponent 1"]],
      ]);

      const decks = new Map<string, Deck | OpponentDeck>([
        ["Player", pd],
        ["Opponent 1", od1],
      ]);

      const updatedDecks = new Map<string, Deck | OpponentDeck>([
        ["Player", epd],
        ["Opponent 1", eod1],
      ]);
      updatedDecks.get("Player")!.gameResult = "1st Place";
      updatedDecks.get("Opponent 1")!.gameResult = "2nd Place";

      // Act and Assert - Simulate setting deck results where the player won.
      // Verify the correct decks are returned
      expect(decks).not.toStrictEqual(updatedDecks);
      expect(DOMObserver.setDecksGameResults(resultMap, decks)).toStrictEqual(
        updatedDecks
      );
    });

    it("should set the game result by the ranks in the given resultMap, (opponent wins)", () => {
      // Arrange - A result map where the opponent won.
      const resultMap: Map<number, string[]> = new Map([
        [1, ["Opponent 1"]],
        [2, ["Player"]],
      ]);
      const decks = new Map<string, Deck | OpponentDeck>([
        ["Player", pd],
        ["Opponent 1", od1],
      ]);

      const updatedDecks = new Map<string, Deck | OpponentDeck>([
        ["Player", epd],
        ["Opponent 1", eod1],
      ]);
      updatedDecks.get("Player")!.gameResult = "2nd Place";
      updatedDecks.get("Opponent 1")!.gameResult = "1st Place";

      // Act and Assert - Simulate setting deck results where the player won.
      // Verify the correct decks are returned
      expect(decks).not.toStrictEqual(updatedDecks);
      expect(DOMObserver.setDecksGameResults(resultMap, decks)).toStrictEqual(
        updatedDecks
      );
    });

    it("should set players that are tied in the same place", () => {
      // Arrange - A result map where the opponent won.
      const resultMap: Map<number, string[]> = new Map([
        [1, ["Opponent 1", "Player"]],
      ]);
      const decks = new Map<string, Deck | OpponentDeck>([
        ["Player", pd],
        ["Opponent 1", od1],
      ]);

      const updatedDecks = new Map<string, Deck | OpponentDeck>([
        ["Player", epd],
        ["Opponent 1", eod1],
      ]);

      updatedDecks.get("Player")!.gameResult = "1st Place";
      updatedDecks.get("Opponent 1")!.gameResult = "1st Place";

      // Act and Assert - Simulate setting deck results where the player won.
      // Verify the correct decks are returned
      expect(decks).not.toStrictEqual(updatedDecks);
      expect(DOMObserver.setDecksGameResults(resultMap, decks)).toStrictEqual(
        updatedDecks
      );
    });
  });

  describe("when there are multiple opponents", () => {
    let od2: OpponentDeck;
    let od3: OpponentDeck;
    let od4: OpponentDeck;
    let od5: OpponentDeck;
    let eod2: OpponentDeck;
    let eod3: OpponentDeck;
    let eod4: OpponentDeck;
    let eod5: OpponentDeck;
    beforeEach(() => {
      od2 = new OpponentDeck("", false, "", "Opponent 2", "", []);
      eod2 = new OpponentDeck("", false, "", "Opponent 2", "", []);
      od3 = new OpponentDeck("", false, "", "Opponent 3", "", []);
      eod3 = new OpponentDeck("", false, "", "Opponent 3", "", []);
      od4 = new OpponentDeck("", false, "", "Opponent 4", "", []);
      eod4 = new OpponentDeck("", false, "", "Opponent 4", "", []);
      od5 = new OpponentDeck("", false, "", "Opponent 5", "", []);
      eod5 = new OpponentDeck("", false, "", "Opponent 5", "", []);
      jest.clearAllMocks();
    });

    it("should set all players for First place if all players are tied.", () => {
      // Arrange - A result map where all players are tied.
      const resultMap: Map<number, string[]> = new Map([
        [
          1,
          [
            "Opponent 1",
            "Opponent 2",
            "Opponent 3",
            "Opponent 4",
            "Opponent 5",
            "Player",
          ],
        ],
      ]);
      const decks = new Map<string, Deck | OpponentDeck>([
        ["Player", pd],
        ["Opponent 1", od1],
        ["Opponent 2", od2],
        ["Opponent 3", od3],
        ["Opponent 4", od4],
        ["Opponent 5", od5],
      ]);

      const updatedDecks = new Map<string, Deck | OpponentDeck>([
        ["Player", epd],
        ["Opponent 1", eod1],
        ["Opponent 2", eod2],
        ["Opponent 3", eod3],
        ["Opponent 4", eod4],
        ["Opponent 5", eod5],
      ]);
      // Arranging the results on expected decks
      updatedDecks.get("Player")!.gameResult = "1st Place";
      updatedDecks.get("Opponent 1")!.gameResult = "1st Place";
      updatedDecks.get("Opponent 2")!.gameResult = "1st Place";
      updatedDecks.get("Opponent 3")!.gameResult = "1st Place";
      updatedDecks.get("Opponent 4")!.gameResult = "1st Place";
      updatedDecks.get("Opponent 5")!.gameResult = "1st Place";

      // Act and Assert - Verify the decks were updated correctly.
      expect(decks).not.toStrictEqual(updatedDecks);
      expect(DOMObserver.setDecksGameResults(resultMap, decks)).toStrictEqual(
        updatedDecks
      );
    });

    it("should set gameResults correctly when no players are tied", () => {
      // Arrange
      const resultMap: Map<number, string[]> = new Map([
        [1, ["Opponent 1"]],
        [2, ["Opponent 2"]],
        [3, ["Opponent 3"]],
        [4, ["Opponent 4"]],
        [5, ["Opponent 5"]],
        [6, ["Player"]],
      ]);
      const decks = new Map<string, Deck | OpponentDeck>([
        ["Player", pd],
        ["Opponent 1", od1],
        ["Opponent 2", od2],
        ["Opponent 3", od3],
        ["Opponent 4", od4],
        ["Opponent 5", od5],
      ]);

      const updatedDecks = new Map<string, Deck | OpponentDeck>([
        ["Player", epd],
        ["Opponent 1", eod1],
        ["Opponent 2", eod2],
        ["Opponent 3", eod3],
        ["Opponent 4", eod4],
        ["Opponent 5", eod5],
      ]);

      updatedDecks.get("Player")!.gameResult = "6th Place";
      updatedDecks.get("Opponent 1")!.gameResult = "1st Place";
      updatedDecks.get("Opponent 2")!.gameResult = "2nd Place";
      updatedDecks.get("Opponent 3")!.gameResult = "3rd Place";
      updatedDecks.get("Opponent 4")!.gameResult = "4th Place";
      updatedDecks.get("Opponent 5")!.gameResult = "5th Place";

      // Act and Assert
      expect(decks).not.toStrictEqual(updatedDecks);
      expect(DOMObserver.setDecksGameResults(resultMap, decks)).toStrictEqual(
        updatedDecks
      );
    });

    it("should set gameResults correctly when there are multiple ties", () => {
      // Arrange
      const resultMap: Map<number, string[]> = new Map([
        [1, ["Opponent 1"]],
        [2, ["Opponent 2", "Opponent 3"]],
        [4, ["Opponent 4"]],
        [5, ["Opponent 5", "Player"]],
      ]);
      const decks = new Map<string, Deck | OpponentDeck>([
        ["Player", pd],
        ["Opponent 1", od1],
        ["Opponent 2", od2],
        ["Opponent 3", od3],
        ["Opponent 4", od4],
        ["Opponent 5", od5],
      ]);

      const updatedDecks = new Map<string, Deck | OpponentDeck>([
        ["Player", epd],
        ["Opponent 1", eod1],
        ["Opponent 2", eod2],
        ["Opponent 3", eod3],
        ["Opponent 4", eod4],
        ["Opponent 5", eod5],
      ]);

      updatedDecks.get("Player")!.gameResult = "5th Place";
      updatedDecks.get("Opponent 1")!.gameResult = "1st Place";
      updatedDecks.get("Opponent 2")!.gameResult = "2nd Place";
      updatedDecks.get("Opponent 3")!.gameResult = "2nd Place";
      updatedDecks.get("Opponent 4")!.gameResult = "4th Place";
      updatedDecks.get("Opponent 5")!.gameResult = "5th Place";
      // Act and Assert
      expect(decks).not.toStrictEqual(updatedDecks);
      expect(DOMObserver.setDecksGameResults(resultMap, decks)).toStrictEqual(
        updatedDecks
      );
    });
  });
});
