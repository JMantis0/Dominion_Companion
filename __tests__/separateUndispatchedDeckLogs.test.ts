import { describe, it, expect } from "@jest/globals";
import { separateUndispatchedDeckLogs } from "../src/content/contentFunctions";

describe("Function separateUndispatchedDeckLogs()", () => {
  describe("when given a string of logs, and opponent/player names/abbrnames", () => {
    it("should return a custom typed SeperatedLogs object literal", () => {
      const fakeUndispatchedLogs =
        "Card Pool \nGame # \nstarts with \nPo blahbla1\nTurn \nPp blahbla1\nPp blahblah2\nPo blahblah2\nPp blahblah3\nPo blahblah3";
      const playerNomen = "Pp";
      type SeperateLogs = {
        playerLogs: string[];
        opponentLogs: string[];
        infoLogs: string[];
      };

      expect(
        separateUndispatchedDeckLogs(fakeUndispatchedLogs, playerNomen)
      ).toStrictEqual({
        playerLogs: ["Pp blahbla1", "Pp blahblah2", "Pp blahblah3"],
        opponentLogs: ["Po blahbla1", "Po blahblah2", "Po blahblah3"],
        infoLogs: ["Card Pool ", "Game # ", "starts with ", "Turn "],
      });
    });
  });
});
