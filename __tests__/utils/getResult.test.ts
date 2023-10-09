import { describe, it, expect, beforeEach } from "@jest/globals";
import { getResult } from "../../src/utils/utils";
import { Deck } from "../../src/model/deck";
import { OpponentDeck } from "../../src/model/opponentDeck";
import { createRandomDeck, createRandomOpponentDeck } from "../testUtilFuncs";

describe("Function getResult.test.ts", () => {
  let pDeck: Deck;
  let oDeck: OpponentDeck;
  let dMap: Map<string, Deck | OpponentDeck>;
  let playerName: string;
  let opponentName: string;
  let gameEndReason: string;
  describe("when VP is tied and player has more turns than opponent", () => {
    beforeEach(() => {
      pDeck = createRandomDeck();
      oDeck = createRandomOpponentDeck();
      playerName = "Player";
      opponentName = "Opponent";
      gameEndReason = "None";
      pDeck.setGameTurn(15);
      pDeck.setPlayerName(playerName);
      pDeck.setCurrentVP(10);
      oDeck.setGameTurn(14);
      oDeck.setPlayerName(opponentName);
      oDeck.setCurrentVP(10);
      dMap = new Map<string, Deck | OpponentDeck>();
      dMap.set(playerName, pDeck);
      dMap.set(opponentName, oDeck);
    });
    it("The victor should should be Opponent and the defeated should be Player", () => {
      expect(
        getResult(dMap, playerName, opponentName, gameEndReason)
      ).toStrictEqual([opponentName, playerName]);
    });
  });
  describe("when VP is tied and opponent has more turns than player", () => {
    beforeEach(() => {
      pDeck = createRandomDeck();
      oDeck = createRandomOpponentDeck();
      playerName = "Player";
      opponentName = "Opponent";
      gameEndReason = "None";
      pDeck.setGameTurn(15);
      pDeck.setPlayerName(playerName);
      pDeck.setCurrentVP(10);
      oDeck.setGameTurn(16);
      oDeck.setPlayerName(opponentName);
      oDeck.setCurrentVP(10);
      dMap = new Map<string, Deck | OpponentDeck>();
      dMap.set(playerName, pDeck);
      dMap.set(opponentName, oDeck);
    });
    it("The victor should should be Player and the defeated should be Opponent", () => {
      expect(
        getResult(dMap, playerName, opponentName, gameEndReason)
      ).toStrictEqual([playerName, opponentName]);
    });
  });
  describe("when player has greater VP", () => {
    beforeEach(() => {
      pDeck = createRandomDeck();
      oDeck = createRandomOpponentDeck();
      playerName = "Player";
      opponentName = "Opponent";
      gameEndReason = "None";
      pDeck.setGameTurn(15);
      pDeck.setPlayerName(playerName);
      pDeck.setCurrentVP(20);
      oDeck.setGameTurn(16);
      oDeck.setPlayerName(opponentName);
      oDeck.setCurrentVP(10);
      dMap = new Map<string, Deck | OpponentDeck>();
      dMap.set(playerName, pDeck);
      dMap.set(opponentName, oDeck);
    });
    it("The victor should should be Player and the defeated should be Opponent", () => {
      expect(
        getResult(dMap, playerName, opponentName, gameEndReason)
      ).toStrictEqual([playerName, opponentName]);
    });
  });
  describe("when Opponent has greater VP", () => {
    beforeEach(() => {
      pDeck = createRandomDeck();
      oDeck = createRandomOpponentDeck();
      playerName = "Player";
      opponentName = "Opponent";
      gameEndReason = "None";
      pDeck.setGameTurn(15);
      pDeck.setPlayerName(playerName);
      pDeck.setCurrentVP(20);
      oDeck.setGameTurn(16);
      oDeck.setPlayerName(opponentName);
      oDeck.setCurrentVP(30);
      dMap = new Map<string, Deck | OpponentDeck>();
      dMap.set(playerName, pDeck);
      dMap.set(opponentName, oDeck);
    });
    it("The victor should should be Opponent and the defeated should be Player", () => {
      expect(
        getResult(dMap, playerName, opponentName, gameEndReason)
      ).toStrictEqual([opponentName, playerName]);
    });
  });
  describe("When both players have equal vp and equal turns", () => {
    beforeEach(() => {
      pDeck = createRandomDeck();
      oDeck = createRandomOpponentDeck();
      playerName = "Player";
      opponentName = "Opponent";
      gameEndReason = "None";
      pDeck.setGameTurn(15);
      pDeck.setPlayerName(playerName);
      pDeck.setCurrentVP(20);
      oDeck.setGameTurn(15);
      oDeck.setPlayerName(opponentName);
      oDeck.setCurrentVP(20);
      dMap = new Map<string, Deck | OpponentDeck>();
      dMap.set(playerName, pDeck);
      dMap.set(opponentName, oDeck);
    });
    it("should return both as None: tie", () => {
      expect(
        getResult(dMap, playerName, opponentName, gameEndReason)
      ).toStrictEqual(["None: tie", "None: tie"]);
    });
  });
  describe("When the player has resigned", () => {
    beforeEach(() => {
      pDeck = createRandomDeck();
      oDeck = createRandomOpponentDeck();
      playerName = "Player";
      opponentName = "Opponent";
      gameEndReason = "Player has resigned.";
      pDeck.setGameTurn(15);
      pDeck.setPlayerName(playerName);
      pDeck.setCurrentVP(20);
      oDeck.setGameTurn(15);
      oDeck.setPlayerName(opponentName);
      oDeck.setCurrentVP(20);
      dMap = new Map<string, Deck | OpponentDeck>();
      dMap.set(playerName, pDeck);
      dMap.set(opponentName, oDeck);
    });
    it("it should return the opponent as the victor and the player as the defeated", () => {
      expect(
        getResult(dMap, playerName, opponentName, gameEndReason)
      ).toStrictEqual(["Opponent", "Player"]);
    });
  });
  describe("When the opponent has resigned", () => {
    beforeEach(() => {
      pDeck = createRandomDeck();
      oDeck = createRandomOpponentDeck();
      playerName = "Player";
      opponentName = "Opponent";
      gameEndReason = "Opponent has resigned.";
      pDeck.setGameTurn(15);
      pDeck.setPlayerName(playerName);
      pDeck.setCurrentVP(20);
      oDeck.setGameTurn(15);
      oDeck.setPlayerName(opponentName);
      oDeck.setCurrentVP(20);
      dMap = new Map<string, Deck | OpponentDeck>();
      dMap.set(playerName, pDeck);
      dMap.set(opponentName, oDeck);
    });
    it("it should return the player as the victor and the opponent as the defeated", () => {
      expect(
        getResult(dMap, playerName, opponentName, gameEndReason)
      ).toStrictEqual(["Player", "Opponent"]);
    });
  });
  
  // More tests with some different techniques
describe('getResult', () => {
  it('should return the victor and defeated player names when player has resigned', () => {
    // Arrange - Create a sample gameEndReason when player has resigned
    const gameEndReason = 'Player A has resigned.';
    const playerName = 'Player A';
    const opponentName = 'Player B';

    // Act
    const [victor, defeated] = getResult(new Map(), playerName, opponentName, gameEndReason);

    // Assert
    expect(victor).toBe('Player B');
    expect(defeated).toBe('Player A');
  });

  it('should return the victor and defeated player names when opponent has resigned', () => {
    // Arrange - Create a sample gameEndReason when opponent has resigned
    const gameEndReason = 'Player B has resigned.';
    const playerName = 'Player A';
    const opponentName = 'Player B';

    // Act
    const [victor, defeated] = getResult(new Map(), playerName, opponentName, gameEndReason);

    // Assert
    expect(victor).toBe('Player A');
    expect(defeated).toBe('Player B');
  });

  it('should return the victor and defeated player names based on current VP', () => {
    // Arrange - Create sample decks with different current VP values
    const decks = new Map<string, any>();
    decks.set('Player A', { currentVP: 10, gameTurn: 5 });
    decks.set('Player B', { currentVP: 15, gameTurn: 5 });
    const playerName = 'Player A';
    const opponentName = 'Player B';

    // Act
    const [victor, defeated] = getResult(decks, playerName, opponentName, 'Game ended.');

    // Assert
    expect(victor).toBe('Player B');
    expect(defeated).toBe('Player A');
  });

  it('should return the victor and defeated player names based on game turn', () => {
    // Arrange - Create sample decks with different game turn values
    const decks = new Map<string, any>();
    decks.set('Player A', { currentVP: 10, gameTurn: 6 });
    decks.set('Player B', { currentVP: 10, gameTurn: 5 });
    const playerName = 'Player A';
    const opponentName = 'Player B';

    // Act
    const [victor, defeated] = getResult(decks, playerName, opponentName, 'Game ended.');

    // Assert
    expect(victor).toBe('Player B');
    expect(defeated).toBe('Player A');
  });

  it('should return "None: tie" when the game is a tie', () => {
    // Arrange - Create sample decks with the same current VP and game turn values
    const decks = new Map<string, any>();
    decks.set('Player A', { currentVP: 10, gameTurn: 5 });
    decks.set('Player B', { currentVP: 10, gameTurn: 5 });
    const playerName = 'Player A';
    const opponentName = 'Player B';

    // Act
    const [victor, defeated] = getResult(decks, playerName, opponentName, 'Game ended.');

    // Assert
    expect(victor).toBe('None: tie');
    expect(defeated).toBe('None: tie');
  });

 
});
});
