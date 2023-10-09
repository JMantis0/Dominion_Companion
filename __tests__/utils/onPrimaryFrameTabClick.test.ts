import { onPrimaryFrameTabClick } from "../../src/utils/utils";
import { Dispatch, AnyAction } from "redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { it, expect, describe, jest } from "@jest/globals";
import {
  setPinnedPrimaryFrameTab,
  setPrimaryFrameTab,
} from "../../src/redux/contentSlice";
import { PrimaryFrameTabType } from "../../src/utils";

describe("onPrimaryFrameTabClick", () => {
  it("should dispatch setPrimaryFrameTab and setPinnedPrimaryFrameTab actions with the provided tabName", () => {
    // Arrange - Create mock functions and values
    const tabName:PrimaryFrameTabType = "Deck"; // Replace with an actual tab name
    const mockDispatch: Dispatch<AnyAction> = jest.fn() as jest.MockedFunction<
      Dispatch<AnyAction>
    >;
    const mockSetPrimaryFrameTab: ActionCreatorWithPayload<
      PrimaryFrameTabType,
      "content/setPrimaryFrameTab"
    > = setPrimaryFrameTab as jest.MockedFunction<typeof setPrimaryFrameTab>;
    const mockSetPinnedPrimaryFrameTab: ActionCreatorWithPayload<
      PrimaryFrameTabType,
      "content/setPinnedPrimaryFrameTab"
    > = setPinnedPrimaryFrameTab as jest.MockedFunction<
      typeof setPinnedPrimaryFrameTab
    >;

    // Act - Call the function
    onPrimaryFrameTabClick(
      tabName,
      mockDispatch,
      mockSetPrimaryFrameTab,
      mockSetPinnedPrimaryFrameTab
    );

    // Assert - Check if both mockSetPrimaryFrameTab and mockSetPinnedPrimaryFrameTab actions were dispatched with the correct payload
    expect(mockDispatch).toHaveBeenCalledWith(mockSetPrimaryFrameTab(tabName));
    expect(mockDispatch).toHaveBeenCalledWith(
      mockSetPinnedPrimaryFrameTab(tabName)
    );
  });

});
