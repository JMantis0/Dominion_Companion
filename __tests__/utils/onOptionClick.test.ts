import { it, expect, describe, jest } from "@jest/globals";
import { Dispatch, AnyAction } from "redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import {
  setPinnedTopCardsLookAmount,
  setTopCardsLookAmount,
} from "../../src/redux/contentSlice";
import { onOptionClick } from "../../src/utils/utils";

describe("onOptionClick", () => {
  it("should dispatch setTopCardsLookAmount and setPinnedTopCardsLookAmount actions with the provided cardAmount", () => {
    // Arrange - Create mock functions and values
    const cardAmount = 3;
    const mockDispatch: Dispatch<AnyAction> = jest.fn() as jest.MockedFunction<
      Dispatch<AnyAction>
    >;
    const mockSetTopCardsLookAmount: ActionCreatorWithPayload<
      number,
      "content/setTopCardsLookAmount"
    > = setTopCardsLookAmount as jest.MockedFunction<
      typeof setTopCardsLookAmount
    >;
    const mockSetPinnedTopCardsLookAmount: ActionCreatorWithPayload<
      number,
      "content/setPinnedTopCardsLookAmount"
    > = setPinnedTopCardsLookAmount as jest.MockedFunction<
      typeof setPinnedTopCardsLookAmount
    >;

    // Act - Call the function
    onOptionClick(
      cardAmount,
      mockDispatch,
      mockSetTopCardsLookAmount,
      mockSetPinnedTopCardsLookAmount
    );

    // Assert - Check if both mockSetTopCardsLookAmount and setPinnedTopCardsLookAmount actions were dispatched with the correct payload
    expect(mockDispatch).toHaveBeenCalledWith(
      mockSetTopCardsLookAmount(cardAmount)
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      setPinnedTopCardsLookAmount(cardAmount)
    );
  });

});
