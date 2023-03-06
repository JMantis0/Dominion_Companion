/**
 * @jest-environment jsdom
 */
import { expect, describe, it } from "@jest/globals";
import { getPlayerNameAbbreviations } from "../../src/content/contentScriptFunctions";

describe("Function getPlayerNameAbbreviations() ", () => {
  describe("Given the playernames with different first Letters and first few lines of game log", () => {
    it("should return the abbreviated player names", () => {
      let playerName: string = "GoodBeard";
      const gameLog: string = `Game #116986281, unrated.\nCard Pool: level 1\nL starts with 7 Coppers.\nL starts with 3 Estates.\nG starts with 7 Coppers.\nG starts with 3 Estates.\nL shuffles their deck.\nG shuffles their deck.`;

      expect(getPlayerNameAbbreviations(gameLog, playerName)).toStrictEqual([
        "G",
        "L",
      ]);
    });
  });
  describe("Given playernames with same starting letters", () => {
    it("should return the multi-letter abbreviations for the player names", () => {
      let playerName: string = "GoodBeard";
      const gameLog: string = `Game #116986281, unrated.\nCard Pool: level 1\nGr starts with 7 Coppers.\nGr starts with 3 Estates.\nGo starts with 7 Coppers.\nGo starts with 3 Estates.\nGr shuffles their deck.\nGo shuffles their deck.`;
      expect(getPlayerNameAbbreviations(gameLog, playerName)).toStrictEqual([
        "Go",
        "Gr",
      ]);
    });
  });
});
