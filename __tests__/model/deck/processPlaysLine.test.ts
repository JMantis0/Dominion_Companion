import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function processRevealsLine()", () => {
  let deck = new Deck("", false, "", "pNick", "pName", []);
  // Mock function dependencies
  const checkForVassalPlay = jest
    .spyOn(Deck.prototype, "checkForVassalPlay")
    .mockImplementation(() => false);
  const playFromDiscard = jest
    .spyOn(Deck.prototype, "playFromDiscard")
    .mockImplementation(() => null);
  const play = jest
    .spyOn(Deck.prototype, "play")
    .mockImplementation(() => null);
  afterEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "pNick", "pName", []);
  });
  it("should process regular plays from hand correctly", () => {
    //Arrange
    deck.latestPlay = "Market";
    // Arguments for function being tested.
    const line = "pNick plays a Vassal.";
    const cards = ["Vassal"];
    const numberOfCards = [1];

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
    deck.latestPlay = "Vassal";
    checkForVassalPlay.mockImplementation(() => true);
    // Arguments for function being tested.
    const line = "pNick plays a Moneylender.";
    const cards = ["Moneylender"];
    const numberOfCards = [1];
    // Act - Simulate playing a card from discard (Moneylender).
    deck.processPlaysLine(line, cards, numberOfCards);

    // Assert
    expect(checkForVassalPlay).toBeCalledTimes(1);
    expect(playFromDiscard).toBeCalledTimes(1);
    expect(playFromDiscard).toBeCalledWith("Moneylender");
    expect(play).not.toBeCalled();
  });

  it("should do nothing if card is being played again by a Throne Room", () => {
    //Arrange
    const line = "pNick plays a Remodel again.";
    const cards = ["Remodel"];
    const numberOfCards = [1];
    // Act - Simulate playing a card from discard (Moneylender).
    deck.processPlaysLine(line, cards, numberOfCards);

    // Assert
    expect(checkForVassalPlay).toBeCalledTimes(1);
    expect(playFromDiscard).not.toBeCalled();
    expect(play).not.toBeCalled();
  });
});
