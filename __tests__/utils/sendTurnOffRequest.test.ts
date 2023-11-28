import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { SetStateAction } from "react";
import { chrome } from "jest-chrome";
import { sendTurnOffRequest } from "../../src/utils/utils";
describe("sendTurnOffRequest", () => {
  // Mock a setState to call the function with
  const setStateMock = jest.fn() as jest.MockedFunction<
    React.Dispatch<SetStateAction<"ON" | "OFF">>
  >;
  // Mock chrome chrome.tabs.query to return a non-undefined tab
  const tabsQueryMock = jest.spyOn(chrome.tabs, "query");
  // Mock chrome.tabs.sendMessage
  const tabsSendMessageMock = jest.spyOn(chrome.tabs, "sendMessage");
  const consoleErrorMock = jest.spyOn(console, "error");

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(
    "should try to get the active tab, and if it's not undefined, send a request to the content script" +
      " and dispatch the given SetStateAction with the action 'OFF'",
    async () => {
      // Arrange
      // Mock response for 'query' method
      const mockResponse = {
        id: 4,
      };
      tabsQueryMock.mockResolvedValue([mockResponse]);
      // Mock response for 'sendMessage' method
      tabsSendMessageMock.mockResolvedValue({
        message: "Successfully turned off.",
      });

      // Act - Simulate sending a TurnOnRequest to the active tab

      await sendTurnOffRequest(setStateMock);

      // Assert - Verify the setState was dispatched with action "ON"
      expect(tabsQueryMock).toBeCalledTimes(1);
      expect(tabsSendMessageMock).toBeCalledTimes(1);
      expect(tabsSendMessageMock).toBeCalledWith(4, {
        command: "removeDomRoot",
      });
      expect(setStateMock).toBeCalledTimes(1);
      expect(setStateMock).toBeCalledWith("OFF");
    }
  );

  it("should catch and console errors thrown by the chrome.tabs.query method", async () => {
    // Arrange
    const errorMock = new Error("Mock Error");
    tabsQueryMock.mockImplementation(() => {
      throw errorMock;
    });

    // Act - Simulate the chrome.tabs.query throwing an error.
    await sendTurnOffRequest(setStateMock);

    // Assert - Verify the error was consoled and the sendMessage and setState were not called.
    expect(consoleErrorMock).toBeCalledTimes(2);
    expect(consoleErrorMock).nthCalledWith(1, "Mock Error");
    expect(consoleErrorMock).nthCalledWith(2, errorMock);
    expect(tabsSendMessageMock).not.toBeCalled();
    expect(setStateMock).not.toBeCalled();
  });

  it("should console an error message if the response message from the sendMessage method is not 'Successfully turned on.'", async () => {
    // Arrange
    // Mock response for 'query' method
    const mockResponse = {
      id: 4,
    };
    tabsQueryMock.mockResolvedValue([mockResponse]);
    // Mock response for 'sendMessage' method
    tabsSendMessageMock.mockResolvedValue({
      message: "Mock invalid message",
    });

    // Act - Simulate sending a TurnOnRequest to the active tab
    await sendTurnOffRequest(setStateMock);

    // Assert
    expect(tabsQueryMock).toBeCalledTimes(1);
    expect(tabsSendMessageMock).toBeCalledTimes(1);
    expect(tabsSendMessageMock).toBeCalledWith(4, {
      command: "removeDomRoot",
    });
    expect(setStateMock).not.toBeCalled();
    expect(consoleErrorMock).toBeCalledWith(
      "Invalid response message:",
      "Mock invalid message"
    );
  });
});
