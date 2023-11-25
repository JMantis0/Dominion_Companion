import { describe, it, expect, afterEach, jest } from "@jest/globals";
import { chrome } from "jest-chrome";
import { sendContentViewerStatusRequest } from "../../src/utils/utils";
describe("sendContentViewerStatusRequest", () => {
  // Mocks
  const tabsQuery = jest.spyOn(chrome.tabs, "query");
  const tabsSendMessage = jest.spyOn(chrome.tabs, "sendMessage");
  const consoleErrorMock = jest.spyOn(console, "error");
  const cb = jest.fn() as (viewerState: "ON" | "OFF") => void;
  afterEach(() => {
    jest.clearAllMocks();
  });
  // Case 1 - Tab valid and response is that the hidden state is  OFF
  it(
    "should attempt to get the active tab and issue a tabs.sendMessage request to it, call " +
      "the given callback with 'ON'",
    async () => {
      // Arrange
      // Mock a fake tabs object response for the query method.
      tabsQuery.mockResolvedValue([{ id: 4 }]);

      // Mock a response from the sendMessage method
      tabsSendMessage.mockResolvedValue({ message: "Hidden state is ON" });
      // Act  -  Simulate requesting the content viewer status
      await sendContentViewerStatusRequest(cb);
      expect(cb).toBeCalledWith("OFF");
    }
  );
  // Case 2 - Tab valid and response is that the hidden state is ON
  it(
    "should attempt to get the active tab and issue a tabs.sendMessage request to it, call " +
      "the given callback with 'OFF'",
    async () => {
      // Arrange
      // Mock a fake tabs object response for the query method.
      tabsQuery.mockResolvedValue([{ id: 4 }]);

      // Mock a response from the sendMessage method
      tabsSendMessage.mockResolvedValue({ message: "Hidden state is OFF" });
      // Act  - Simulate requesting the content viewer status
      await sendContentViewerStatusRequest(cb);
      expect(cb).toBeCalledWith("ON");
    }
  );
  // Case 3 - Error when getting tab from chrome.tabs
  it("should catch and console error thrown by the chrome.tabs.query method", async () => {
    // Arrange

    // Mock tabs.query to throw an error
    const errorMock = new Error("Mock Error");
    tabsQuery.mockImplementation(() => {
      throw errorMock;
    });

    // Act  - Simulate requesting the content viewer status and tabs.query throwing an error
    await sendContentViewerStatusRequest(cb);

    expect(consoleErrorMock).toBeCalledTimes(2);
    expect(consoleErrorMock).nthCalledWith(1, "Mock Error");
    expect(consoleErrorMock).nthCalledWith(2, errorMock);
    expect(tabsSendMessage).not.toBeCalled();
    expect(cb).not.toBeCalled(); // Case 4 - Unexpected response from tab.
  });
});
