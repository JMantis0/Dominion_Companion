import { describe, it, expect, jest } from "@jest/globals";
import { onToggleSelect } from "../../src/utils/utils";
import { SetStateAction } from "react";

describe("Function onToggleSelect()", () => {
  it("should dispatch setSelectOpen with the logical opposite of the current selectState", () => {
    // Arrange mocks
    const mockCurrentSelectState: boolean = true;

    const mockSetSelectOpen: React.Dispatch<SetStateAction<boolean>> =
      jest.fn() as jest.MockedFunction<React.Dispatch<SetStateAction<boolean>>>;

    // Act
    onToggleSelect(mockCurrentSelectState, mockSetSelectOpen);
    // Assert
    expect(mockSetSelectOpen).toHaveBeenCalledWith(!mockCurrentSelectState);
  });

  it("should toggle the selectState by calling setSelectOpen with the opposite value", () => {
    // Arrange
    const selectState = true;
    const setSelectOpen: React.Dispatch<SetStateAction<boolean>> = jest.fn();

    // Act
    onToggleSelect(selectState, setSelectOpen);

    // Assert
    expect(setSelectOpen).toHaveBeenCalledWith(!selectState);
  });

  it("should toggle the selectState when it is false", () => {
    // Arrange
    const selectState = false;
    const setSelectOpen: React.Dispatch<SetStateAction<boolean>> = jest.fn();

    // Act
    onToggleSelect(selectState, setSelectOpen);

    // Assert
    expect(setSelectOpen).toHaveBeenCalledWith(!selectState);
  });
});
