import { Dispatch, AnyAction } from "redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { onMouseLeaveOption } from "../../src/utils/utils";
import { describe, it, expect, jest } from "@jest/globals";
import { setTopCardsLookAmount } from "../../src/redux/contentSlice";

describe("onMouseLeaveOption", () => {
  it("should dispatch the setTopCardsLookAmount action with the provided pinnedCardAmount", () => {
    // Arrange - Create mock functions and values
    const pinnedCardAmount = 5;
    const mockDispatch: Dispatch<AnyAction> = jest.fn() as jest.MockedFunction<
      Dispatch<AnyAction>
    >;
    const mockSetTopCardsLookAmount: ActionCreatorWithPayload<
      number,
      "content/setTopCardsLookAmount"
    > = setTopCardsLookAmount as jest.MockedFunction<
      typeof setTopCardsLookAmount
    >;
    // Act - Call the function
    onMouseLeaveOption(
      pinnedCardAmount,
      mockDispatch,
      mockSetTopCardsLookAmount
    );

    // Assert - Check if the setTopCardsLookAmount action was mockDispatched with the correct payload
    expect(mockDispatch).toHaveBeenCalledWith(
      mockSetTopCardsLookAmount(pinnedCardAmount)
    );
  });
});
