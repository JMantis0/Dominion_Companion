/**
 * @jest-environment jsdom
 */
import { describe, it, expect, jest } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
describe("deckMapInitializer", () => {
  // Mock dependencies
  const createPlayerDecks = jest.spyOn(DOMObserver, "createPlayerDecks");
  const setDecks = jest.spyOn(DOMObserver, "setDecks");
  it("should create the player and opponent decks and assign them to the decks field if the players and kingdom are initialized.", () => {
    // Arrange scenario where the players have been initialized and the kingdom has been initialized.
    const ratedGame = false;
    const playerName = "Player";
    const playerNick = "P";
    const playerRating = "PRating";
    const opponentName = "Opponent";
    const opponentNick = "O";
    const opponentRating = "ORating";
    const kingdom = ["Card1", "Card2"];

    DOMObserver.gameLog = "Game #123456789, unrated";
    DOMObserver.ratedGame = ratedGame;
    DOMObserver.playerName = playerName;
    DOMObserver.playerNick = playerNick;
    DOMObserver.playerRating = playerRating;
    DOMObserver.opponentName = opponentName;
    DOMObserver.opponentNick = opponentNick;
    DOMObserver.opponentRating = opponentRating;
    DOMObserver.kingdom = kingdom;
    DOMObserver.playersInitialized = true;
    DOMObserver.kingdomInitialized = true;

    // Act - Simulate calling the deckMapInitializer
    DOMObserver.deckMapInitializer();

    // Assert
    expect(createPlayerDecks).toBeCalledTimes(1);
    expect(createPlayerDecks).toBeCalledWith(
      "Game #123456789",
      ratedGame,
      playerName,
      playerNick,
      playerRating,
      opponentName,
      opponentNick,
      opponentRating,
      kingdom
    );
    expect(setDecks).toBeCalledTimes(1);
    expect(setDecks).toBeCalledWith(
      DOMObserver.createPlayerDecks(
        "Game #123456789",
        ratedGame,
        playerName,
        playerNick,
        playerRating,
        opponentName,
        opponentNick,
        opponentRating,
        kingdom
      )
    );
  });

  it("should not create the player and opponent decks if the players are not initialized.", () => {
    // Arrange scenario where the players are not been initialized.
    DOMObserver.playersInitialized = false;
    DOMObserver.kingdomInitialized = true;

    // Act - Simulate calling the deckMapInitializer
    DOMObserver.deckMapInitializer();

    // Assert
    expect(createPlayerDecks).not.toBeCalled();
    expect(setDecks).not.toBeCalled();
  });

  it("should not create the player and opponent decks if the kingdom is not initialized.", () => {
    // Arrange scenario where the kingdom is not initialized.
    DOMObserver.playersInitialized = true;
    DOMObserver.kingdomInitialized = false;

    // Act - Simulate calling the deckMapInitializer
    DOMObserver.deckMapInitializer();

    // Assert
    expect(createPlayerDecks).not.toBeCalled();
    expect(setDecks).not.toBeCalled();
  });

  it("should not create the player and opponent decks if the players and the kingdom are not initialized.", () => {
    // Arrange scenario where the players and kingdom are not initialized
    DOMObserver.playersInitialized = false;
    DOMObserver.kingdomInitialized = false;

    // Act - Simulate calling the deckMapInitializer
    DOMObserver.deckMapInitializer();

    // Assert
    expect(createPlayerDecks).not.toBeCalled();
    expect(setDecks).not.toBeCalled();
  });
});
