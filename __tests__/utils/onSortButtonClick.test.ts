import { describe, it, expect, jest } from "@jest/globals";
import { AnyAction, Dispatch } from "redux";
import { onSortButtonClick } from "../../src/utils/utils";
import { SortButtonState, SortCategory, SortReducer } from "../../src/utils";
import { setDiscardSortState } from "../../src/redux/contentSlice";

describe("onSortButtonClick", () => {
  it("should dispatch SortReducer wish ascending sort when clicking a different category", () => {
    // Arrange
    const mockSortCategory: SortCategory = "owned";
    const mockCurrentSortButtonState: SortButtonState = {
      category: "card",
      sort: "descending",
    };
    const mockDispatch: Dispatch<AnyAction> = jest.fn() as jest.MockedFunction<
      Dispatch<AnyAction>
    >;
    const mockSortReducer: SortReducer =
      setDiscardSortState as jest.MockedFunction<SortReducer>;
    // Act
    onSortButtonClick(
      mockSortCategory,
      mockCurrentSortButtonState,
      mockDispatch,
      mockSortReducer
    );

    // Assert
    expect(mockDispatch).toHaveBeenCalledWith(
      mockSortReducer({
        category: mockSortCategory,
        sort: "ascending",
      })
    );
  });

  it("should toggle between ascending and descending (ascending to descending) sort when clicking the same category", () => {
    // Arrange
    const mockSortCategory: SortCategory = "probability";
    const mockCurrentSortButtonState: SortButtonState = {
      category: "probability",
      sort: "ascending",
    };
    const mockDispatch: Dispatch<AnyAction> = jest.fn() as jest.MockedFunction<
      Dispatch<AnyAction>
    >;
    const mockSortReducer: SortReducer =
      setDiscardSortState as jest.MockedFunction<SortReducer>;

    // Act
    onSortButtonClick(
      mockSortCategory,
      mockCurrentSortButtonState,
      mockDispatch,
      mockSortReducer
    );

    // Assert
    expect(mockDispatch).toHaveBeenCalledWith(
      mockSortReducer({
        category: mockSortCategory,
        sort: "descending",
      })
    );
  });

  it("should toggle between ascending and descending (descending to ascending) sort when clicking the same category", () => {
    // Arrange
    const mockSortCategory: SortCategory = "probability";
    const mockCurrentSortButtonState: SortButtonState = {
      category: "probability",
      sort: "descending",
    };
    const mockDispatch: Dispatch<AnyAction> = jest.fn() as jest.MockedFunction<
      Dispatch<AnyAction>
    >;
    const mockSortReducer: SortReducer =
      setDiscardSortState as jest.MockedFunction<SortReducer>;

    // Act
    onSortButtonClick(
      mockSortCategory,
      mockCurrentSortButtonState,
      mockDispatch,
      mockSortReducer
    );

    // Assert
    expect(mockDispatch).toHaveBeenCalledWith(
      mockSortReducer({
        category: mockSortCategory,
        sort: "ascending",
      })
    );
  });
});
