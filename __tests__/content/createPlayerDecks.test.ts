import { expect, describe, it } from "@jest/globals";
import { createPlayerDecks } from "../../src/content/contentScriptFunctions";
import { Deck } from "../../src/model/deck";

describe("Function createPlayerDacks", () => {
  describe("when given playerNames, abbreviated names, and kingdom arrays", () => {
    it("should return a Map<string,Deck> objects with a deck for each player", () => {
      const opponentName = "OpponentName";
      const playerName = "PlayerName";
      const playerNick = "plyrNick";
      const opponentNick = "oppNick";

      const fakekingdom = ["card1", "card2", "card3"];

      const testMap: Map<string, Deck> = new Map();
      testMap.set(playerName, new Deck(playerName, playerNick, fakekingdom));
      testMap.set(
        opponentName,
        new Deck(opponentName, opponentNick, fakekingdom)
      );

      expect(
        JSON.stringify(
          createPlayerDecks(
            playerName,
            playerNick,
            opponentName,
            opponentNick,
            fakekingdom
          )
        )
      ).toStrictEqual(JSON.stringify(testMap));
    });
  });
});
