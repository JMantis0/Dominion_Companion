import { describe, it, expect, jest } from "@jest/globals";
import { AnyAction, Dispatch } from "redux";
import { onPrimaryFrameTabMouseLeave } from "../../src/utils/utils";
import { PrimaryFrameTabType } from "../../src/utils";
import { setPrimaryFrameTab } from "../../src/redux/contentSlice";

describe("Function onPrimaryFrameTabMouseLeave()", () => {
  const mockTabName: PrimaryFrameTabType = "Opponent";
  const mockDispatch = jest.fn() as jest.MockedFunction<Dispatch<AnyAction>>;
  const mockSetPrimaryFrameTab = setPrimaryFrameTab as jest.MockedFunction<
    typeof setPrimaryFrameTab
  >;

  it("should dispatch setPrimaryFrameTab action with the pinnedTabName", () => {
    onPrimaryFrameTabMouseLeave(
      mockTabName,
      mockDispatch,
      mockSetPrimaryFrameTab
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      mockSetPrimaryFrameTab(mockTabName)
    );
  });
});
