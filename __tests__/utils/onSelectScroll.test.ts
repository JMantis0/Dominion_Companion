import { describe, it, expect, jest } from "@jest/globals";
import { AnyAction, Dispatch } from "redux";
import { setSelectScrollPosition } from "../../src/redux/contentSlice";
import { onSelectScroll } from "../../src/utils/utils";

describe("Function onSelectScroll()", () => {
  // Mock dependencies
  const mockScrollPosition: number = 29.4;
  const mockDispatch: Dispatch<AnyAction> = jest.fn() as jest.MockedFunction<
    Dispatch<AnyAction>
  >;
  const mockSetSelectScrollPosition =
    setSelectScrollPosition as jest.MockedFunction<
      typeof setSelectScrollPosition
    >;

  it("should dispatch setSelectScrollPosition action with the provided scrollPosition", () => {
    //Act
    onSelectScroll(
      mockScrollPosition,
      mockDispatch,
      mockSetSelectScrollPosition
    );
    // Assert
    expect(mockDispatch).toHaveBeenCalledWith(
      mockSetSelectScrollPosition(mockScrollPosition)
    );
  });
});
