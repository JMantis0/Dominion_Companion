/**
 * @jest-environment jsdom
 */
import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { popupMessageListener } from "../../src/utils/utils";
import { setViewerHidden } from "../../src/redux/contentSlice";
import { store } from "../../src/redux/store";

describe("popupMessageListener", () => {
  // Mock arguments
  let request: { command: string };
  let sender: chrome.runtime.MessageSender;
  const sendResponse = jest.fn();
  const dispatch = jest.spyOn(store, "dispatch");

  afterEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = "";
  });

  it("for request.command of 'appendDomRoot', should dispatch the setViewerHidden action creator with a value of false, and execute the callback with a the response 'Successfully turned on.", () => {
    // Arrange
    request = { command: "appendDomRoot" };
    sender = { id: "abcdefg", origin: "chrome://abcdefg" };

    // Act
    popupMessageListener(request, sender, sendResponse);

    expect(dispatch).toBeCalledWith(setViewerHidden(false));
    expect(store.getState().content.viewerHidden).toBe(false);
    expect(sendResponse).toBeCalledWith({ message: "Successfully turned on." });
  });

  it("for a request.command of 'removeDomRoot' should dispatch the setViewerHidden action creator with a value of true, and execute the callback with a the response 'Successfully turned of.", () => {
    // Arrange
    request = { command: "removeDomRoot" };
    sender = { id: "abcdefg", origin: "chrome://abcdefg" };

    // Act
    popupMessageListener(request, sender, sendResponse);

    // Assert
    expect(dispatch).toBeCalledWith(setViewerHidden(true));
    expect(store.getState().content.viewerHidden).toBe(true);
    expect(sendResponse).toBeCalledWith({
      message: "Successfully turned off.",
    });
  });

  it("for a request.command of 'sendHiddenState', if the primaryFrame is hidden, should send the response 'Hidden state is ON", () => {
    // Arrange
    request = { command: "sendHiddenState" };
    sender = { id: "abcdefg", origin: "chrome://abcdefg" };
    const primaryFrameMock = document.createElement("div");
    primaryFrameMock.setAttribute("id", "primaryFrame");
    primaryFrameMock.classList.add("hidden");
    document.body.appendChild(primaryFrameMock);

    // Act
    popupMessageListener(request, sender, sendResponse);

    // Assert
    expect(dispatch).not.toBeCalled();
    expect(sendResponse).toBeCalledWith({ message: "Hidden state is ON" });
  });

  it("for a request.command of 'sendHiddenState', if the primaryFrame is not hidden, should send the response 'Hidden state is OFF", () => {
    // Arrange
    request = { command: "sendHiddenState" };
    sender = { id: "abcdefg", origin: "chrome://abcdefg" };
    const primaryFrameMock = document.createElement("div");
    primaryFrameMock.setAttribute("id", "primaryFrame");
    primaryFrameMock.classList.add("visible");
    document.body.appendChild(primaryFrameMock);

    // Act
    popupMessageListener(request, sender, sendResponse);

    // Assert
    expect(dispatch).not.toBeCalled();
    expect(sendResponse).toBeCalledWith({ message: "Hidden state is OFF" });
  });

  it("should send a response of 'Invalid Request' if the command is not valid", () => {
    // Arrange
    request = { command: "theBestInvalidMessageEver" };
    sender = { id: "abcdefg", origin: "chrome://abcdefg" };

    // Act
    popupMessageListener(request, sender, sendResponse);

    // Assert
    expect(dispatch).not.toBeCalled();
    expect(sendResponse).toBeCalledWith({ message: "Invalid Request" });
  });
});
