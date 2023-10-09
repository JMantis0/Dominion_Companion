/**
 * @jest-environment jsdom
 */
/* global chrome */
import { AnyAction, Dispatch } from "redux";
import {
  chromeListenerUseEffectHandler,
  getPrimaryFrameStatus,
} from "../../src/utils/utils";
import {
  describe,
  afterEach,
  jest,
  it,
  expect,
  beforeAll,
} from "@jest/globals";
import { setViewerHidden } from "../../src/redux/contentSlice";

// Mock the necessary dependencies
const dispatchMock = jest.fn() as jest.MockedFunction<Dispatch<AnyAction>>;
const setViewerHiddenMock = setViewerHidden as jest.MockedFunction<
  typeof setViewerHidden
>;
const primaryFrame = document.createElement("div");
primaryFrame.setAttribute("id", "primaryFrame");
// Mock the Chrome global, runtime and related functions
const chromeMock = {
  runtime: {
    onMessage: {
      addListener: jest.fn() as jest.MockedFunction<
        typeof chrome.runtime.onMessage.addListener
      >,
      removeListener: jest.fn() as jest.MockedFunction<
        typeof chrome.runtime.onMessage.removeListener
      >,
    },
  },
} as jest.MockedObject<typeof chrome>;

// Define the mock request, sender, and sendResponse functions
const mockAppendRequest = { command: "appendDomRoot" };
const mockRemoveRequest = { command: "removeDomRoot" };
const mockSender = { id: "12345" };
const mockSendResponse = jest.fn();

describe("chromeListenerUseEffectHandler", () => {
  beforeAll(() => {
    global.chrome = chromeMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add a message listener to false when "Add" is passed', () => {
    chromeListenerUseEffectHandler(
      "Add",
      dispatchMock,
      setViewerHiddenMock,
      getPrimaryFrameStatus
    );

    expect(chromeMock.runtime.onMessage.addListener).toHaveBeenCalled();

    // Simulate a message "appendDomRoot" being received
    const listenerCallback =
      chromeMock.runtime.onMessage.addListener.mock.calls[0][0];
    listenerCallback(mockAppendRequest, mockSender, mockSendResponse);
    expect(dispatchMock).toHaveBeenCalledWith(setViewerHiddenMock(false));
    expect(mockSendResponse).toHaveBeenCalledWith({
      message: "Successfully turned on.",
    });

    // Simulate a message "removeDomRoot" being received
    listenerCallback(mockRemoveRequest, mockSender, mockSendResponse);
    expect(dispatchMock).toHaveBeenLastCalledWith(setViewerHiddenMock(true));
    expect(mockSendResponse).toHaveBeenLastCalledWith({
      message: "Successfully turned off.",
    });
  });

  it('should remove a message listener when "Remove" is passed', () => {
    chromeListenerUseEffectHandler(
      "Remove",
      dispatchMock,
      setViewerHiddenMock,
      getPrimaryFrameStatus
    );

    expect(chromeMock.runtime.onMessage.removeListener).toHaveBeenCalled();
  });

  it('should handle "sendHiddenState" command correctly', () => {
    chromeListenerUseEffectHandler(
      "Add",
      dispatchMock,
      setViewerHiddenMock,
      getPrimaryFrameStatus
    );
    document.body.appendChild(primaryFrame);
    primaryFrame.setAttribute("class", "hidden");
    // Simulate a "sendHiddenState" message being received
    const listenerCallback =
      chromeMock.runtime.onMessage.addListener.mock.calls[0][0];
    listenerCallback(
      { command: "sendHiddenState" },
      mockSender,
      mockSendResponse
    );

    expect(mockSendResponse).toHaveBeenLastCalledWith({
      message: "Hidden state is ON",
    });

    primaryFrame.setAttribute("class", "");
    // Simulate a "sendHiddenState" message with hidden state OFF
    listenerCallback(
      { command: "sendHiddenState" },
      mockSender,
      mockSendResponse
    );

    expect(mockSendResponse).toHaveBeenLastCalledWith({
      message: "Hidden state is OFF",
    });
  });

  it("should handle an invalid command correctly", () => {
    chromeListenerUseEffectHandler(
      "Add",
      dispatchMock,
      setViewerHiddenMock,
      getPrimaryFrameStatus
    );

    // Simulate an invalid command being received
    const listenerCallback =
      chromeMock.runtime.onMessage.addListener.mock.calls[0][0];
    listenerCallback(
      { command: "invalidCommand" },
      mockSender,
      mockSendResponse
    );

    expect(mockSendResponse).toHaveBeenCalledWith({
      message: "Invalid Request",
    });
  });
});
