import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { onSortButtonClick } from "../../src/utils/utils";
import { SortButtonState, SortCategory } from "../../src/utils";
import { SetStateAction } from "react";

describe("onSortButtonClick", () => {
  const setSortButtonStateMock = jest.fn() as jest.MockedFunction<
    React.Dispatch<SetStateAction<SortButtonState>>
  >;
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should dispatch SortReducer wish ascending sort when clicking a different category", () => {
    // Arrange
    const mockSortCategory: SortCategory = "owned";
    const mockCurrentSortButtonState: SortButtonState = {
      category: "card",
      sort: "descending",
    };

    // Act
    onSortButtonClick(
      mockSortCategory,
      mockCurrentSortButtonState,
      setSortButtonStateMock
    );

    // Assert
    expect(setSortButtonStateMock).toHaveBeenCalledWith({
      category: mockSortCategory,
      sort: "ascending",
    });
  });

  it("should toggle between ascending and descending (ascending to descending) sort when clicking the same category", () => {
    // Arrange
    const mockSortCategory: SortCategory = "probability";
    const mockCurrentSortButtonState: SortButtonState = {
      category: "probability",
      sort: "ascending",
    };

    // Act
    onSortButtonClick(
      mockSortCategory,
      mockCurrentSortButtonState,
      setSortButtonStateMock
    );

    // Assert
    expect(setSortButtonStateMock).toHaveBeenCalledWith({
      category: mockSortCategory,
      sort: "descending",
    });
  });

  it("should toggle between ascending and descending (descending to ascending) sort when clicking the same category", () => {
    // Arrange
    const mockSortCategory: SortCategory = "probability";
    const mockCurrentSortButtonState: SortButtonState = {
      category: "probability",
      sort: "descending",
    };

    // Act
    onSortButtonClick(
      mockSortCategory,
      mockCurrentSortButtonState,
      setSortButtonStateMock
    );

    // Assert
    expect(setSortButtonStateMock).toHaveBeenCalledWith({
      category: mockSortCategory,
      sort: "ascending",
    });
  });
});
