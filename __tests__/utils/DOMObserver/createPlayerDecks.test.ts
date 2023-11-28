import { expect, describe, it } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("createPlayerDecks", () => {
  it("should use the given arguments to construct a Deck object for the player, an OpponentDeck object for the opponent, and return them in a Map.", () => {
    // Arrange
    DOMObserver.gameLog = "Game #1234, unrated.";
    DOMObserver.ratedGame = false;
    DOMObserver.kingdom = ["Card1", "Card2", "Card3", "Card4"];
    DOMObserver.playerRating = "1000";
    DOMObserver.playerName = "pName";
    DOMObserver.playerNick = "pNick";
    DOMObserver.opponentNames = ["oName"];
    DOMObserver.opponentNicks = ["oNick"];
    DOMObserver.opponentRatings = ["3000"];

    const pDeck = new Deck(
      "Game #1234",
      DOMObserver.ratedGame,
      DOMObserver.playerRating,
      DOMObserver.playerName,
      DOMObserver.playerNick,
      DOMObserver.kingdom
    );
    const oDeck = new OpponentDeck(
      "Game #1234",
      DOMObserver.ratedGame,
      DOMObserver.opponentRatings[0],
      DOMObserver.opponentNames[0],
      DOMObserver.opponentNicks[0],
      DOMObserver.kingdom
    );
    // Manually create the expected map
    const expectedMap = new Map([
      [DOMObserver.playerName, pDeck],
      [DOMObserver.opponentNames[0], oDeck],
    ]);

    // Assert - Simulating creating a deck with the given parameters.  Compare the manually constructed map to the returned map.
    expect(DOMObserver.createPlayerDecks()).toStrictEqual(expectedMap);
  });
});
