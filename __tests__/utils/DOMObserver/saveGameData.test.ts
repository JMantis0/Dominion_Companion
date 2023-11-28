/**
 * @jest-environment jsdom
 */

import { describe, it, expect, jest, beforeAll } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import { SavedGames } from "../../../src/utils";
import { EmptyDeck } from "../../../src/model/emptyDeck";
import { EmptyOpponentDeck } from "../../../src/model/emptyOpponentDeck";
import { chrome } from "jest-chrome";
import { setSavedGames } from "../../../src/redux/contentSlice";

describe("saveGameData function", () => {
  // Mock a game log element for SavedGame to get its HTML
  const gameLogEl = document.createElement("div");
  gameLogEl.setAttribute("class", "game-log");
  gameLogEl.innerHTML = "MockedHTML";
  document.body.appendChild(gameLogEl);
  // Mocking Chrome storage functions and dispatch
  const mockGet = jest.spyOn(chrome.storage.local, "get");
  const mockSet = jest.spyOn(chrome.storage.local, "set");
  const mockDispatch = jest.spyOn(DOMObserver, "dispatch");

  beforeAll(() => {
    jest.clearAllMocks();
  });

  it(
    "should set the game keys to include the new title, then set the new saved game to chrome storage, then dispatch " +
      "all the saved games in chromes storage to redux",
    async () => {
      // Arrange Class fields
      DOMObserver.playerName = "Player";
      DOMObserver.opponentNames = ["Opponent"];
      // Set up response from storage 1
      const response1: { gameKeys: string[] } = {
        gameKeys: ["a", "b", "c"],
      };
      // setup response from storage 2
      // Mocked data
      const gameLog = "Log1\nLog2\nLog3";
      const decks = new Map<string, Deck | OpponentDeck>([
        [
          DOMObserver.playerName,
          new Deck("MockTitle", false, "", DOMObserver.playerName, "P", []),
        ],
        [
          DOMObserver.opponentNames[0],
          new OpponentDeck(
            "MockTitle",
            false,
            "",
            DOMObserver.opponentNames[0],
            "O",
            []
          ),
        ],
      ]);
      const response2: SavedGames = {
        Game1: {
          logArchive: "mockGameLog",
          playerDeck: JSON.parse(JSON.stringify(new EmptyDeck())),
          opponentDecks: [JSON.parse(JSON.stringify(new EmptyOpponentDeck()))],
          dateTime: "MockDateTime",
          logHtml: "MockHTML",
        },
        Game2: {
          logArchive: gameLog,
          playerDeck: JSON.parse(
            JSON.stringify(
              new Deck("MockTitle", false, "", DOMObserver.playerName, "P", [])
            )
          ),
          opponentDecks: JSON.parse(
            JSON.stringify(
              new OpponentDeck(
                "MockTitle",
                false,
                "",
                DOMObserver.opponentNames[0],
                "O",
                []
              )
            )
          ),
          dateTime: "MockDateTime",
          logHtml: "MockedHTML",
        },
      };

      mockGet.mockResolvedValueOnce(response1).mockResolvedValueOnce(response2);
      mockSet.mockResolvedValue(null);

      // Call the function
      await DOMObserver.saveGameData(gameLog, decks);
      const expectedSavedGame = {
        logArchive: gameLog,
        playerDeck: JSON.parse(
          JSON.stringify(
            new Deck("MockTitle", false, "", DOMObserver.playerName, "P", [])
          )
        ),
        opponentDecks: [JSON.parse(
          JSON.stringify(
            new OpponentDeck(
              "MockTitle",
              false,
              "",
              DOMObserver.opponentNames[0],
              "O",
              []
            )
          )
        )],
        dateTime: expect.any(String),
        logHtml: "MockedHTML",
      };
      // Assertions

      // Verify that chrome.storage.local.get was called with the "gameKeys" key
      expect(mockGet).nthCalledWith(1, ["gameKeys"]);

      // Verify that chrome.storage.local.set was called with the "gameKeys" key and array of game keys.
      expect(mockSet).nthCalledWith(1, {
        gameKeys: ["a", "b", "c", "MockTitle"],
      });
      expect(mockSet).nthCalledWith(2, { MockTitle: expectedSavedGame });

      // Verify that chrome.local.get is called a 2rd time with all the updated gameKeys.
      expect(mockGet).nthCalledWith(2, ["a", "b", "c", "MockTitle"]);
      expect(mockDispatch).toBeCalledWith(setSavedGames(response2));
    }
  );

  it("should work if there are no gameKeys in chrome local storage", async () => {
    // Arrange Class fields
    DOMObserver.playerName = "Player";
    DOMObserver.opponentNames = ["Opponent"];

    // Set up response from storage 1
    const response1: { gameKeys: string[] | undefined } = {
      gameKeys: undefined,
    };
    // setup response from storage 2
    const response2: SavedGames = {
      Game1: {
        logArchive: "mockGameLog",
        playerDeck: JSON.parse(JSON.stringify(new EmptyDeck())),
        opponentDecks: [JSON.parse(JSON.stringify(new EmptyOpponentDeck()))],
        dateTime: "MockDateTime",
        logHtml: "MockHTML",
      },
    };

    mockGet.mockResolvedValueOnce(response1).mockResolvedValueOnce(response2);
    mockSet.mockResolvedValue(null);

    // Mocked data
    const gameLog = "Log1\nLog2\nLog3";
    const decks = new Map<string, Deck | OpponentDeck>([
      [
        DOMObserver.playerName,
        new Deck("MockTitle", false, "", DOMObserver.playerName, "P", []),
      ],
      [
        DOMObserver.opponentNames[0],
        new OpponentDeck(
          "MockTitle",
          false,
          "",
          DOMObserver.opponentNames[0],
          "O",
          []
        ),
      ],
    ]);

    // Call the function
    await DOMObserver.saveGameData(gameLog, decks);
    const expectedSavedGame = {
      logArchive: gameLog,
      playerDeck: JSON.parse(
        JSON.stringify(
          new Deck("MockTitle", false, "", DOMObserver.playerName, "P", [])
        )
      ),
      opponentDecks: [
        JSON.parse(
          JSON.stringify(
            new OpponentDeck(
              "MockTitle",
              false,
              "",
              DOMObserver.opponentNames[0],
              "O",
              []
            )
          )
        ),
      ],
      dateTime: expect.any(String),
      logHtml: "MockedHTML",
    };

    // Assertions

    // Verify that chrome.storage.local.get was called with the "gameKeys" key
    expect(mockGet).nthCalledWith(1, ["gameKeys"]);

    // Verify that chrome.storage.local.set was called with the "gameKeys" key and single game keys
    expect(mockSet).nthCalledWith(1, {
      gameKeys: ["MockTitle"],
    });
    expect(mockSet).nthCalledWith(2, { MockTitle: expectedSavedGame });

    // Verify that chrome.local.get is called a 2rd time with all the updated gameKeys.
    expect(mockGet).nthCalledWith(2, ["MockTitle"]);
    expect(mockDispatch).toBeCalledWith(setSavedGames(response2));
  });
});
