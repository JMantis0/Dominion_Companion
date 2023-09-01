import { describe, it, expect, beforeEach } from "@jest/globals";
import { getResult } from "../../src/content/components/PrimaryFrame/components/componentFunctions";
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
});
