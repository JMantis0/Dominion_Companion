/**
 * @jest-environment jsdom
 */
import { describe, jest, it, expect, beforeEach } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import contentSlice from "../../../src/redux/contentSlice";
import { DOMStore } from "../../../src/utils";
import { configureStore } from "@reduxjs/toolkit";
import optionsSlice from "../../../src/redux/optionsSlice";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { Deck } from "../../../src/model/deck";

describe("logObserverFunc", () => {
  // Mock dependencies
  let storeMock: DOMStore;
  let gameLogElement: HTMLElement;
  const getNewLogsAndUpdateDecks = jest.spyOn(
    DOMObserver,
    "getNewLogsAndUpdateDecks"
  );
  const dispatchUpdatedDecksToRedux = jest.spyOn(
    DOMObserver,
    "dispatchUpdatedDecksToRedux"
  );

  beforeEach(() => {
    DOMObserver.resetGame();
    DOMObserver.decks = new Map([
      ["pName", new Deck("", false, "", "pName", "p", ["Copper"])],
      ["oName", new OpponentDeck("", false, "", "oName", "o", ["Copper"])],
    ]);
    DOMObserver.playerName = "pName";
    DOMObserver.opponentNames = ["oName"];
    storeMock = configureStore({
      reducer: { content: contentSlice, options: optionsSlice },
      middleware: [],
    });
    // Set DOMObserver to use the mock store and mock dispatch
    DOMObserver.store = storeMock;
    DOMObserver.dispatch = storeMock.dispatch;
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  it("should not trigger any updates if there are no new logs to send", () => {
    // Arrange a scenario where there are no new logs to send
    gameLogElement = document.createElement("div");
    gameLogElement.classList.add("game-log");
    gameLogElement.innerText = "Log1";
    document.body.appendChild(gameLogElement);

    DOMObserver.logsProcessed = "Log1";
    const expectedDecks = new Map(DOMObserver.decks);

    // Act - simulate a mutation in the game log element when there are no new logs to process
    DOMObserver.logObserverFunc();

    // Assert
    expect(getNewLogsAndUpdateDecks).not.toBeCalled();
    expect(dispatchUpdatedDecksToRedux).not.toBeCalled();
    // Verify the decks field did not change
    expect(DOMObserver.decks).toStrictEqual(expectedDecks);
  });

  it("should update the class decks and dispatch their store decks to redux, and update the game log", () => {
    // Arrange a scenario where there are some new logs to send
    gameLogElement = document.createElement("div");
    gameLogElement.classList.add("game-log");
    gameLogElement.innerText =
      "Log1\no buys and gains a Copper.\nLog3\np buys and gains a Copper.";
    document.body.appendChild(gameLogElement);

    DOMObserver.logsProcessed = "Log1";
    // Create two decks for comparison with the class decks
    const expectedDeck = new Deck("", false, "", "pName", "p", ["Copper"]);
    const expectedOpponentDeck = new OpponentDeck("", false, "", "oName", "o", [
      "Copper",
    ]);
    expectedDeck.update(
      "o buys and gains a Copper.\nLog3\np buys and gains a Copper.".split("\n")
    );
    expectedOpponentDeck.update(
      "o buys and gains a Copper.\nLog3\np buys and gains a Copper.".split("\n")
    );

    // Act - simulate a mutation in the game log element when there are some new logs to process
    DOMObserver.logObserverFunc();

    // Assert - Verify the deck map field for DOMObserver is updated correctly
    expect(DOMObserver.decks.get("pName")).toStrictEqual(expectedDeck);
    expect(DOMObserver.decks.get("oName")).toStrictEqual(expectedOpponentDeck);
    // Verify the redux state was updated correctly
    expect(storeMock.getState().content.playerDeck).toStrictEqual(
      JSON.parse(JSON.stringify(expectedDeck))
    );
    expect(storeMock.getState().content.opponentDecks).toStrictEqual([
      JSON.parse(JSON.stringify(expectedOpponentDeck)),
    ]);
    // Verify the logsProcessed field was updated correctly.
    expect(DOMObserver.logsProcessed).toBe(
      "Log1\no buys and gains a Copper.\nLog3\np buys and gains a Copper."
    );
  });
});
