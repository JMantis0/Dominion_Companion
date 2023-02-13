import { describe, it, expect } from "@jest/globals";
import { separateUndispatchedDeckLogs } from "../src/content/contentFunctions";

describe("Function separateUndispatchedDeckLogs()", () => {
  describe("when given a string of logs, and opponent/player names/abbrnames", () => {
    it("should return 3 arrays, one infologs, one playerlogs, one opponentlogs", () => {
      const expected = [
        ["Pp blahbla1", "Pp blahblah2", "Pp blahblah3"],
        ["Po blahbla1", "Po blahblah2", "Po blahblah3"],
        ["Card Pool ", "Game # ", "starts with ", "Turn "],
      ];

      const fakeUndispatchedLogs =
        "Card Pool \nGame # \nstarts with \nPo blahbla1\nTurn \nPp blahbla1\nPp blahblah2\nPo blahblah2\nPp blahblah3\nPo blahblah3";
      const playerNomen = "Pp";
      const opponentNomen = "Po";
      expect(
        separateUndispatchedDeckLogs(
          fakeUndispatchedLogs,
          playerNomen,
          opponentNomen
        )
      ).toStrictEqual([
        ["Pp blahbla1", "Pp blahblah2", "Pp blahblah3"],
        ["Po blahbla1", "Po blahblah2", "Po blahblah3"],
        ["Card Pool ", "Game # ", "starts with ", "Turn "],
      ]);
    });
  });
});
