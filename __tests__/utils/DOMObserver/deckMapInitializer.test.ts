/**
 * @jest-environment jsdom
 */
import { describe, it, expect,  afterEach } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import { Deck } from "../../../src/model/deck";
import { OpponentDeck } from "../../../src/model/opponentDeck";
describe("deckMapInitializer", () => {

  afterEach(() => {
    DOMObserver.resetGame();
  });

  it("should create the player and opponent decks and assign them to the decks field if the players and kingdom are initialized.", () => {
    // Arrange scenario where the players have been initialized and the kingdom has been initialized.
    const ratedGame = false;
    const playerName = "Player";
    const playerNick = "P";
    const playerRating = "PRating";
    const opponentName = ["Opponent"];
    const opponentNick = ["O"];
    const opponentRating = ["ORating"];
    const kingdom = ["Card1", "Card2"];

    DOMObserver.gameLog = "Game #123456789, unrated";
    DOMObserver.ratedGame = ratedGame;
    DOMObserver.playerName = playerName;
    DOMObserver.playerNick = playerNick;
    DOMObserver.playerRating = playerRating;
    DOMObserver.opponentNames = opponentName;
    DOMObserver.opponentNicks = opponentNick;
    DOMObserver.opponentRatings = opponentRating;
    DOMObserver.kingdom = kingdom;
    DOMObserver.playersInitialized = true;
    DOMObserver.kingdomInitialized = true;

    // Act - Simulate calling the deckMapInitializer
    DOMObserver.deckMapInitializer();

    const expectedDeckMap = new Map([
      [
        "Player",
        new Deck("Game #123456789", false, "PRating", "Player", "P", [
          "Card1",
          "Card2",
        ]),
      ],
      [
        "Opponent",
        new OpponentDeck("Game #123456789", false, "ORating", "Opponent", "O", [
          "Card1",
          "Card2",
        ]),
      ],
    ]);
    // Assert
    expect(DOMObserver.decks).toStrictEqual(expectedDeckMap);
  });

  it("should not create the player and opponent decks if the players are not initialized.", () => {
    // Arrange scenario where the players are not been initialized.
    DOMObserver.playersInitialized = false;
    DOMObserver.kingdomInitialized = true;

    // Act - Simulate calling the deckMapInitializer
    DOMObserver.deckMapInitializer();

    // Assert
    expect(DOMObserver.decks).toStrictEqual(
      new Map([
        ["", new Deck("", false, "", "", "", [])],
        ["", new OpponentDeck("", false, "", "", "", [])],
      ])
    );
  });

  it("should not create the player and opponent decks if the kingdom is not initialized.", () => {
    // Arrange scenario where the kingdom is not initialized.
    DOMObserver.playersInitialized = true;
    DOMObserver.kingdomInitialized = false;

    // Act - Simulate calling the deckMapInitializer
    DOMObserver.deckMapInitializer();

    // Assert
    expect(DOMObserver.decks).toStrictEqual(
      new Map([
        ["", new Deck("", false, "", "", "", [])],
        ["", new OpponentDeck("", false, "", "", "", [])],
      ])
    );
  });

  it("should not create the player and opponent decks if the players and the kingdom are not initialized.", () => {
    // Arrange scenario where the players and kingdom are not initialized
    DOMObserver.playersInitialized = false;
    DOMObserver.kingdomInitialized = false;

    // Act - Simulate calling the deckMapInitializer
    DOMObserver.deckMapInitializer();

    // Assert
    expect(DOMObserver.decks).toStrictEqual(
      new Map([
        ["", new Deck("", false, "", "", "", [])],
        ["", new OpponentDeck("", false, "", "", "", [])],
      ])
    );
  });
});
