import { describe, it, expect, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function processTopDecksLine()", () => {
  it("should handle trashing a card from hand correctly", () => {
    //Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive = ["Turn 3 - GoodBeard", "G plays a Moneylender."];
    deck.setLogArchive(logArchive);

    // Arguments for function being tested.
    const cards = ["Copper"];
    const numberOfCards = [1];

    // Mock function dependencies
    const getMostRecentPlay = jest.spyOn(Deck.prototype, "getMostRecentPlay");
    const trashFromLibrary = jest
      .spyOn(Deck.prototype, "trashFromLibrary")
      .mockImplementation(() => null);
    const trashFromHand = jest
      .spyOn(Deck.prototype, "trashFromHand")
      .mockImplementation(() => null);
    const removeCardFromEntireDeck = jest
      .spyOn(Deck.prototype, "removeCardFromEntireDeck")
      .mockImplementation(() => null);

    // Act - simulate trashing a Copper from hand by a Moneylender.
    deck.processTrashesLine(cards, numberOfCards);

    // Assert
    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(getMostRecentPlay).toBeCalledWith(logArchive);
    expect(getMostRecentPlay.mock.results[0].value).toBe("Moneylender");
    expect(trashFromHand).toBeCalledTimes(1);
    expect(trashFromHand).toBeCalledWith("Copper");
    expect(removeCardFromEntireDeck).toBeCalledTimes(1);
    expect(removeCardFromEntireDeck).toBeCalledWith("Copper");
    expect(trashFromLibrary).not.toBeCalled();
  });

  it("should handle trashing a card from library correctly", () => {
    // Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive = [
      "Turn 6 - GoodBeard",
      "G plays a Sentry.",
      "G draws a Poacher.",
      "G gets +1 Action.",
      "G looks at a Silver and an Copper.",
    ];
    deck.setLogArchive(logArchive);

    // Arguments for function being tested.
    const cards = ["Estate", "Copper"];
    const numberOfCards = [1, 1];

    // Mock function dependencies
    const getMostRecentPlay = jest.spyOn(Deck.prototype, "getMostRecentPlay");
    const trashFromLibrary = jest
      .spyOn(Deck.prototype, "trashFromLibrary")
      .mockImplementation(() => null);
    const trashFromHand = jest
      .spyOn(Deck.prototype, "trashFromHand")
      .mockImplementation(() => null);
    const removeCardFromEntireDeck = jest
      .spyOn(Deck.prototype, "removeCardFromEntireDeck")
      .mockImplementation(() => null);

    // Act - simulate trashing a Copper from hand by a Moneylender.
    deck.processTrashesLine(cards, numberOfCards);

    // Assert
    expect(getMostRecentPlay).toBeCalledTimes(1);
    expect(getMostRecentPlay).toBeCalledWith(logArchive);
    expect(getMostRecentPlay.mock.results[0].value).toBe("Sentry");
    expect(trashFromLibrary).toBeCalledTimes(2);
    expect(trashFromLibrary).nthCalledWith(1, "Estate");
    expect(trashFromLibrary).nthCalledWith(2, "Copper");
    expect(removeCardFromEntireDeck).toBeCalledTimes(2);
    expect(removeCardFromEntireDeck).nthCalledWith(1, "Estate");
    expect(removeCardFromEntireDeck).nthCalledWith(2, "Copper");
    expect(trashFromHand).not.toBeCalled();
  });
});
