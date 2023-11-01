/**
 * @jest-environment jsdom
 */
import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import {
  setOpponentDeck,
  setPlayerDeck,
} from "../../../src/redux/contentSlice";

describe("gameEndObserverFunc", () => {
  // Mock dependencies
  const getTimeOutElements = jest.spyOn(DOMObserver, "getTimeOutElements");
  const getResult = jest
    .spyOn(DOMObserver, "getResult")
    .mockImplementation(() => ["Victor", "Defeated"]);
  const setDecksGameResults = jest.spyOn(DOMObserver, "setDecksGameResults");
  const dispatchUpdatedDecksToRedux = jest.spyOn(
    DOMObserver,
    "dispatchUpdatedDecksToRedux"
  );
  const saveGameData = jest
    .spyOn(DOMObserver, "saveGameData")
    .mockImplementation(() => {
      return new Promise<void>(() => null);
    });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = "";
  });

  it("should collect game end details and call dependencies accordingly when the game end message is 'The game has ended.'", () => {
    // Arrange
    const gameEndElement = document.createElement("game-ended-notification");
    // Create timeOutElements that will be added to the game end element
    const timeoutElement1 = document.createElement("div");
    timeoutElement1.setAttribute("class", "timeout");
    timeoutElement1.innerText = "The game has ended.";
    const timeoutElement2 = document.createElement("div");
    timeoutElement2.setAttribute("class", "timeout");
    timeoutElement2.innerText = "Mock Game End Reason";
    gameEndElement.appendChild(timeoutElement1);
    gameEndElement.appendChild(timeoutElement2);
    document.body.appendChild(gameEndElement);

    // Act - Simulate a mutation in the game end element
    DOMObserver.gameEndObserverFunc();
    
    // Assert
    expect(getTimeOutElements).toBeCalledTimes(1);
    expect(getResult).toBeCalledTimes(1);
    expect(getResult).toBeCalledWith(
      DOMObserver.decks,
      DOMObserver.playerName,
      DOMObserver.opponentName,
      "Mock Game End Reason"
    );
    expect(setDecksGameResults).toBeCalledTimes(1);
    expect(setDecksGameResults).toBeCalledWith(
      "Victor",
      "Defeated",
      DOMObserver.playerName,
      DOMObserver.opponentName,
      DOMObserver.decks
    );
    expect(dispatchUpdatedDecksToRedux).toBeCalledTimes(1);
    expect(dispatchUpdatedDecksToRedux).toBeCalledWith(
      DOMObserver.dispatch!,
      setPlayerDeck,
      setOpponentDeck,
      JSON.parse(JSON.stringify(DOMObserver.decks.get(DOMObserver.playerName))),
      JSON.parse(
        JSON.stringify(DOMObserver.decks.get(DOMObserver.opponentName))
      )
    );
    expect(saveGameData).toBeCalledTimes(1);
    expect(saveGameData).toBeCalledWith(DOMObserver.gameLog, DOMObserver.decks);
  });

  it("should not collect game end details or call dependencies  when the game end message is not 'The game has ended.'", () => {
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
    expect(getTimeOutElements).toBeCalledTimes(1);
    expect(getResult).not.toBeCalled();
    expect(setDecksGameResults).not.toBeCalled();
    expect(dispatchUpdatedDecksToRedux).not.toBeCalled();
    expect(saveGameData).not.toBeCalled();
  });
});
