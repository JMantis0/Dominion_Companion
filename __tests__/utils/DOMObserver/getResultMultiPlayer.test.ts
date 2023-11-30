import { describe, it, expect, beforeEach } from "@jest/globals";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { Deck } from "../../../src/model/deck";
import { DOMObserver } from "../../../src/utils/DOMObserver";
describe("getResultMultiPlayer", () => {
  let pd: Deck;
  let od1: OpponentDeck;
  let od2: OpponentDeck;
  let od3: OpponentDeck;
  let od4: OpponentDeck;
  let decks: Map<string, Deck | OpponentDeck>;
  let opponentNames: string[];
  const mockTitle = "Mock title";
  beforeEach(() => {
    pd = new Deck("", false, "", "", "", []);
    opponentNames = ["Opponent 1", "Opponent 2", "Opponent 3", "Opponent 4"];
    pd = new Deck(mockTitle, false, "", "Player Name", "P", []);
    od1 = new OpponentDeck(
      mockTitle,
      false,
      "",
      opponentNames[0],
      opponentNames[0],
      []
    );
    od2 = new OpponentDeck(
      mockTitle,
      false,
      "",
      opponentNames[1],
      opponentNames[1],
      []
    );
    od3 = new OpponentDeck(
      mockTitle,
      false,
      "",
      opponentNames[2],
      opponentNames[2],
      []
    );
    od4 = new OpponentDeck(
      mockTitle,
      false,
      "",
      opponentNames[3],
      opponentNames[3],
      []
    );
    decks = new Map([
      [pd.playerName, pd],
      [od1.playerName, od1],
      [od2.playerName, od2],
      [od3.playerName, od3],
      [od4.playerName, od4],
    ]);
  });

  it(
    "should return the winning player as the victor, and return the " +
      "defeated players in order of place as the defeated",
    () => {
      // Arrange - set up a playerDeck and multiple opponent Decks with various vps.
      pd.setCurrentVP(0);
      od1.setCurrentVP(1);
      od2.setCurrentVP(2);
      od3.setCurrentVP(3);
      od4.setCurrentVP(4);
      const gameEndReason = "The game has ended.";

      // Act - Get the game result when no players are tied and no resignation occurred.
      const resultMap: Map<number, string[]> = DOMObserver.getResultMultiPlayer(
        decks,
        "Player Name",
        opponentNames,
        gameEndReason
      );

      // Assert - Verify map is returned as expeected.
      expect(resultMap).toStrictEqual(
        new Map([
          [1, ["Opponent 4"]],
          [2, ["Opponent 3"]],
          [3, ["Opponent 2"]],
          [4, ["Opponent 1"]],
          [5, ["Player Name"]],
        ])
      );
    }
  );

  it(
    "when the game ends because of a resignation, should assign the resigning player as last place, " +
      "return the winning player as the victor, and arrange the other players as defeated in order of place",
    () => {
      // Arrange - set up a playerDeck and multiple opponent Decks with various VPs where one player resigned.
      pd.setCurrentVP(0);
      od1.setCurrentVP(1);
      od2.setCurrentVP(2);
      od3.setCurrentVP(3);
      od4.setCurrentVP(4);
      const gameEndReason = "Opponent 4 has resigned.";

      // Act - Get the result when a player has resigned.
      const resultMap: Map<number, string[]> = DOMObserver.getResultMultiPlayer(
        decks,
        "Player Name",
        opponentNames,
        gameEndReason
      );

      // Assert - Verify the player that resigned is in last place and the other players are ranked correctly
      expect(resultMap).toStrictEqual(
        new Map([
          [1, ["Opponent 3"]],
          [2, ["Opponent 2"]],
          [3, ["Opponent 1"]],
          [4, ["Player Name"]],
          [5, ["Opponent 4"]],
        ])
      );
    }
  );

  it("when two or more players are tied for VP, it should sort place by turns", () => {
    // Arrange - Set up a tie in VP that must be sorted by turns.
    pd.setCurrentVP(0);
    od1.setCurrentVP(1);
    od2.setCurrentVP(5);
    od3.setCurrentVP(4);
    od3.setGameTurn(20);
    od4.setCurrentVP(4);
    od4.setGameTurn(19); // player 4 less turns.
    const gameEndReason = "The game has ended.";

    // Act - Get result where there is a VP tie.
    const resultMap: Map<number, string[]> = DOMObserver.getResultMultiPlayer(
      decks,
      "Player Name",
      opponentNames,
      gameEndReason
    );

    // Assert - Verify map sorts the players that have tied VP by their turns.
    expect(resultMap).toStrictEqual(
      new Map([
        [1, ["Opponent 2"]],
        [2, ["Opponent 4"]],
        [3, ["Opponent 3"]],
        [4, ["Opponent 1"]],
        [5, ["Player Name"]],
      ])
    );
  });

  it("when two or more players are tied for VP and turns, they should share the same place", () => {
    // Arrange - Set up players so there is a  tie for VP and turns.
    pd.setCurrentVP(0);
    od1.setCurrentVP(1);
    od2.setCurrentVP(5);
    od3.setCurrentVP(4);
    od3.setGameTurn(20);
    od4.setCurrentVP(4);
    od4.setGameTurn(20);
    const gameEndReason = "The game has ended.";

    // Act - Get result when there are players tied for VP and turns
    const resultMap: Map<number, string[]> = DOMObserver.getResultMultiPlayer(
      decks,
      "Player Name",
      opponentNames,
      gameEndReason
    );

    // Verify map is returned correctly, with tied players occupying the same rank.
    expect(resultMap).toStrictEqual(
      new Map([
        [1, ["Opponent 2"]],
        [2, ["Opponent 3", "Opponent 4"]],
        [4, ["Opponent 1"]],
        [5, ["Player Name"]],
      ])
    );
  });

  it("when there are n players tied for the same place, the next (n-1) places below them should be empty/skipped", () => {
    // Arrange - set up a tie between more than 2 players.
    pd.setCurrentVP(10);
    od1.setCurrentVP(10);
    od2.setCurrentVP(10);
    od3.setCurrentVP(10);
    od4.setCurrentVP(5);
    const gameEndReason = "The game has ended.";

    // Act - Get result when there is a tie between more than 2 players.
    const resultMap: Map<number, string[]> = DOMObserver.getResultMultiPlayer(
      decks,
      "Player Name",
      opponentNames,
      gameEndReason
    );

    // Verify map is returned correctly with the right amount of places empty.
    expect(resultMap).toStrictEqual(
      new Map([
        [1, ["Opponent 1", "Opponent 2", "Opponent 3", "Player Name"]],
        [5, ["Opponent 4"]],
      ])
    );
  });
  it("should assign results correctly when there are ties for multiple places", () => {
    // Arrange - Set up multiple ties for different places.
    pd.setCurrentVP(10);
    od1.setCurrentVP(10);
    od2.setCurrentVP(5);
    od3.setCurrentVP(5);
    od4.setCurrentVP(20);
    const gameEndReason = "The game has ended.";

    // Act - Get results when there are more than one tie for different places
    const resultMap: Map<number, string[]> = DOMObserver.getResultMultiPlayer(
      decks,
      "Player Name",
      opponentNames,
      gameEndReason
    );

    // Verify the map is returned correctly, with ties occurring on multiple ranks.
    expect(resultMap).toStrictEqual(
      new Map([
        [1, ["Opponent 4"]],
        [2, ["Opponent 1", "Player Name"]],
        [4, ["Opponent 2", "Opponent 3"]],
      ])
    );
  });

  it("should work when all players are involved in a tie", () => {
    // Arrange 6 decks where each player is in a tie, with 3 different ties.
    pd.setCurrentVP(5);
    od1.setCurrentVP(5);
    od2.setCurrentVP(10);
    od3.setCurrentVP(10);
    od4.setCurrentVP(20);
    const od5 = new OpponentDeck(
      mockTitle,
      false,
      "",
      "Opponent 5",
      "Opponent 5",
      []
    );
    od5.setCurrentVP(20);
    decks.set("Opponent 5", od5);
    opponentNames.push("Opponent 5");
    const gameEndReason = "The game has ended.";

    // Act - Get result when there are 3 separate ties.
    const resultMap = DOMObserver.getResultMultiPlayer(
      decks,
      "Player Name",
      opponentNames,
      gameEndReason
    );
    // Assert - Verify map is created and returned correctly.
    expect(resultMap).toStrictEqual(
      new Map([
        [1, ["Opponent 4", "Opponent 5"]],
        [3, ["Opponent 2", "Opponent 3"]],
        [5, ["Opponent 1", "Player Name"]],
      ])
    );
  });

  it("should work when all players are involved in a tie, but one resigned", () => {
    // Arrange 6 decks where each player is in a tie, with 3 different ties, and one player resigned
    pd.setCurrentVP(5);
    od1.setCurrentVP(5);
    od2.setCurrentVP(10);
    od3.setCurrentVP(10);
    od4.setCurrentVP(20);
    const od5 = new OpponentDeck(
      mockTitle,
      false,
      "",
      "Opponent 5",
      "Opponent 5",
      []
    );
    od5.setCurrentVP(20);
    decks.set("Opponent 5", od5);
    opponentNames.push("Opponent 5");
    const gameEndReason = "Opponent 4 has resigned.";

    // Act - Get result when there are 3 separate ties.
    const resultMap = DOMObserver.getResultMultiPlayer(
      decks,
      "Player Name",
      opponentNames,
      gameEndReason
    );
    // Assert - Verify map is created and returned correctly.
    expect(resultMap).toStrictEqual(
      new Map([
        [1, ["Opponent 5"]],
        [2, ["Opponent 2", "Opponent 3"]],
        [4, ["Opponent 1", "Player Name"]],
        [6, ["Opponent 4"]],
      ])
    );
  });

  it(
    "should work when there are multiple ranks tied for, " +
      " with different number of players tied for one rank than the other",
    () => {
      // Arrange 6 decks where 3 players are tied for one rank, and 2 players for another.
      pd.setCurrentVP(5);
      od1.setCurrentVP(5);
      od2.setCurrentVP(5);
      od3.setCurrentVP(20);
      od4.setCurrentVP(20);
      const od5 = new OpponentDeck(
        mockTitle,
        false,
        "",
        "Opponent 5",
        "Opponent 5",
        []
      );
      od5.setCurrentVP(10);
      decks.set("Opponent 5", od5);
      opponentNames.push("Opponent 5");
      const gameEndReason = "The game has ended.";

      // Act - Get result when there are 3 separate ties.
      const resultMap = DOMObserver.getResultMultiPlayer(
        decks,
        "Player Name",
        opponentNames,
        gameEndReason
      );
      // Assert - Verify map is created and returned correctly.
      expect(resultMap).toStrictEqual(
        new Map([
          [1, ["Opponent 3", "Opponent 4"]],
          [3, ["Opponent 5"]],
          [4, ["Opponent 1", "Opponent 2", "Player Name"]],
        ])
      );
    }
  );
});
