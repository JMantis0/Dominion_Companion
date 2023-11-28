import { describe, it, expect, beforeEach } from "@jest/globals";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { Deck } from "../../../src/model/deck";
import { DOMObserver } from "../../../src/utils/DOMObserver";
describe("getResultMultiPlayer", () => {
  let pd: Deck;
  let od1, od2, od3, od4: OpponentDeck;
  let decks: Map<string, Deck | OpponentDeck>;
  let opponentNames: string[];
  beforeEach(() => {
    pd = new Deck("", false, "", "", "", []);
    od1 = new OpponentDeck("", false, "", "", "", []);
    od2 = new OpponentDeck("", false, "", "", "", []);
    od3 = new OpponentDeck("", false, "", "", "", []);
    od4 = new OpponentDeck("", false, "", "", "", []);
    decks = new Map();
  });
  it(
    "should return the winning player as the victor, and return the " +
      "defeated players in order of place as the defeated",
    () => {
      // Arrange - set up a playerDeck and multiple opponent Decks with various vps.
      const mockTitle = "Mock title";
      pd = new Deck(mockTitle, false, "", "Player Name", "P", []);
      opponentNames = ["Opponent 1", "Opponent 2", "Opponent 3", "Opponent 4"];
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
      pd.setCurrentVP(0);
      od1.setCurrentVP(1);
      od2.setCurrentVP(2);
      od3.setCurrentVP(3);
      od4.setCurrentVP(4);
      decks = new Map([
        [pd.playerName, pd],
        [od1.playerName, od1],
        [od2.playerName, od2],
        [od3.playerName, od3],
        [od4.playerName, od4],
      ]);

      const gameEndReason = "The game has ended.";
      const { victor, defeated } = DOMObserver.getResultMultiPlayer(
        "Player Name",
        opponentNames,
        gameEndReason,
        decks
      );

      expect(victor).toStrictEqual("Opponent 4");
      expect(defeated).toStrictEqual([
        "Opponent 3",
        "Opponent 2",
        "Opponent 1",
        "Player Name",
      ]);
    }
  );

  it(
    "when the game ends because of a resignation, should assign the resigning player as last place, " +
      "return the winning player as the victor, and arrange the other players as defeated in order of place",
    () => {
      // Arrange - set up a playerDeck and multiple opponent Decks with various vps.
      const mockTitle = "Mock title";
      pd = new Deck(mockTitle, false, "", "Player Name", "P", []);
      opponentNames = ["Opponent 1", "Opponent 2", "Opponent 3", "Opponent 4"];
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
      pd.setCurrentVP(0);
      od1.setCurrentVP(1);
      od2.setCurrentVP(2);
      od3.setCurrentVP(3);
      od4.setCurrentVP(4);
      decks = new Map([
        [pd.playerName, pd],
        [od1.playerName, od1],
        [od2.playerName, od2],
        [od3.playerName, od3],
        [od4.playerName, od4],
      ]);

      const gameEndReason = "Opponent 4 has resigned.";
      const { victor, defeated } = DOMObserver.getResultMultiPlayer(
        "Player Name",
        opponentNames,
        gameEndReason,
        decks
      );

      expect(victor).toStrictEqual("Opponent 3");
      expect(defeated).toStrictEqual([
        "Opponent 2",
        "Opponent 1",
        "Player Name",
        "Opponent 4",
      ]);
    }
  );
  it("when two or more players are tied for VP, it should sort place by turns", () => {
    // Arrange - set up a playerDeck and multiple opponent Decks with various vps.
    const mockTitle = "Mock title";
    pd = new Deck(mockTitle, false, "", "Player Name", "P", []);
    opponentNames = ["Opponent 1", "Opponent 2", "Opponent 3", "Opponent 4"];
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
    pd.setCurrentVP(0);
    od1.setCurrentVP(1);
    od2.setCurrentVP(5);
    od3.setCurrentVP(4);
    od3.setGameTurn(20);
    od4.setCurrentVP(4);
    od4.setGameTurn(19); // player 4 less turns.
    decks = new Map([
      [pd.playerName, pd],
      [od1.playerName, od1],
      [od2.playerName, od2],
      [od3.playerName, od3],
      [od4.playerName, od4],
    ]);

    const gameEndReason = "The game has ended.";
    const { victor, defeated } = DOMObserver.getResultMultiPlayer(
      "Player Name",
      opponentNames,
      gameEndReason,
      decks
    );

    expect(victor).toStrictEqual("Opponent 2");
    expect(defeated).toStrictEqual([
      "Opponent 4",
      "Opponent 3",
      "Opponent 1",
      "Player Name",
    ]);
  });
  it("when two or more players are tied for VP and turns, if they are tied  it should sort place by turns", () => {
    // Arrange - set up a playerDeck and multiple opponent Decks with various vps.
    const mockTitle = "Mock title";
    pd = new Deck(mockTitle, false, "", "Player Name", "P", []);
    opponentNames = ["Opponent 1", "Opponent 2", "Opponent 3", "Opponent 4"];
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
    pd.setCurrentVP(0);
    od1.setCurrentVP(1);
    od2.setCurrentVP(5);
    od3.setCurrentVP(4);
    od3.setGameTurn(20);
    od4.setCurrentVP(4);
    od4.setGameTurn(19); // player 4 less turns.
    decks = new Map([
      [pd.playerName, pd],
      [od1.playerName, od1],
      [od2.playerName, od2],
      [od3.playerName, od3],
      [od4.playerName, od4],
    ]);

    const gameEndReason = "The game has ended.";
    const { victor, defeated } = DOMObserver.getResultMultiPlayer(
      "Player Name",
      opponentNames,
      gameEndReason,
      decks
    );

    expect(victor).toStrictEqual("Opponent 2");
    expect(defeated).toStrictEqual([
      "Opponent 4",
      "Opponent 3",
      "Opponent 1",
      "Player Name",
    ]);
  });
});
