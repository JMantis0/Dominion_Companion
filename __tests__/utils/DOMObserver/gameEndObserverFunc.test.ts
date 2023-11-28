/**
 * @jest-environment jsdom
 */
import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";

import { OpponentDeck } from "../../../src/model/opponentDeck";
import { Deck } from "../../../src/model/deck";
import { DOMStore } from "../../../src/utils";
import { configureStore } from "@reduxjs/toolkit";
import contentSlice from "../../../src/redux/contentSlice";
import optionsSlice from "../../../src/redux/optionsSlice";

describe("gameEndObserverFunc", () => {
  // Mock dependencies
  let gameEndElement: HTMLElement;
  let timeOutElement1: HTMLElement;
  let timeOutElement2: HTMLElement;
  let decks: Map<string, Deck | OpponentDeck>;
  let pDeck: Deck;
  let oDeck: OpponentDeck;
  let storeMock: DOMStore;

  const saveGameData = jest
    .spyOn(DOMObserver, "saveGameData")
    .mockImplementation(() => {
      return new Promise<void>(() => null);
    });

  beforeEach(() => {
    document.body.innerHTML = "";
    pDeck = new Deck("", false, " ", "pName", "pNick", []);
    oDeck = new OpponentDeck("", false, " ", "oName", "oNick", []);
    decks = new Map();
    decks.set("pName", pDeck);
    decks.set("oName", oDeck);
    // Create a new store instance for DOMObserver
    storeMock = configureStore({
      reducer: { content: contentSlice, options: optionsSlice },
      middleware: [],
    });
    // Set DOMObserver to use the mock store and mock dispatch
    DOMObserver.decks = decks;
    DOMObserver.playerName = "pName";
    DOMObserver.opponentNames = ["oName"];
    DOMObserver.setStore(storeMock);
    DOMObserver.setDispatch(storeMock.dispatch);
    jest.clearAllMocks();
  });

  it("should collect game end details and call dependencies accordingly when the game end message is 'The game has ended.'", () => {
    // Arrange
    gameEndElement = document.createElement("game-ended-notification");
    // Create timeOutElements that will be added to the game end element
    timeOutElement1 = document.createElement("div");
    timeOutElement1.setAttribute("class", "timeout");
    timeOutElement1.innerText = "The game has ended.";
    timeOutElement2 = document.createElement("div");
    timeOutElement2.setAttribute("class", "timeout");
    timeOutElement2.innerText = "Mock Game End Reason";
    gameEndElement.appendChild(timeOutElement1);
    gameEndElement.appendChild(timeOutElement2);
    document.body.appendChild(gameEndElement);

    // Mock result 3 game results.
    jest
      .spyOn(DOMObserver, "getResult")
      .mockReturnValueOnce({ victor: "pName", defeated: ["oName"] })
      .mockReturnValueOnce({ victor: "oName", defeated: ["pName"] })
      .mockReturnValueOnce({victor:"None: tie", defeated:["None:tie"]});

    // Act - Simulate game end with player as the victor.
    DOMObserver.gameEndObserverFunc();

    // Assert - Verify Redux state and decks properly updated
    expect(storeMock.getState().content.playerDeck.gameResult).toBe("Victory");
    expect(storeMock.getState().content.opponentDecks[0].gameResult).toBe("Defeat");
    expect(saveGameData).toBeCalledWith(DOMObserver.gameLog, DOMObserver.decks);

    // 2nd act - Simulate game end with opponent as the victor.
    DOMObserver.gameEndObserverFunc();

    // Assert - Verify Redux state and decks properly updated
    expect(storeMock.getState().content.playerDeck.gameResult).toBe("Defeat");
    expect(storeMock.getState().content.opponentDecks[0].gameResult).toBe(
      "Victory"
    );
    expect(saveGameData).toBeCalledWith(DOMObserver.gameLog, DOMObserver.decks);

    // 3rd act - Simulate game end with a tie.
    DOMObserver.gameEndObserverFunc();

    // Assert - Verify Redux state and decks properly updated
    expect(storeMock.getState().content.playerDeck.gameResult).toBe("Tie");
    expect(storeMock.getState().content.opponentDecks[0].gameResult).toBe("Tie");
    expect(saveGameData).toBeCalledWith(DOMObserver.gameLog, DOMObserver.decks);
  });

  it("should not collect game end details or call dependencies  when the game end message is not 'The game has ended.'", () => {
    const getResult = jest.spyOn(DOMObserver, "getResult");
    const setDecksGameResults = jest.spyOn(DOMObserver, "setDecksGameResults");
    const dispatchUpdatedDecksToRedux = jest.spyOn(
      DOMObserver,
      "dispatchUpdatedDecksToRedux"
    );
    // Arrange
    const gameEndElement = document.createElement("game-ended-notification");
    // Create timeOutElements that will be added to the game end element
    const timeoutElement1 = document.createElement("div");
    timeoutElement1.setAttribute("class", "timeout");
    timeoutElement1.innerText = "Some other message."; // Text is not "The game has ended."
    const timeoutElement2 = document.createElement("div");
    timeoutElement2.setAttribute("class", "timeout");
    timeoutElement2.innerText = "Mock Game End Reason";
    document.body.appendChild(gameEndElement);
    gameEndElement.appendChild(timeoutElement2);

    // Act - Simulate a mutation in the game end element when the game end message is not "The game has ended."
    DOMObserver.gameEndObserverFunc();

    // Assert
    expect(getResult).not.toBeCalled();
    expect(setDecksGameResults).not.toBeCalled();
    expect(dispatchUpdatedDecksToRedux).not.toBeCalled();
    expect(saveGameData).not.toBeCalled();
  });
});
