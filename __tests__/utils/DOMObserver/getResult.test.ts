import { describe, it, expect, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("getResult", () => {
  const playerName = "pName";
  const opponentNames = ["oName"];
  let pDeck = new Deck("Title", false, " ", playerName, "pNick", []);
  let oDeck = new OpponentDeck(
    "Title",
    false,
    " ",
    opponentNames[0],
    "oNick",
    []
  );
  let decks = new Map([
    [playerName, pDeck],
    [opponentNames[0], oDeck],
  ]);
  describe("If there is exactly one opponent", () => {
    afterEach(() => {
      pDeck = new Deck("Title", false, " ", "pName", "pNick", []);
      oDeck = new OpponentDeck("Title", false, " ", "oName", "oNick", []);
      decks = new Map([
        [playerName, pDeck],
        [opponentNames[0], oDeck],
      ]);
    });

    it("should return the victor as opponent and the defeated as tbe player when VP is tied and player has more turns than opponent, and the game did not end by resignation.", () => {
      // Arrange - Create decks with same VP but more turns for the player.
      pDeck.gameTurn = 15;
      oDeck.gameTurn = 14;
      pDeck.currentVP = 10;
      oDeck.currentVP = 10;
      const gameEndReason = "The game has ended.";

      // Act - Simulate getting game result when the players are tied for VP but the player has more turns (player lost).
      const { victor, defeated } = DOMObserver.getResult(
        decks,
        playerName,
        opponentNames,
        gameEndReason
      );

      // Assert
      expect([victor, defeated]).toStrictEqual([
        opponentNames[0],
        [playerName],
      ]);
    });

    it("The return the victor as player and the defeated as opponent when VP is tied and opponent has more turns than player, and the game did not end by resignation.", () => {
      // Arrange - Create decks with same VP but more turns for the opponent.

      pDeck.gameTurn = 15;
      oDeck.gameTurn = 16;
      pDeck.currentVP = 10;
      oDeck.currentVP = 10;
      const gameEndReason = "The game has ended.";

      // Act - Simulate getting game result when the players are tied for VP but the opponent has more turns (opponent lost).
      const { victor, defeated } = DOMObserver.getResult(
        decks,
        playerName,
        opponentNames,
        gameEndReason
      );

      // Assert
      expect({victor, defeated}).toStrictEqual({
        victor: playerName,
        defeated: opponentNames,
      });
    });

    it("should return the victor as the player and the defeated as the opponent when player has greater VP, and the game did not end by resignation.", () => {
      // Arrange
      pDeck.currentVP = 20;
      oDeck.currentVP = 10;
      const gameEndReason = "The game has ended.";

      // Act - Simulate getting the game result when player has more VP (no resignation)
      const { victor, defeated } = DOMObserver.getResult(
        decks,
        playerName,
        opponentNames,
        gameEndReason
      );

      // Assert
      expect([victor, defeated]).toStrictEqual([playerName, opponentNames]);
    });

    it("should return the victor as the opponent and the defeated as the player when opponent has greater VP, and the game did not end by resignation.", () => {
      // Arrange
      const gameEndReason = "The game has ended.";
      pDeck.currentVP = 20;
      oDeck.currentVP = 30;

      // Act - Simulate getting the game result when opponent has more VP (no resignation).
      const { victor, defeated } = DOMObserver.getResult(
        decks,
        playerName,
        opponentNames,
        gameEndReason
      );

      // Assert
      expect([victor, defeated]).toStrictEqual([
        opponentNames[0],
        [playerName],
      ]);
    });

    it("should return victor and defeated as None: tie when both players have equal vp and equal turns", () => {
      // Arrange
      const gameEndReason = "The game has ended";
      pDeck.gameTurn = 15;
      oDeck.gameTurn = 15;
      pDeck.currentVP = 20;
      oDeck.currentVP = 20;

      // Act - Simulate getting result when its a tie (equal turns, equal VP, no resignation).
      const { victor, defeated } = DOMObserver.getResult(
        decks,
        playerName,
        opponentNames,
        gameEndReason
      );

      // Assert
      expect([victor, defeated]).toStrictEqual(["None: tie", ["None: tie"]]);
    });

    it("should return the opponent as the victor and the player as the defeated when the player resigns", () => {
      // Arrange
      const gameEndReason = playerName + " has resigned.";

      // Act - Simulate getting the result when the player resigns.
      const {victor, defeated} = DOMObserver.getResult(
        decks,
        playerName,
        opponentNames,
        gameEndReason
      );

      // Assert
      expect([victor, defeated]).toStrictEqual([opponentNames[0], [playerName]]);
    });

    it("should return the player as the victor and the opponent as the defeated when the opponent resigns", () => {
      // Arrange
      const gameEndReason = opponentNames[0] + " has resigned.";

      // Act - Simulate getting the result when the opponent resigns.
      const { victor, defeated } = DOMObserver.getResult(
        decks,
        playerName,
        opponentNames,
        gameEndReason
      );

      // Assert
      expect([victor, defeated]).toStrictEqual([playerName, [opponentNames[0]]]);
    });
  });

  describe("getResult", () => {
    it("should return the victor and defeated player names when player has resigned", () => {
      // Arrange - Create a sample gameEndReason when player has resigned
      const gameEndReason = "Player A has resigned.";
      const playerName = "Player A";
      const opponentNames = ["Player B"];

      // Act
      const { victor, defeated } = DOMObserver.getResult(
        new Map(),
        playerName,
        opponentNames,
        gameEndReason
      );

      // Assert
      expect(victor).toBe("Player B");
      expect(defeated).toStrictEqual(["Player A"]);
    });

    it("should return the victor and defeated player names when opponent has resigned", () => {
      // Arrange - Create a sample gameEndReason when opponent has resigned
      const gameEndReason = "Player B has resigned.";
      const playerName = "Player A";
      const opponentNames = ["Player B"];

      // Act
      const { victor, defeated } = DOMObserver.getResult(
        new Map(),
        playerName,
        opponentNames,
        gameEndReason
      );

      // Assert
      expect(victor).toBe("Player A");
      expect(defeated).toStrictEqual(["Player B"]);
    });

    it("should return the victor and defeated player names based on current VP", () => {
      // Arrange - Create sample decks with different current VP values
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decks = new Map<string, any>();
      decks.set("Player A", { currentVP: 10, gameTurn: 5 });
      decks.set("Player B", { currentVP: 15, gameTurn: 5 });
      const playerName = "Player A";
      const opponentNames = ["Player B"];

      // Act
      const { victor, defeated } = DOMObserver.getResult(
        decks,
        playerName,
        opponentNames,
        "Game ended."
      );

      // Assert
      expect(victor).toBe("Player B");
      expect(defeated).toStrictEqual(["Player A"]);
    });

    it("should return the victor and defeated player names based on game turn", () => {
      // Arrange - Create sample decks with different game turn values
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decks = new Map<string, any>();
      decks.set("Player A", { currentVP: 10, gameTurn: 6 });
      decks.set("Player B", { currentVP: 10, gameTurn: 5 });
      const playerName = "Player A";
      const opponentNames = ["Player B"];

      // Act
      const { victor, defeated } = DOMObserver.getResult(
        decks,
        playerName,
        opponentNames,
        "Game ended."
      );

      // Assert
      expect(victor).toBe("Player B");
      expect(defeated).toStrictEqual(["Player A"]);
    });

    it("should return 'None: tie' when the game is a tie", () => {
      // Arrange - Create sample decks with the same current VP and game turn values
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decks = new Map<string, any>();
      decks.set("Player A", { currentVP: 10, gameTurn: 5 });
      decks.set("Player B", { currentVP: 10, gameTurn: 5 });
      const playerName = "Player A";
      const opponentNames = ["Player B"];

      // Act
      const { victor, defeated } = DOMObserver.getResult(
        decks,
        playerName,
        opponentNames,
        "Game ended."
      );

      // Assert
      expect(victor).toBe("None: tie");
      expect(defeated).toStrictEqual(["None: tie"]);
    });
  });
});
