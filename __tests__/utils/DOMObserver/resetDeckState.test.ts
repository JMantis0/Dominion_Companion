import { describe, it, expect, jest } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import {
  setOpponentDeck,
  setPlayerDeck,
} from "../../../src/redux/contentSlice";
import { EmptyOpponentDeck } from "../../../src/model/emptyOpponentDeck";
import { EmptyDeck } from "../../../src/model/emptyDeck";

describe("resetDeckState", () => {
  // Mock dependencies
  const dispatch = jest.spyOn(DOMObserver, "dispatch");

  it("should dispatch the setPlayerDeck and setOpponentDeck ActionCreators with empty decks", () => {
    // Act - call resetDeckState
    DOMObserver.resetDeckState();
    // Assert
    expect(dispatch).toBeCalledTimes(2);
    expect(dispatch).nthCalledWith(
      1,
      setOpponentDeck(JSON.parse(JSON.stringify(new EmptyOpponentDeck())))
    );
    expect(dispatch).nthCalledWith(
      2,
      setPlayerDeck(JSON.parse(JSON.stringify(new EmptyDeck())))
    );
  });
});
