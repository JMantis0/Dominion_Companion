import { expect, describe, it } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("createPlayerDecks", () => {
  it("should use the given arguments to construct a Deck object for the player, an OpponentDeck object for the opponent, and return them in a Map.", () => {
    // Arrange
    const [gameTitle, ratedGame, kingdom] = [
      "Game# 1234",
      false,
      ["Card1", "Card2", "Card3", "Card4"],
    ];
    const [playerName, playerNick, playerRating] = ["pName", "pNick", "1000"];
    const [opponentName, opponentNick, opponentRating] = [
      "oName",
      "oNick",
      "3000",
    ];
    const pDeck = new Deck(
      gameTitle,
      ratedGame,
      playerRating,
      playerName,
      playerNick,
      kingdom
    );
    const oDeck = new OpponentDeck(
      gameTitle,
      ratedGame,
      opponentRating,
      opponentName,
      opponentNick,
      kingdom
    );
    // Manually create the expected map
    const expectedMap = new Map([
      [playerName, pDeck],
      [opponentName, oDeck],
    ]);

    // Assert - Simulating creating a deck with the given parameters.  Compare the manually constructed map to the returned map.
    expect(
      DOMObserver.createPlayerDecks(
        gameTitle,
        ratedGame,
        playerName,
        playerNick,
        playerRating,
        opponentName,
        opponentNick,
        opponentRating,
        kingdom
      )
    ).toStrictEqual(expectedMap);
  });
});
