/**
 * @jest-environment jsdom
 */
import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
describe("playersInitializer", () => {
  // Mock dependencies
  const arePlayerInfoElementsPresent = jest.spyOn(
    DOMObserver,
    "arePlayerInfoElementsPresent"
  );
  const getPlayerAndOpponentNameByComparingElementPosition = jest.spyOn(
    DOMObserver,
    "getPlayerAndOpponentNameByComparingElementPosition"
  );
  const getPlayerInfoElements = jest.spyOn(
    DOMObserver,
    "getPlayerInfoElements"
  );
  const getPlayerNameAbbreviations = jest.spyOn(
    DOMObserver,
    "getPlayerNameAbbreviations"
  );
  const getPlayerRatings = jest.spyOn(DOMObserver, "getPlayerRatings");
  const setPlayerName = jest.spyOn(DOMObserver, "setPlayerName");
  const setOpponentName = jest.spyOn(DOMObserver, "setOpponentName");
  const setPlayerNick = jest.spyOn(DOMObserver, "setPlayerNick");
  const setOpponentNick = jest.spyOn(DOMObserver, "setOpponentNick");
  const setPlayerRating = jest.spyOn(DOMObserver, "setPlayerRating");
  const setOpponentRating = jest.spyOn(DOMObserver, "setOpponentRating");
  const setPlayersInitialized = jest.spyOn(
    DOMObserver,
    "setPlayersInitialized"
  );

  afterEach(() => {
    DOMObserver.resetGame();
    jest.clearAllMocks();
  });

  it("should check the client DOM for the player-info elements and if present should initialize the player related fields (rated game case)", () => {
    // Arrange a scenario where the player elements are present, and the game is rated.
    const mockGameLog = "Log1\nLog2\nLog3";
    DOMObserver.gameLog = mockGameLog;
    DOMObserver.ratedGame = true;
    arePlayerInfoElementsPresent.mockImplementation(() => true);
    getPlayerAndOpponentNameByComparingElementPosition.mockImplementation(
      () => ["PlayerName", "OpponentName"]
    );
    const mockHTMLCollection = document.createDocumentFragment()
      .children as HTMLCollectionOf<HTMLElement>;
    getPlayerInfoElements.mockImplementation(() => mockHTMLCollection);
    getPlayerNameAbbreviations.mockImplementation(() => ["P", "O"]);
    getPlayerRatings.mockImplementation(() => ["PRating", "ORating"]);

    // Act - Simulate calling the playersInitializer.
    DOMObserver.playersInitializer();

    // Assert
    expect(arePlayerInfoElementsPresent).toBeCalledTimes(1);
    expect(arePlayerInfoElementsPresent.mock.results[0].value).toBe(true);
    expect(getPlayerAndOpponentNameByComparingElementPosition).toBeCalledTimes(
      1
    );
    expect(getPlayerAndOpponentNameByComparingElementPosition).toBeCalledWith(
      mockHTMLCollection
    );
    expect(
      getPlayerAndOpponentNameByComparingElementPosition.mock.results[0].value
    ).toStrictEqual(["PlayerName", "OpponentName"]);
    expect(getPlayerInfoElements).toBeCalledTimes(1);
    expect(getPlayerInfoElements.mock.results[0].value).toStrictEqual(
      mockHTMLCollection
    );
    expect(getPlayerNameAbbreviations).toBeCalledTimes(1);
    expect(getPlayerNameAbbreviations).toBeCalledWith(
      mockGameLog,
      "PlayerName"
    );
    expect(getPlayerNameAbbreviations.mock.results[0].value).toStrictEqual([
      "P",
      "O",
    ]);
    expect(getPlayerRatings).toBeCalledTimes(1);
    expect(getPlayerRatings).toBeCalledWith(
      "PlayerName",
      "OpponentName",
      mockGameLog
    );
    expect(getPlayerRatings.mock.results[0].value).toStrictEqual([
      "PRating",
      "ORating",
    ]);
    expect(setPlayerName).toBeCalledTimes(1);
    expect(setPlayerName).toBeCalledWith("PlayerName");
    expect(setOpponentName).toBeCalledTimes(1);
    expect(setOpponentName).toBeCalledWith("OpponentName");
    expect(setPlayerNick).toBeCalledTimes(1);
    expect(setPlayerNick).toBeCalledWith("P");
    expect(setOpponentNick).toBeCalledTimes(1);
    expect(setOpponentNick).toBeCalledWith("O");
    expect(setPlayerRating).toBeCalledTimes(1);
    expect(setPlayerRating).toBeCalledWith("PRating");
    expect(setOpponentRating).toBeCalledTimes(1);
    expect(setOpponentRating).toBeCalledWith("ORating");
    expect(setPlayersInitialized).toBeCalledTimes(1);
    expect(setPlayersInitialized).toBeCalledWith(true);
  });

  it("should check the client DOM for the player-info elements and if present should initialize the player related fields (unrated game case)", () => {
    // Arrange a scenario where the player elements are present, and the game is rated.
    const mockGameLog = "Log1\nLog2\nLog3";
    DOMObserver.gameLog = mockGameLog;
    DOMObserver.ratedGame = false;
    arePlayerInfoElementsPresent.mockImplementation(() => true);
    getPlayerAndOpponentNameByComparingElementPosition.mockImplementation(
      () => ["PlayerName", "OpponentName"]
    );
    const mockHTMLCollection = document.createDocumentFragment()
      .children as HTMLCollectionOf<HTMLElement>;
    getPlayerInfoElements.mockImplementation(() => mockHTMLCollection);
    getPlayerNameAbbreviations.mockImplementation(() => ["P", "O"]);
    getPlayerRatings.mockImplementation(() => ["PRating", "ORating"]);

    // Act - Simulate calling the playersInitializer.
    DOMObserver.playersInitializer();

    // Assert
    expect(arePlayerInfoElementsPresent).toBeCalledTimes(1);
    expect(arePlayerInfoElementsPresent.mock.results[0].value).toBe(true);
    expect(getPlayerAndOpponentNameByComparingElementPosition).toBeCalledTimes(
      1
    );
    expect(getPlayerAndOpponentNameByComparingElementPosition).toBeCalledWith(
      mockHTMLCollection
    );
    expect(
      getPlayerAndOpponentNameByComparingElementPosition.mock.results[0].value
    ).toStrictEqual(["PlayerName", "OpponentName"]);
    expect(getPlayerInfoElements).toBeCalledTimes(1);
    expect(getPlayerInfoElements.mock.results[0].value).toStrictEqual(
      mockHTMLCollection
    );
    expect(getPlayerNameAbbreviations).toBeCalledTimes(1);
    expect(getPlayerNameAbbreviations).toBeCalledWith(
      mockGameLog,
      "PlayerName"
    );
    expect(getPlayerNameAbbreviations.mock.results[0].value).toStrictEqual([
      "P",
      "O",
    ]);
    expect(getPlayerRatings).not.toBeCalled();
    expect(setPlayerName).toBeCalledTimes(1);
    expect(setPlayerName).toBeCalledWith("PlayerName");
    expect(setOpponentName).toBeCalledTimes(1);
    expect(setOpponentName).toBeCalledWith("OpponentName");
    expect(setPlayerNick).toBeCalledTimes(1);
    expect(setPlayerNick).toBeCalledWith("P");
    expect(setOpponentNick).toBeCalledTimes(1);
    expect(setOpponentNick).toBeCalledWith("O");
    expect(setPlayerRating).not.toBeCalled();
    expect(setOpponentRating).not.toBeCalled();
    expect(setPlayersInitialized).toBeCalledTimes(1);
    expect(setPlayersInitialized).toBeCalledWith(true);
  });

  it("should check the client DOM for the player-info elements and if not present, should not initialize player related fields.", () => {
    // Arrange a scenario where the player elements are not present.
    const mockGameLog = "Log1\nLog2\nLog3";
    DOMObserver.gameLog = mockGameLog;
    DOMObserver.ratedGame = false;
    arePlayerInfoElementsPresent.mockImplementation(() => false);

    // Act - Simulate calling the playersInitializer.
    DOMObserver.playersInitializer();

    // Assert
    expect(arePlayerInfoElementsPresent).toBeCalledTimes(1);
    expect(arePlayerInfoElementsPresent.mock.results[0].value).toBe(false);
    expect(getPlayerAndOpponentNameByComparingElementPosition).not.toBeCalled();
    expect(getPlayerInfoElements).not.toBeCalled();
    expect(getPlayerNameAbbreviations).not.toBeCalled();
    expect(getPlayerRatings).not.toBeCalled();
    expect(setPlayerName).not.toBeCalled();
    expect(setOpponentName).not.toBeCalled();
    expect(setPlayerNick).not.toBeCalled();
    expect(setOpponentNick).not.toBeCalled();
    expect(setPlayerRating).not.toBeCalled();
    expect(setOpponentRating).not.toBeCalled();
    expect(setPlayersInitialized).not.toBeCalled();
  });
});
