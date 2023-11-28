import { describe, it, expect, afterEach, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("Function setDecksGameResults", () => {
  // Instantiate Deck and OpponentDeck objects
  let pDeck = new Deck("", false, "", "pName", "pNick", []);
  let oDeck = new OpponentDeck("", false, "", "oName", "oNick", []);
  let expectedPDeck = new Deck("", false, "", "pName", "pNick", []);
  let expectedODeck = new OpponentDeck("", false, "", "oName", "oNick", []);
  describe("when there is exactly one opponent", () => {
    afterEach(() => {
      pDeck = new Deck("", false, "", "pName", "pNick", []);
      oDeck = new OpponentDeck("", false, "", "oName", "oNick", []);
      expectedPDeck = new Deck("", false, "", "pName", "pNick", []);
      expectedODeck = new OpponentDeck("", false, "", "oName", "oNick", []);
      jest.clearAllMocks();
    });
    it("should set the player deck gameResult as 'Victory' and the opponent deck gameResult as 'Victory' when the player is the victor, and return the decks ", () => {
      // Arrange
      const victor = "pName";
      const defeated = ["oName"];
      const playerName = "pName";
      const opponentNames = ["oName"];
      const decks = new Map<string, Deck | OpponentDeck>([
        [playerName, pDeck],
        [opponentNames[0], oDeck],
      ]);
      expectedPDeck.gameResult = "Victory";
      expectedODeck.gameResult = "Defeat";
      const updatedDecks = new Map<string, Deck | OpponentDeck>([
        [playerName, expectedPDeck],
        [opponentNames[0], expectedODeck],
      ]);
      // Act and Assert - Simulate setting  deck results where the victor is the player.
      expect(
        DOMObserver.setDecksGameResults(
          victor,
          defeated,
          playerName,
          opponentNames,
          decks
        )
      ).toStrictEqual(updatedDecks);
    });

    it("should set the opponent deck gameResult as 'Victory' and the player deck gameResult as 'Defeat' when the opponent is the victor, and return the decks ", () => {
      const victor = "oName";
      const defeated = ["pName"];
      const playerName = "pName";
      const opponentNames = ["oName"];
      const decks = new Map<string, Deck | OpponentDeck>([
        [playerName, pDeck],
        [opponentNames[0], oDeck],
      ]);
      expectedODeck.gameResult = "Victory";
      expectedPDeck.gameResult = "Defeat";
      const updatedDecks = new Map<string, Deck | OpponentDeck>([
        [playerName, expectedPDeck],
        [opponentNames[0], expectedODeck],
      ]);

      // Act and Assert - Simulate setting deck results where the victor is the opponent.
      expect(
        DOMObserver.setDecksGameResults(
          victor,
          defeated,
          playerName,
          opponentNames,
          decks
        )
      ).toStrictEqual(updatedDecks);
    });

    it("should set the player deck gameResult and the opponent deck gameResult as 'Tie' the player is neither victor nor defeated", () => {
      const victor = "None: tie";
      const defeated = ["None: tie"];
      const playerName = "pName";
      const opponentNames = ["oName"];
      const decks = new Map<string, Deck | OpponentDeck>([
        [playerName, pDeck],
        [opponentNames[0], oDeck],
      ]);
      expectedPDeck.gameResult = "Tie";
      expectedODeck.gameResult = "Tie";
      const updatedDecks = new Map<string, Deck | OpponentDeck>([
        [playerName, expectedPDeck],
        [opponentNames[0], expectedODeck],
      ]);

      // Act and Assert - Simulate setting deck results where game result is tie.
      expect(
        DOMObserver.setDecksGameResults(
          victor,
          defeated,
          playerName,
          opponentNames,
          decks
        )
      ).toStrictEqual(updatedDecks);
    });
  });
});
