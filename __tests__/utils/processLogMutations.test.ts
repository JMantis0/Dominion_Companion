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
// import { processLogMutations } from "../../src/utils/utils";
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

describe("Function processLogMutations", () => {
  let mutationRecord: MutationRecord[];

  const getGameLogMock = jest
    .fn()
    .mockImplementation(() => "GetGameLogResult") as jest.MockedFunction<
    typeof getGameLog
  >;
  const areNewLogsToSendMock = jest
    .fn()
    .mockImplementation(() => true) as jest.MockedFunction<
    typeof areNewLogsToSend
  >;

  const getNewLogsAndUpdateDecksMock = jest.fn().mockImplementation(() => {
    return {
      playerStoreDeck: JSON.parse(JSON.stringify(new EmptyDeck())),
      opponentStoreDeck: JSON.parse(JSON.stringify(new EmptyOpponentDeck())),
    };
  }) as jest.MockedFunction<typeof getNewLogsAndUpdateDecks>;

  const getUndispatchedLogsMock = jest.fn() as jest.MockedFunction<
    typeof getUndispatchedLogs
  >;
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
  // const mutationRecordArray: Array<MutationRecord[]> = [];
  describe("should return true if the last added node in the given mutation's addedNodes has innerText", () => {
    beforeAll(() => {
      console.log("Doing beforeAll stuff");
      const mutationObserver = new MutationObserver((mutationList) => {
        console.log("Mutation detected");
        console.log(mutationList);
        for (const mutation of mutationList) {
          console.log(mutation.addedNodes);
        }
        mutationRecord = mutationList;
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
      const node1 = document.createElement("div");
      node1.innerText = "Innertext!";
      document.body.appendChild(node1);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return true if the last added node in the given mutation's addedNodes has innerText", () => {
      // MutationRecord with addedNodes where the last one has a innerTextValue

      // Act
      console.log("Inside test 1, mutationRecord is ", mutationRecord);
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
      expect(areNewLogsToSendMock).toBeCalledTimes(1);
      expect(getGameLogMock).toBeCalledTimes(2);

      expect(getNewLogsAndUpdateDecksMock).toBeCalledTimes(1);
      expect(dispatchUpdatedDecksToReduxMock).toBeCalledTimes(1);
      expect(newGameLog).toBe("GetGameLogResult");
    });
  });
  describe("should return true if the last added node in the given mutation's addedNodes has innerText", () => {
    beforeAll(() => {
      console.log("Doing beforeAll stuff");
      const mutationObserver = new MutationObserver((mutationList) => {
        console.log("Mutation detected");
        console.log(mutationList);
        for (const mutation of mutationList) {
          console.log(mutation.addedNodes);
        }
        mutationRecord = mutationList;
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
      const node1 = document.createElement("div");
      node1.innerText = "";
      document.body.appendChild(node1);
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it("should return false if the last added node in the given mutation's addedNodes has no Innertext", () => {
      // MutationRecord with addedNodes where the last one has a innerTextValue

      // Act
      console.log(
        "Inside test 2, mutationRecord is ",
        mutationRecord
      );
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
