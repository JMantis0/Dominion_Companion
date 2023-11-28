/**
 * @jest-environment jsdom
 */

import { describe, it, jest, expect } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("restartDOMObserver", () => {
  const initIntervalCallbackMock = jest.spyOn(
    DOMObserver,
    "initIntervalCallback"
  );
  const setIntervalMock = jest.spyOn(global, "setInterval");
  const clearIntervalMock = jest.spyOn(global, "clearInterval");
  it("should clear the resetInterval and call the setInterval with the initInterval Callback", () => {
    // Arrange

    // Act
    DOMObserver.restartDOMObserver();

    // Assert - verify the clearInterval and setInterval methods were called with the correct arguments.
    expect(clearIntervalMock).toBeCalledTimes(1);
    expect(clearIntervalMock).toBeCalledWith(DOMObserver.resetInterval);
    expect(setIntervalMock).toBeCalledTimes(1);
    expect(setIntervalMock).toBeCalledWith(initIntervalCallbackMock, 1000);
  });
});
