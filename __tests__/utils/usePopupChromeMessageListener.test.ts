/**
 * @jest-environment jsdom
 */

import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import {
  popupMessageListener,
  usePopupChromeMessageListener,
} from "../../src/utils/utils";
import { chrome } from "jest-chrome";

describe("usePopupChromeMessageListener", () => {
  const mockChromeRuntimeOnMessageAddListener = jest.spyOn(
    chrome.runtime.onMessage,
    "addListener"
  );
  const mockChromeRuntimeOnMessageRemoveListener = jest.spyOn(
    chrome.runtime.onMessage,
    "removeListener"
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(
    "should add an onMessage listener when the hook renders, " +
      "and remove the same onMessage listener when the hook unmounts",
    () => {
      // Arrange - mount the custom hook
      const { unmount } = renderHook(() => usePopupChromeMessageListener());

      // Assert - Verify the listener was added, and not removed
      expect(mockChromeRuntimeOnMessageAddListener).toBeCalledTimes(1);
      expect(mockChromeRuntimeOnMessageRemoveListener).toBeCalledTimes(0);
      expect(mockChromeRuntimeOnMessageAddListener).toBeCalledWith(
        popupMessageListener
      );

      // Unmount the custom hook
      unmount();

      // Assert - Verify the listener was removed.
      expect(mockChromeRuntimeOnMessageRemoveListener).toBeCalledTimes(1);
      expect(mockChromeRuntimeOnMessageRemoveListener).toBeCalledWith(
        popupMessageListener
      );
    }
  );
});
