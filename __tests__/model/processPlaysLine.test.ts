import { describe, it, expect, jest } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function processPlaysLine()", () => {
  it("should process regular plays from hand correctly", () => {
    //Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive = [
      "Turn 21 - GoodBeard",
      "pNick plays a Market.",
      "pNick draws a Vassal.",
      "pNick gets +1 Action.",
      "pNick gets +1 Buy.",
      "pNick gets +$1.",
    ];
    deck.setLogArchive(logArchive);

    // Arguments for function being tested.
    const line = "pNick plays a Vassal.";
    const cards = ["Vassal"];
    const numberOfCards = [1];

    // Mock function dependencies
    const checkForVassalPlay = jest
      .spyOn(Deck.prototype, "checkForVassalPlay")
      .mockImplementation(() => false);
    const playFromDiscard = jest.spyOn(Deck.prototype, "playFromDiscard");
    const play = jest
      .spyOn(Deck.prototype, "play")
      .mockImplementation(() => null);

    // Act - Simulate playing a card from hand (Vassal)
    deck.processPlaysLine(line, cards, numberOfCards);

    // Assert
    expect(checkForVassalPlay).toBeCalledTimes(1);
    expect(play).toBeCalledTimes(1);
    expect(play).toBeCalledWith("Vassal");
    expect(playFromDiscard).not.toBeCalled();
  });

  it("should process plays from discard correctly", () => {
    //Arrange
    const deck = new Deck("", false, "", "pNick", "pName", []);
    const logArchive = [
      "Turn 8 - GoodBeard",
      "pNick plays a Vassal.",
      "pNick gets +$2.",
      "pNick discards a Moneylender.",
    ];
    deck.setLogArchive(logArchive);

    // Arguments for function being tested.
    const line = "pNick plays a MoneylenderF.";
    const cards = ["Moneylender"];
    const numberOfCards = [1];

    // Mock function dependencies
    const checkForVassalPlay = jest
      .spyOn(Deck.prototype, "checkForVassalPlay")
      .mockImplementation(() => true);
    const playFromDiscard = jest
      .spyOn(Deck.prototype, "playFromDiscard")
      .mockImplementation(() => null);
    const play = jest
      .spyOn(Deck.prototype, "play")
      .mockImplementation(() => null);
    // Act - Simulate playing a card from discard (Moneylender).
    deck.processPlaysLine(line, cards, numberOfCards);

    // Assert
    expect(checkForVassalPlay).toBeCalledTimes(1);
    expect(playFromDiscard).toBeCalledTimes(1);
    expect(playFromDiscard).toBeCalledWith("Moneylender");
    expect(play).not.toBeCalled();
  });
});
