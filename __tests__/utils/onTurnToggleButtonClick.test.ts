import { onTurnToggleButtonClick } from "../../src/utils/utils";
import { describe, it, expect, jest } from "@jest/globals";
import { Dispatch, AnyAction } from "redux";
import {
  setPinnedTurnToggleButton,
  setTurnToggleButton,
} from "../../src/redux/contentSlice";

describe("onTurnToggleButtonClick", () => {
  it("should dispatch setPinnedTurnToggleButton and setTurnToggleButton with the provided buttonName", () => {
    // Arrange
    const mockButtonName = "Current";
    const mockDispatch: Dispatch<AnyAction> = jest.fn() as jest.MockedFunction<
      Dispatch<AnyAction>
    >;
    const mockSetPinnedTurnToggleButton =
      setPinnedTurnToggleButton as jest.MockedFunction<
        typeof setPinnedTurnToggleButton
      >;
    const mockSetTurnToggleButton = setTurnToggleButton as jest.MockedFunction<
      typeof setTurnToggleButton
    >;

    // Act
    onTurnToggleButtonClick(
      mockButtonName,
      mockDispatch,
      mockSetPinnedTurnToggleButton,
      setTurnToggleButton
    );

    // Assert
    expect(mockDispatch).toHaveBeenCalledWith(
      mockSetPinnedTurnToggleButton(mockButtonName)
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      mockSetTurnToggleButton(mockButtonName)
    );
  });
});
