/**
 * @jest-environment jsdom
 */
import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
describe("playersInitializer, should check if the player-info-element are present and...", () => {
  // Declare reference variables for mock dom elements.
  let playerInfoElement1: HTMLElement;
  let playerInfoNameElement1: HTMLElement;
  let playerInfoElement2: HTMLElement;
  let playerInfoNameElement2: HTMLElement;

  afterEach(() => {
    DOMObserver.resetGame();
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  it("if present and game is rated it should initialize the player related fields", () => {
    // Arrange - Add player info elements to the document
    playerInfoElement1 = document.createElement("player-info");
    playerInfoElement1.style.transform = "translateX(0px) translateY(37.55px)";
    playerInfoNameElement1 = document.createElement("player-info-name");
    playerInfoNameElement1.innerText = "Player Name";
    playerInfoElement2 = document.createElement("player-info");
    playerInfoElement2.style.transform = "translateX(0px) translateY(0.48px)";
    playerInfoNameElement2 = document.createElement("player-info-name");
    playerInfoNameElement2.innerText = "Opponent Name";
    playerInfoElement1.appendChild(playerInfoNameElement1);
    playerInfoElement2.appendChild(playerInfoNameElement2);
    document.body.appendChild(playerInfoElement1);
    document.body.appendChild(playerInfoElement2);

    DOMObserver.gameLog =
      "Game #133322335, rated.\nPlayer Name: 123.45\nOpponent Name: 543.21\nCard Pool: level 1\nP starts with 7 Coppers.\nP starts with 3 Estates.\nO starts with 7 Coppers.\nO starts with 3 Estates.";
    DOMObserver.ratedGame = true;

    // Act - Simulate calling the playersInitializer.
    DOMObserver.playersInitializer();
    expect(DOMObserver.playerName).toBe("Player Name");
    expect(DOMObserver.opponentNames).toStrictEqual(["Opponent Name"]);
    expect(DOMObserver.playerRating).toBe("123.45");
    expect(DOMObserver.opponentRatings).toStrictEqual(["543.21"]);
    expect(DOMObserver.playerNick).toBe("P");
    expect(DOMObserver.opponentNicks).toStrictEqual(["O"]);
    expect(DOMObserver.playersInitialized).toStrictEqual(true);
  });

  it("if present and game is not rated it should initialize the player related fields, but not the ratings.", () => {
    // Arrange - Add player info elements to the document
    playerInfoElement1 = document.createElement("player-info");
    playerInfoElement1.style.transform = "translateX(0px) translateY(37.55px)";
    playerInfoNameElement1 = document.createElement("player-info-name");
    playerInfoNameElement1.innerText = "Player Name";
    playerInfoElement2 = document.createElement("player-info");
    playerInfoElement2.style.transform = "translateX(0px) translateY(0.48px)";
    playerInfoNameElement2 = document.createElement("player-info-name");
    playerInfoNameElement2.innerText = "Opponent Name";
    playerInfoElement1.appendChild(playerInfoNameElement1);
    playerInfoElement2.appendChild(playerInfoNameElement2);
    document.body.appendChild(playerInfoElement1);
    document.body.appendChild(playerInfoElement2);

    DOMObserver.gameLog =
      "Game #133322335, unrated.\nCard Pool: level 1\nP starts with 7 Coppers.\nP starts with 3 Estates.\nO starts with 7 Coppers.\nO starts with 3 Estates.";
    DOMObserver.ratedGame = false;

    // Act - Simulate calling the playersInitializer.
    DOMObserver.playersInitializer();
    expect(DOMObserver.playerName).toBe("Player Name");
    expect(DOMObserver.opponentNames).toStrictEqual(["Opponent Name"]);
    expect(DOMObserver.playerRating).toBe("");
    expect(DOMObserver.opponentRatings).toStrictEqual([]);
    expect(DOMObserver.playerNick).toBe("P");
    expect(DOMObserver.opponentNicks).toStrictEqual(["O"]);
    expect(DOMObserver.playersInitialized).toBe(true);
  });

  it("if not present it should not initialize player related fields.", () => {
    // Arrange a scenario where the player elements are not present.
    DOMObserver.ratedGame = false;

    // Act - Simulate calling the playersInitializer.
    DOMObserver.playersInitializer();

    // Assert
    expect(DOMObserver.playerName).toBe("");
    expect(DOMObserver.opponentNames).toStrictEqual([]);
    expect(DOMObserver.playerRating).toBe("");
    expect(DOMObserver.opponentRatings).toStrictEqual([]);
    expect(DOMObserver.playerNick).toBe("");
    expect(DOMObserver.opponentNicks).toStrictEqual([]);
    expect(DOMObserver.playersInitialized).toBe(false);
  });
});
