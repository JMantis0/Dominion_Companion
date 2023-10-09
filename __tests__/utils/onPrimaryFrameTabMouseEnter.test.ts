import { onPrimaryFrameTabMouseEnter } from "../../src/utils/utils";
import { Dispatch, AnyAction } from "redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { it, expect, describe, jest } from "@jest/globals";
import { setPrimaryFrameTab } from "../../src/redux/contentSlice";
import { PrimaryFrameTabType } from "../../src/utils";

describe("onPrimaryFrameTabMouseEnter", () => {
  it("should dispatch setPrimaryFrameTab action with the provided tabName", () => {
    // Arrange - Create mock functions and values
    const tabName = "Trash"; // Replace with an actual tab name
    const mockDispatch: Dispatch<AnyAction> = jest.fn() as jest.MockedFunction<
      Dispatch<AnyAction>
    >;
    const mockSetPrimaryFrameTab: ActionCreatorWithPayload<
      PrimaryFrameTabType,
      "content/setPrimaryFrameTab"
    > = setPrimaryFrameTab as jest.MockedFunction<typeof setPrimaryFrameTab>;

    // Act - Call the function
    onPrimaryFrameTabMouseEnter(tabName, mockDispatch, mockSetPrimaryFrameTab);

    // Assert - Check if the mockSetPrimaryFrameTab action was dispatched with the correct payload
    expect(mockDispatch).toHaveBeenCalledWith(mockSetPrimaryFrameTab(tabName));
  });

  // Add more test cases as needed
});
