import { expect, describe, it, beforeEach } from "@jest/globals";
import { createPlayerDecks } from "../../src/content/Observer/observerFunctions";
import { Deck } from "../../src/model/deck";
import { OpponentDeck } from "../../src/model/opponentDeck";
import { createRandomKingdom } from "../testUtilFuncs";

describe("Function createPlayerDecks", () => {
  let od: OpponentDeck;
  let pd: Deck;
  let gameTitle: string;
  let ratedGame: boolean;
  let playerName: string;
  let playerNick: string;
  let playerRating: string;
  let opponentName: string;
  let opponentNick: string;
  let opponentRating: string;
  let fakeKingdom: string[];

  const testMap: Map<string, Deck | OpponentDeck> = new Map();
  describe("when given a game title, ratedGame, playerName, playerNick, playerRating, opponentName, opponentNick, opponentRating, and kingdom arrays", () => {
    beforeEach(() => {
      gameTitle = "Random Title";
      ratedGame = false;
      fakeKingdom = createRandomKingdom();
      playerName = "PlayerName";
      playerNick = "PlayerNick";
      playerRating = "";
      pd = new Deck(
        gameTitle,
        ratedGame,
        playerRating,
        playerName,
        playerNick,
        fakeKingdom
      );
      opponentName = "OpponentName";
      opponentNick = "OpponentNick";
      opponentRating = "";
      od = new OpponentDeck(
        gameTitle,
        ratedGame,
        opponentRating,
        opponentName,
        opponentNick,
        fakeKingdom
      );
      testMap.set(playerName, pd);
      testMap.set(opponentName, od);
    });
    it("should return a Map<string,Deck|OpponentDeck> objects with a deck for each player", () => {
      let decksFromFunction = createPlayerDecks(
        gameTitle,
        false, //ratedGame value set as false by createRandomDeck
        playerName,
        playerNick,
        playerRating,
        opponentName,
        opponentNick,
        opponentRating,
        fakeKingdom
      );
      const stringifiedPlayerDeck = JSON.stringify(testMap.get(playerName));
      const stringifiedMapOpponentDeck = JSON.stringify(
        testMap.get(opponentName)
      );
      const stringifiedPlayerDeckFromFunc = JSON.stringify(
        decksFromFunction.get(playerName)
      );
      const stringifiedMapOpponentDeckFromFunc = JSON.stringify(
        decksFromFunction.get(opponentName)
      );
      expect(stringifiedMapOpponentDeck).toStrictEqual(
        stringifiedMapOpponentDeckFromFunc
      );
      expect(stringifiedPlayerDeck).toStrictEqual(
        stringifiedPlayerDeckFromFunc
      );
    });
  });
});
