import { describe, it, expect, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("getResult", () => {
  const playerName = "pName";
  const opponentNames = ["oName"];
  let pDeck = new Deck("Title", false, " ", playerName, "pNick", []);
  let oDeck = new OpponentDeck(
    "Title",
    false,
    " ",
    opponentNames[0],
    "oNick",
    []
  );
  let decks = new Map([
    [playerName, pDeck],
    [opponentNames[0], oDeck],
  ]);
  afterEach(() => {
    pDeck = new Deck("Title", false, " ", "pName", "pNick", []);
    oDeck = new OpponentDeck("Title", false, " ", "oName", "oNick", []);
    decks = new Map([
      [playerName, pDeck],
      [opponentNames[0], oDeck],
    ]);
  });

  it("should return results by currentVP if game did not end by resignation.", () => {
    // Arrange - Player deck wins by VP.
    pDeck.currentVP = 20;
    oDeck.currentVP = 10;
    const gameEndReason = "The game has ended.";

    // Act - Get results when player wins by VP.
    let resultMap: Map<number, string[]> = DOMObserver.getResult(
      decks,
      playerName,
      opponentNames,
      gameEndReason
    );

    // Assert
    expect(resultMap).toStrictEqual(
      new Map([
        [1, ["pName"]],
        [2, ["oName"]],
      ])
    );

    // Arrange - Opponent deck wins by VP.
    pDeck.currentVP = 10;
    oDeck.currentVP = 20;

    // Act - Get results when opponent wins by VP.
    resultMap = DOMObserver.getResult(
      decks,
      playerName,
      opponentNames,
      gameEndReason
    );

    // Assert - Verify map is returned as expected.
    expect(resultMap).toStrictEqual(
      new Map([
        [1, ["oName"]],
        [2, ["pName"]],
      ])
    );
  });

  it("should return results by turns if currentVP is tied and the game did not end by resignation.", () => {
    // Arrange - Player wins by turns.
    pDeck.gameTurn = 15;
    oDeck.gameTurn = 16;
    pDeck.currentVP = 10;
    oDeck.currentVP = 10;
    const gameEndReason = "The game has ended.";

    // Act - Simulate getting results when player won by turns.
    let resultMap: Map<number, string[]> = DOMObserver.getResult(
      decks,
      playerName,
      opponentNames,
      gameEndReason
    );

    // Assert - Verify map is returned as expected.
    expect(resultMap).toStrictEqual(
      new Map([
        [1, ["pName"]],
        [2, ["oName"]],
      ])
    );

    // Arrange - Opponent wins by turns.
    pDeck.gameTurn = 16;
    oDeck.gameTurn = 15;

    resultMap = DOMObserver.getResult(
      decks,
      playerName,
      opponentNames,
      gameEndReason
    );

    // Assert - Verify map is returned as expected.
    expect(resultMap).toStrictEqual(
      new Map([
        [1, ["oName"]],
        [2, ["pName"]],
      ])
    );
  });

  it("should return tied results when game turns and VP are equal", () => {
    // Arrange
    const gameEndReason = "The game has ended";
    pDeck.gameTurn = 15;
    oDeck.gameTurn = 15;
    pDeck.currentVP = 20;
    oDeck.currentVP = 20;

    // Act - Simulate getting result when its a tie (equal turns, equal VP, no resignation).
    const resultMap: Map<number, string[]> = DOMObserver.getResult(
      decks,
      playerName,
      opponentNames,
      gameEndReason
    );

    // Assert
    expect(resultMap).toStrictEqual(new Map([[1, ["pName", "oName"]]]));
  });

  it("should return results correctly when player resigns", () => {
    // Arrange
    const gameEndReason = playerName + " has resigned.";

    // Act - Simulate getting the result when the player resigns.
    const resultMap: Map<number, string[]> = DOMObserver.getResult(
      decks,
      playerName,
      opponentNames,
      gameEndReason
    );

    // Assert
    expect(resultMap).toStrictEqual(
      new Map([
        [1, ["oName"]],
        [2, ["pName"]],
      ])
    );
  });

  it("should return results correctly when opponent resigns", () => {
    // Arrange
    const gameEndReason = opponentNames[0] + " has resigned.";

    // Act - Simulate getting the result when the opponent resigns.
    const resultMap: Map<number, string[]> = DOMObserver.getResult(
      decks,
      playerName,
      opponentNames,
      gameEndReason
    );

    // Assert
    expect(resultMap).toStrictEqual(
      new Map([
        [1, ["pName"]],
        [2, ["oName"]],
      ])
    );
  });
});
