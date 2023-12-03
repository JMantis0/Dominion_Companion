/**
 * @jest-environment jsdom
 */
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import contentSlice, {
  setBaseOnly,
  setError,
  setOpponentDecks,
  setPlayerDeck,
} from "../../../src/redux/contentSlice";
import { DOMStore } from "../../../src/utils";
import { configureStore } from "@reduxjs/toolkit";
import optionsSlice from "../../../src/redux/optionsSlice";
import { Deck } from "../../../src/model/deck";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { EmptyDeck } from "../../../src/model/emptyDeck";
import { EmptyOpponentDeck } from "../../../src/model/emptyOpponentDeck";

describe("initIntervalCallback", () => {
  // Mock dependencies
  let storeMock: DOMStore;
  let gameLogElement: HTMLElement;
  let playerInfoElement1: HTMLElement;
  let playerInfoNameElement1: HTMLElement;
  let playerInfoElement2: HTMLElement;
  let playerInfoNameElement2: HTMLElement;
  let kingdomViewerElement: HTMLElement;
  let cardStacksElement: HTMLElement;
  let nameElement1: HTMLElement;
  let nameElement2: HTMLElement;
  let nameElement3: HTMLElement;
  let nameElement4: HTMLElement;
  let nameElement5: HTMLElement;
  let gameEndElement: HTMLElement;
  let logContainerElement: HTMLElement;

  // Declare references for the MutationObservers
  let undoObserver: MutationObserver;
  let gameEndObserver: MutationObserver;
  let gameLogObserver: MutationObserver;

  // Spy on the MutationObserver's observe method
  const observe = jest.spyOn(MutationObserver.prototype, "observe");
  const clearInterval = jest
    .spyOn(global, "clearInterval")
    .mockImplementation(() => {});
  const saveGameData = jest
    .spyOn(DOMObserver, "saveGameData")
    .mockImplementation(() => {
      return new Promise<void>(() => {});
    });
  const setInterval = jest.spyOn(global, "setInterval");

  beforeEach(() => {
    DOMObserver.resetGame();
    // Create a new store instance for DOMObserver
    storeMock = configureStore({
      reducer: { content: contentSlice, options: optionsSlice },
      middleware: [],
    });
    // Set DOMObserver to use the mock store and mock dispatch
    DOMObserver.setStore(storeMock);
    DOMObserver.setDispatch(storeMock.dispatch);

    // Populate the DOMObserver fields and redux state with values that need to be reset by resetGame.
    DOMObserver.undoObserver = undefined;
    DOMObserver.gameEndObserver = undefined;
    DOMObserver.gameLogObserver = undefined;
    DOMObserver.playersInitialized = true;
    DOMObserver.logInitialized = true;
    DOMObserver.kingdomInitialized = true;
    DOMObserver.decksInitialized = true;
    DOMObserver.logsProcessed = "Log1\nLog2\nLog3\nLog4";
    DOMObserver.gameLog = "Log1\nLog2\nLog3\nLog4";
    DOMObserver.playerName = "Player Name";
    DOMObserver.playerNick = "P";
    DOMObserver.playerRating = "321";
    DOMObserver.opponentNames = ["Opponent Name"];
    DOMObserver.opponentNicks = ["O"];
    DOMObserver.opponentRatings = ["123"];
    DOMObserver.decks = new Map([
      [
        DOMObserver.playerName,
        new Deck("Title", false, "321", DOMObserver.playerName, "P", []),
      ],
      [
        DOMObserver.opponentNames[0],
        new OpponentDeck(
          "",
          false,
          "123",
          DOMObserver.opponentNames[0],
          "O",
          []
        ),
      ],
    ]);
    DOMObserver.kingdom = ["Card1", "Card2"];
    DOMObserver.baseOnly = false;
    DOMObserver.gameEndObserver = new MutationObserver(() => null);
    DOMObserver.gameEndObserver.observe(document.body, { childList: true });
    DOMObserver.gameLogObserver = new MutationObserver(() => null);
    DOMObserver.gameLogObserver.observe(document.body, { childList: true });
    DOMObserver.undoObserver = new MutationObserver(() => null);
    DOMObserver.undoObserver.observe(document.body, { childList: true });
    // Populate store with values that will need to be reset.
    storeMock.dispatch(
      setPlayerDeck(
        JSON.parse(
          JSON.stringify(DOMObserver.decks.get(DOMObserver.playerName))
        )
      )
    );
    storeMock.dispatch(
      setOpponentDecks([
        JSON.parse(
          JSON.stringify(DOMObserver.decks.get(DOMObserver.opponentNames[0]))
        ),
      ])
    );
    storeMock.dispatch(setBaseOnly(false));
    storeMock.dispatch(setError("MockError"));
    // Clear the DOM
    document.body.innerHTML = "";
    jest.clearAllMocks();
  });

  it("should call the DOM initializer methods, and then if the initializations are successful, and the kingdom is baseOnly, it should initialize the mutationObservers and decks.", () => {
    // Arrange - add the game-log element to the document.
    gameLogElement = document.createElement("div");
    gameLogElement.classList.add("game-log");
    gameLogElement.innerText =
      "Game #133465515, rated.\nPlayer: 123.45\nOpponent: 543.21\n\nCard Pool: level 1\nP starts with 7 Coppers.\nP starts with 3 Estates.\nO starts with 7 Coppers.\nO starts with 3 Estates.";
    logContainerElement = document.createElement("div");
    logContainerElement.setAttribute("class", "log-container");
    logContainerElement.appendChild(gameLogElement);
    document.body.appendChild(logContainerElement);

    // Add <player-info> and <player-info-name> elements to the document
    playerInfoElement1 = document.createElement("player-info");
    playerInfoElement1.style.transform = "translateX(0px) translateY(37.55px)";
    playerInfoNameElement1 = document.createElement("player-info-name");
    playerInfoNameElement1.innerText = "Player";
    playerInfoElement2 = document.createElement("player-info");
    playerInfoElement2.style.transform = "translateX(0px) translateY(0.48px)";
    playerInfoNameElement2 = document.createElement("player-info-name");
    playerInfoNameElement2.innerText = "Opponent";
    playerInfoElement1.appendChild(playerInfoNameElement1);
    playerInfoElement2.appendChild(playerInfoNameElement2);
    document.body.appendChild(playerInfoElement1);
    document.body.appendChild(playerInfoElement2);

    // Add kingdom-viewer-group and name-layer elements to the document.
    nameElement1 = document.createElement("div");
    nameElement1.classList.add("name-layer");
    nameElement2 = document.createElement("div");
    nameElement2.classList.add("name-layer");
    nameElement3 = document.createElement("div");
    nameElement3.classList.add("name-layer");
    nameElement4 = document.createElement("div");
    nameElement4.classList.add("name-layer");
    nameElement5 = document.createElement("div");
    nameElement5.classList.add("name-layer");
    nameElement1.innerText = "Vassal";
    nameElement2.innerText = "Bureaucrat";
    nameElement3.innerText = "Sentry";
    nameElement4.innerText = "Market";
    nameElement5.innerText = "Chapel";
    kingdomViewerElement = document.createElement("div");
    kingdomViewerElement.classList.add("kingdom-viewer-group");
    cardStacksElement = document.createElement("div");
    cardStacksElement.classList.add("card-stacks");
    cardStacksElement.appendChild(nameElement1);
    cardStacksElement.appendChild(nameElement2);
    cardStacksElement.appendChild(nameElement3);
    cardStacksElement.appendChild(nameElement4);
    cardStacksElement.appendChild(nameElement5);
    document.body.appendChild(kingdomViewerElement);
    document.body.appendChild(cardStacksElement);

    // Add game end element to document for MutationObserver
    gameEndElement = document.createElement("game-ended-notification");
    document.body.appendChild(gameEndElement);

    // Create a deck map for Assertions.
    const expectedDeck = new Deck(
      "Game #133465515",
      true,
      "123.45",
      "Player",
      "P",
      ["Vassal", "Bureaucrat", "Sentry", "Market", "Chapel"]
    );

    const expectedOpponentDeck = new OpponentDeck(
      "Game #133465515",
      true,
      "543.21",
      "Opponent",
      "O",
      ["Vassal", "Bureaucrat", "Sentry", "Market", "Chapel"]
    );

    // Update the expected decks with the gameLog
    expectedDeck.update(
      "Game #133465515, rated.\nPlayer: 123.45\nOpponent: 543.21\n\nCard Pool: level 1\nP starts with 7 Coppers.\nP starts with 3 Estates.\nO starts with 7 Coppers.\nO starts with 3 Estates.".split(
        "\n"
      )
    );
    expectedOpponentDeck.update(
      "Game #133465515, rated.\nPlayer: 123.45\nOpponent: 543.21\n\nCard Pool: level 1\nP starts with 7 Coppers.\nP starts with 3 Estates.\nO starts with 7 Coppers.\nO starts with 3 Estates.".split(
        "\n"
      )
    );

    const expectedDeckMap = new Map([
      ["Player", expectedDeck],
      ["Opponent", expectedOpponentDeck],
    ]);
    // Create MutationObservers for  Assertions
    undoObserver = new MutationObserver(DOMObserver.undoObserverFunc);
    gameEndObserver = new MutationObserver(DOMObserver.gameEndObserverFunc);
    gameLogObserver = new MutationObserver(DOMObserver.logObserverFunc);

    // Act - simulate calling the initIntervalCallback.
    DOMObserver.initIntervalCallback();

    // Assert
    expect(DOMObserver.gameLog).toBe(
      "Game #133465515, rated.\nPlayer: 123.45\nOpponent: 543.21\n\nCard Pool: level 1\nP starts with 7 Coppers.\nP starts with 3 Estates.\nO starts with 7 Coppers.\nO starts with 3 Estates."
    );
    expect(DOMObserver.ratedGame).toBe(true);
    expect(DOMObserver.logInitialized).toBe(true);
    expect(DOMObserver.playerName).toBe("Player");
    expect(DOMObserver.opponentNames).toStrictEqual(["Opponent"]);
    expect(DOMObserver.playerNick).toBe("P");
    expect(DOMObserver.opponentNicks).toStrictEqual(["O"]);
    expect(DOMObserver.playerRating).toBe("123.45");
    expect(DOMObserver.opponentRatings).toStrictEqual(["543.21"]);
    expect(DOMObserver.playersInitialized).toBe(true);
    expect(DOMObserver.kingdom).toStrictEqual([
      "Vassal",
      "Bureaucrat",
      "Sentry",
      "Market",
      "Chapel",
    ]);
    expect(DOMObserver.baseOnly).toBe(true);
    expect(DOMObserver.store.getState().content.baseOnly).toBe(true);
    expect(DOMObserver.kingdomInitialized).toBe(true);
    expect(DOMObserver.decks).toStrictEqual(expectedDeckMap);
    expect(DOMObserver.decksInitialized).toBe(true);
    expect(DOMObserver.store.getState().content.gameActiveStatus).toBe(true);
    expect(DOMObserver.gameEndObserver).toStrictEqual(gameEndObserver);
    expect(DOMObserver.gameLogObserver).toStrictEqual(gameLogObserver);
    expect(DOMObserver.undoObserver).toStrictEqual(undoObserver);
    expect(observe).nthCalledWith(1, logContainerElement, {
      childList: true,
      subtree: true,
    });
    expect(observe).nthCalledWith(2, gameLogElement, {
      childList: true,
      subtree: true,
    });
    expect(observe).nthCalledWith(3, gameEndElement, {
      childList: true,
      subtree: true,
    });
    expect(DOMObserver.store.getState().content.playerDeck).toStrictEqual(
      JSON.parse(JSON.stringify(expectedDeck))
    );
    expect(DOMObserver.store.getState().content.opponentDecks).toStrictEqual([
      JSON.parse(JSON.stringify(expectedOpponentDeck)),
    ]);
    expect(DOMObserver.decks).toStrictEqual(expectedDeckMap);
    expect(DOMObserver.logsProcessed).toBe(
      "Game #133465515, rated.\nPlayer: 123.45\nOpponent: 543.21\n\nCard Pool: level 1\nP starts with 7 Coppers.\nP starts with 3 Estates.\nO starts with 7 Coppers.\nO starts with 3 Estates."
    );
    expect(saveGameData).toBeCalledWith(
      "Game #133465515, rated.\nPlayer: 123.45\nOpponent: 543.21\n\nCard Pool: level 1\nP starts with 7 Coppers.\nP starts with 3 Estates.\nO starts with 7 Coppers.\nO starts with 3 Estates.",
      expectedDeckMap
    );
    expect(clearInterval).toBeCalledWith(DOMObserver.initInterval);
    expect(setInterval).toBeCalledWith(
      DOMObserver.resetCheckIntervalCallback,
      1000
    );
  });

  it("should call the DOM initializer methods, and if they're successful, but the kingdom is not base only, should not initialize the mutationObservers, dispatch any redux action, call the logObserverCallback, or save the game data.", () => {
    // Assert
    // Arrange - add the game-log element to the document.
    gameLogElement = document.createElement("div");
    gameLogElement.classList.add("game-log");
    gameLogElement.innerText =
      "Game #133465515, rated.\nPlayer: 123.45\nOpponent: 543.21\n\nCard Pool: level 1\nP starts with 7 Coppers.\nP starts with 3 Estates.\nO starts with 7 Coppers.\nO starts with 3 Estates.";
    logContainerElement = document.createElement("div");
    logContainerElement.setAttribute("class", "log-container");
    logContainerElement.appendChild(gameLogElement);
    document.body.appendChild(logContainerElement);

    // Add <player-info> and <player-info-name> elements to the document
    playerInfoElement1 = document.createElement("player-info");
    playerInfoElement1.style.transform = "translateX(0px) translateY(37.55px)";
    playerInfoNameElement1 = document.createElement("player-info-name");
    playerInfoNameElement1.innerText = "Player";
    playerInfoElement2 = document.createElement("player-info");
    playerInfoElement2.style.transform = "translateX(0px) translateY(0.48px)";
    playerInfoNameElement2 = document.createElement("player-info-name");
    playerInfoNameElement2.innerText = "Opponent";
    playerInfoElement1.appendChild(playerInfoNameElement1);
    playerInfoElement2.appendChild(playerInfoNameElement2);
    document.body.appendChild(playerInfoElement1);
    document.body.appendChild(playerInfoElement2);

    // Add kingdom-viewer-group and name-layer elements to the document.
    nameElement1 = document.createElement("div");
    nameElement1.classList.add("name-layer");
    nameElement2 = document.createElement("div");
    nameElement2.classList.add("name-layer");
    nameElement3 = document.createElement("div");
    nameElement3.classList.add("name-layer");
    nameElement4 = document.createElement("div");
    nameElement4.classList.add("name-layer");
    nameElement5 = document.createElement("div");
    nameElement5.classList.add("name-layer");
    // Set the kingdom name elements to non-base card values.
    nameElement1.innerText = "Vampire";
    nameElement2.innerText = "Ogre";
    nameElement3.innerText = "Plebeian";
    nameElement4.innerText = "Lancer";
    nameElement5.innerText = "Minstrel";
    kingdomViewerElement = document.createElement("div");
    kingdomViewerElement.classList.add("kingdom-viewer-group");
    cardStacksElement = document.createElement("div");
    cardStacksElement.classList.add("card-stacks");
    cardStacksElement.appendChild(nameElement1);
    cardStacksElement.appendChild(nameElement2);
    cardStacksElement.appendChild(nameElement3);
    cardStacksElement.appendChild(nameElement4);
    cardStacksElement.appendChild(nameElement5);
    document.body.appendChild(kingdomViewerElement);
    document.body.appendChild(cardStacksElement);

    // Add game end element to document for MutationObserver
    gameEndElement = document.createElement("game-ended-notification");
    document.body.appendChild(gameEndElement);

    // Create a deck map for Assertions.
    const expectedDeck = new Deck(
      "Game #133465515",
      true,
      "123.45",
      "Player",
      "P",
      ["Vampire", "Ogre", "Plebeian", "Lancer", "Minstrel"]
    );

    const expectedOpponentDeck = new OpponentDeck(
      "Game #133465515",
      true,
      "543.21",
      "Opponent",
      "O",
      ["Vampire", "Ogre", "Plebeian", "Lancer", "Minstrel"]
    );

    const expectedDeckMap = new Map([
      ["Player", expectedDeck],
      ["Opponent", expectedOpponentDeck],
    ]);

    // Act - simulate calling the initIntervalCallback.
    DOMObserver.initIntervalCallback();

    // Assert
    expect(DOMObserver.gameLog).toBe(
      "Game #133465515, rated.\nPlayer: 123.45\nOpponent: 543.21\n\nCard Pool: level 1\nP starts with 7 Coppers.\nP starts with 3 Estates.\nO starts with 7 Coppers.\nO starts with 3 Estates."
    );
    expect(DOMObserver.ratedGame).toBe(true);
    expect(DOMObserver.logInitialized).toBe(true);
    expect(DOMObserver.playerName).toBe("Player");
    expect(DOMObserver.opponentNames).toStrictEqual(["Opponent"]);
    expect(DOMObserver.playerNick).toBe("P");
    expect(DOMObserver.opponentNicks).toStrictEqual(["O"]);
    expect(DOMObserver.playerRating).toBe("123.45");
    expect(DOMObserver.opponentRatings).toStrictEqual(["543.21"]);
    expect(DOMObserver.playersInitialized).toBe(true);
    expect(DOMObserver.kingdom).toStrictEqual([
      "Vampire",
      "Ogre",
      "Plebeian",
      "Lancer",
      "Minstrel",
    ]);
    expect(DOMObserver.baseOnly).toBe(false);
    expect(DOMObserver.store.getState().content.baseOnly).toBe(false);
    expect(DOMObserver.kingdomInitialized).toBe(true);
    expect(DOMObserver.decks).toStrictEqual(expectedDeckMap);
    expect(DOMObserver.decksInitialized).toBe(true);
    expect(DOMObserver.store.getState().content.gameActiveStatus).toBe(false);
    expect(DOMObserver.gameEndObserver).toBe(undefined);
    expect(DOMObserver.gameLogObserver).toBe(undefined);
    expect(DOMObserver.undoObserver).toBe(undefined);
    expect(observe).not.toBeCalled();
    expect(DOMObserver.store.getState().content.playerDeck).toStrictEqual(
      JSON.parse(JSON.stringify(new EmptyDeck()))
    );
    expect(DOMObserver.store.getState().content.opponentDecks).toStrictEqual([
      JSON.parse(JSON.stringify(new EmptyOpponentDeck())),
    ]);
    expect(DOMObserver.decks).toStrictEqual(expectedDeckMap);
    expect(DOMObserver.logsProcessed).toBe("");
    expect(saveGameData).not.toBeCalled();
    expect(clearInterval).toBeCalledWith(DOMObserver.initInterval);
    expect(setInterval).toBeCalledWith(
      DOMObserver.resetCheckIntervalCallback,
      1000
    );
  });

  it("should call the DOM initializer methods, and take no further action if the initializations are not successful.", () => {
    const resetGame = jest
      .spyOn(DOMObserver, "resetGame")
      .mockImplementation(() => {});
    const logInitializer = jest
      .spyOn(DOMObserver, "logInitializer")
      .mockImplementation(() => {});
    const playersInitializer = jest
      .spyOn(DOMObserver, "playersInitializer")
      .mockImplementation(() => {});
    const kingdomInitializer = jest
      .spyOn(DOMObserver, "kingdomInitializer")
      .mockImplementation(() => {});
    const deckMapInitializer = jest
      .spyOn(DOMObserver, "deckMapInitializer")
      .mockImplementation(() => {});
    const initialized = jest.spyOn(DOMObserver, "initialized");
    const resetDeckState = jest
      .spyOn(DOMObserver, "resetReduxDeckState")
      .mockImplementation(() => {});
    const mutationObserverInitializer = jest
      .spyOn(DOMObserver, "mutationObserverInitializer")
      .mockImplementation(() => {});
    const logObserverFunc = jest
      .spyOn(DOMObserver, "logObserverFunc")
      .mockImplementation(() => {});

    // Arrange - initializations not successful.
    initialized.mockImplementation(() => false);

    // Act - simulate calling the initIntervalCallback.
    DOMObserver.initIntervalCallback();

    // Assert
    expect(resetGame).toBeCalledTimes(1);
    expect(logInitializer).toBeCalledTimes(1);
    expect(playersInitializer).toBeCalledTimes(1);
    expect(kingdomInitializer).toBeCalledTimes(1);
    expect(deckMapInitializer).toBeCalledTimes(1);
    expect(initialized).toBeCalledTimes(1);
    expect(resetDeckState).not.toBeCalled();
    expect(mutationObserverInitializer).not.toBeCalled();
    expect(logObserverFunc).not.toBeCalled();
    expect(saveGameData).not.toBeCalled();
    expect(clearInterval).not.toBeCalled();
    expect(setInterval).not.toBeCalled();
  });
});
