import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function drawLookedAtCardIfNeeded()", () => {
  const deck = new Deck("", false, "", "pName", "pNick", []);
  const libraryTriggeredPreviousLineDraw = jest.spyOn(
    Deck.prototype,
    "libraryTriggeredPreviousLineDraw"
  );
  const drawCardFromPreviousLine = jest
    .spyOn(Deck.prototype, "drawCardFromPreviousLine")
    .mockImplementation(() => null);
  const setWaitToDrawLibraryLook = jest.spyOn(
    Deck.prototype,
    "setWaitToDrawLibraryLook"
  );
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should draw the card that was looked at on the previous line, if needed()", () => {
    // Arrange
    const act = "plays";
    libraryTriggeredPreviousLineDraw.mockImplementation(() => true);

    // Act - Simulate an update where a draw from the previous line's Library action is needed
    deck.drawLookedAtCardIfNeeded(act);

    // Assert
    expect(libraryTriggeredPreviousLineDraw).toBeCalledTimes(1);
    expect(libraryTriggeredPreviousLineDraw).toBeCalledWith("plays");
    expect(libraryTriggeredPreviousLineDraw.mock.results[0].value).toBe(true);
    expect(drawCardFromPreviousLine).toBeCalledTimes(1);
    expect(setWaitToDrawLibraryLook).toBeCalledTimes(1);
    expect(setWaitToDrawLibraryLook).toBeCalledWith(false);
  });

  it("should not draw the card that was looked at on the previous line, if not needed", () => {
    // Arrange
    const act = "aside with Library";
    libraryTriggeredPreviousLineDraw.mockImplementation(() => false);

    // Act - Simulate an update where a draw from the previous line's Library action is needed
    deck.drawLookedAtCardIfNeeded(act);

    // Assert
    expect(libraryTriggeredPreviousLineDraw).toBeCalledTimes(1);
    expect(libraryTriggeredPreviousLineDraw).toBeCalledWith(
      "aside with Library"
    );
    expect(libraryTriggeredPreviousLineDraw.mock.results[0].value).toBe(false);
    expect(drawCardFromPreviousLine).not.toBeCalled();
    expect(setWaitToDrawLibraryLook).toBeCalledTimes(1);
    expect(setWaitToDrawLibraryLook).toBeCalledWith(false);
  });
});
