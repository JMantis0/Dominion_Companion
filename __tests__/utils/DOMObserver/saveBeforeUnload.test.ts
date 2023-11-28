import { describe, jest, it, expect } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
import { Deck } from "../../../src/model/deck";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { store } from "../../../src/redux/store";
import { setGameActiveStatus } from "../../../src/redux/contentSlice";

describe("saveBeforeUnload", () => {
  // Spy on dependency
  const saveGameData = jest
    .spyOn(DOMObserver, "saveGameData")
    .mockResolvedValue();

  it("should call saveGameData correctly", () => {
    // Arrange
    DOMObserver.gameLog = "Mock Log";
    const mockDeckMap = new Map([
      ["Player", new Deck("", false, "", "Player", "P", [])],
      ["Opponent", new OpponentDeck("", false, "", "Opponent", "O", [])],
    ]);
    DOMObserver.decks = mockDeckMap;
    store.dispatch(setGameActiveStatus(true));

    // Act
    DOMObserver.saveBeforeUnload();

    // Assert
    expect(saveGameData).toBeCalledWith("Mock Log", mockDeckMap);
  });
});
