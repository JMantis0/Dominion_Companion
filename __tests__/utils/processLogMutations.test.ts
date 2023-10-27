/**
 * @jest-environment jsdom
 */
import {
  describe,
  it,
  expect,
  jest,
  afterEach,
  beforeAll,
} from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { OpponentDeck } from "../../src/model/opponentDeck";
import { AnyAction, Dispatch } from "redux";
import { setOpponentDeck, setPlayerDeck } from "../../src/redux/contentSlice";
import {
  processLogMutations,
  areNewLogsToSend,
  getGameLog,
  getUndispatchedLogs,
  getNewLogsAndUpdateDecks,
  dispatchUpdatedDecksToRedux,
} from "../../src/utils/utils";
import { EmptyDeck } from "../../src/model/emptyDeck";
import { EmptyOpponentDeck } from "../../src/model/emptyOpponentDeck";
import * as utils from "../../src/utils/utils";

let mutationRecord: MutationRecord[];
describe("Function processLogMutations", () => {
  // Mock dependencies
  const getGameLogMock = jest
    .spyOn(utils, "getGameLog")
    // Mocking implementation to return a sample game-log innerText.
    .mockImplementation(() => "Log1\nLog2\nLog3\nLog4") as jest.MockedFunction<
    typeof getGameLog
  >;
  const areNewLogsToSendMock = jest.spyOn(
    utils,
    "areNewLogsToSend"
  ) as jest.MockedFunction<typeof areNewLogsToSend>;
  const getNewLogsAndUpdateDecksMock = jest.fn().mockImplementation(() => {
    return {
      playerStoreDeck: JSON.parse(JSON.stringify(new EmptyDeck())),
      opponentStoreDeck: JSON.parse(JSON.stringify(new EmptyOpponentDeck())),
    };
  }) as jest.MockedFunction<typeof getNewLogsAndUpdateDecks>;
  const getUndispatchedLogsMock = jest.spyOn(
    utils,
    "getUndispatchedLogs"
  ) as jest.MockedFunction<typeof getUndispatchedLogs>;
  const dispatchUpdatedDecksToReduxMock = jest.fn() as jest.MockedFunction<
    typeof dispatchUpdatedDecksToRedux
  >;
  const mockDispatch: Dispatch<AnyAction> = jest.fn() as jest.MockedFunction<
    Dispatch<AnyAction>
  >;
  const mockSetOpponentDeck = setOpponentDeck as jest.MockedFunction<
    typeof setOpponentDeck
  >;
  const mockSetPlayerDeck = setPlayerDeck as jest.MockedFunction<
    typeof setPlayerDeck
  >;

  describe("should return true if the last added node in the given mutation's addedNodes has innerText", () => {
    // Generate a MutationRecords[] with addedNodes whose last added node has innerText.
    beforeAll(() => {
      const mutationObserver = new MutationObserver((mutationList) => {
        mutationRecord = mutationList;
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
      const node1 = document.createElement("div");
      node1.innerText = "Innertext!";
      // Trigger the mutationObserver by adding node to the observed element.
      document.body.appendChild(node1);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return true if the last added node in the given mutation's addedNodes has innerText", () => {
      // Arrange
      const decks = new Map<string, Deck | OpponentDeck>();
      // Act
      const newGameLog = processLogMutations(
        mutationRecord,
        areNewLogsToSendMock,
        "Log1\nLog2",
        getGameLogMock,
        getNewLogsAndUpdateDecksMock,
        getUndispatchedLogsMock,
        decks,
        "pName",
        "oName",
        dispatchUpdatedDecksToReduxMock,
        mockDispatch,
        mockSetPlayerDeck,
        mockSetOpponentDeck
      );
      expect(areNewLogsToSendMock).toBeCalledTimes(1);
      expect(areNewLogsToSendMock).toBeCalledWith(
        "Log1\nLog2",
        "Log1\nLog2\nLog3\nLog4"
      );
      expect(getGameLogMock).toBeCalledTimes(2);
      expect(getNewLogsAndUpdateDecksMock).toBeCalledTimes(1);
      expect(getNewLogsAndUpdateDecksMock).toBeCalledWith(
        "Log1\nLog2",
        "Log1\nLog2\nLog3\nLog4",
        getUndispatchedLogsMock,
        decks,
        "pName",
        "oName"
      );
      expect(dispatchUpdatedDecksToReduxMock).toBeCalledTimes(1);
      expect(dispatchUpdatedDecksToReduxMock).toBeCalledWith(
        mockDispatch,
        mockSetPlayerDeck,
        mockSetOpponentDeck,
        JSON.parse(JSON.stringify(new EmptyDeck())),
        JSON.parse(JSON.stringify(new EmptyOpponentDeck()))
      );
      expect(newGameLog).toBe("Log1\nLog2\nLog3\nLog4");
    });
  });

  describe("should return false if the last added node in the given mutation's addedNodes has no innerText", () => {
    // Generate a MutationRecords[] with addedNodes whose last added node has no innerText.
    beforeAll(() => {
      const mutationObserver = new MutationObserver((mutationList) => {
        mutationRecord = mutationList;
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
      const node1 = document.createElement("div");
      node1.innerText = "";
      // Trigger the mutationObserver by adding node to the observed element.
      document.body.appendChild(node1);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return false if the last added node in the given mutation's addedNodes has no innerText", () => {
      // Act - Simulate the MutationObserver callback with a MutationRecord having addedNodes with a new log
      const newGameLog = processLogMutations(
        mutationRecord,
        areNewLogsToSendMock,
        "Log1\nLog2",
        getGameLogMock,
        getNewLogsAndUpdateDecksMock,
        getUndispatchedLogsMock,
        new Map<string, Deck | OpponentDeck>(),
        "pName",
        "oName",
        dispatchUpdatedDecksToReduxMock,
        mockDispatch,
        mockSetPlayerDeck,
        mockSetOpponentDeck
      );
      expect(areNewLogsToSendMock).toBeCalledTimes(0);
      expect(getGameLogMock).toBeCalledTimes(0);
      expect(getNewLogsAndUpdateDecksMock).toBeCalledTimes(0);
      expect(dispatchUpdatedDecksToReduxMock).toBeCalledTimes(0);
      expect(newGameLog).toBe(undefined);
    });
  });
});
