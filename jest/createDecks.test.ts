import { beforeEach } from "@jest/globals";
import { expect, jest, describe, it } from "@jest/globals";
import { createPlayerDecks } from "../src/content/contentFunctions";
import { Deck } from "../src/model/deck";

describe("Function createPlayerDacks", () => {
  describe("when given playerNames, abbreviated names, and kingdom arrays", () => {
    it("should return a Map<string,Deck> objest with a deck for each player", () => {
      const playerNames = ["PlayerName", "OpponentName"];
      const abbrvNames = ["plyrabbr", "oppabbr"];
      const fakekingdom = ["card1", "card2", "card3"];

      const testMap: Map<string, Deck> = new Map();
      testMap.set(
        playerNames[0],
        new Deck(playerNames[0], abbrvNames[0], fakekingdom)
      );
      testMap.set(
        playerNames[1],
        new Deck(playerNames[1], abbrvNames[1], fakekingdom)
      );

      expect(
        JSON.stringify(createPlayerDecks(playerNames, abbrvNames, fakekingdom))
      ).toStrictEqual(JSON.stringify(testMap));
    });
  });
});
