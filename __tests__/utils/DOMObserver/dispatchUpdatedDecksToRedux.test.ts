import { expect, describe, it, jest } from "@jest/globals";
import { AnyAction, Dispatch } from "redux";
import {
  setOpponentDeck,
  setPlayerDeck,
} from "../../../src/redux/contentSlice";
import { OpponentStoreDeck, StoreDeck } from "../../../src/utils";
import { Deck } from "../../../src/model/deck";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("Function dispatchUpdatedDecksToRedux()", () => {
  // Arrange
  const dispatchMock: Dispatch<AnyAction> = jest.fn() as jest.MockedFunction<
    Dispatch<AnyAction>
  >;
  const playerStoreDeck = new Deck(
    "",
    false,
    "",
    "pName",
    "pNick",
    []
  ) as StoreDeck;
  const opponentStoreDeck = new OpponentDeck(
    "",
    false,
    "",
    "oName",
    "oNick",
    []
  ) as OpponentStoreDeck;

  it("should dispatch the setPlayerDeck and setOpponentDeck actions with the provided decks.", () => {
    // Act - simulate dispatching the actions with the provided decks.
    DOMObserver.dispatchUpdatedDecksToRedux(
      dispatchMock,
      setPlayerDeck,
      setOpponentDeck,
      playerStoreDeck,
      opponentStoreDeck
    );

    // Assert
    expect(dispatchMock).toBeCalledTimes(2);
    expect(dispatchMock).nthCalledWith(1, setPlayerDeck(playerStoreDeck));
    expect(dispatchMock).nthCalledWith(2, setOpponentDeck(opponentStoreDeck));
  });
});
