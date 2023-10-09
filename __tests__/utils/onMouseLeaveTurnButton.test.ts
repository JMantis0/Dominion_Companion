import { it, expect, describe, jest } from "@jest/globals";
import { AnyAction, Dispatch } from "redux";
import { setTurnToggleButton } from "../../src/redux/contentSlice";
import { onMouseLeaveTurnButton } from "../../src/utils/utils";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

describe("Function onMouseEnterTurnButton()", () => {
  it("should dispatch the setTurnToggleButton action with the provided buttonName", () => {
    const pinnedButtonName = "Current";
    const mockDispatch: Dispatch<AnyAction> = jest.fn() as jest.MockedFunction<
      Dispatch<AnyAction>
    >;
    const mockSetToggleTurnButton: ActionCreatorWithPayload<
      "Current" | "Next",
      "content/setTurnToggleButton"
    > = setTurnToggleButton as jest.MockedFunction<typeof setTurnToggleButton>;
    // Act
    onMouseLeaveTurnButton(
      pinnedButtonName,
      mockDispatch,
      mockSetToggleTurnButton
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      mockSetToggleTurnButton(pinnedButtonName)
    );
  });
});
