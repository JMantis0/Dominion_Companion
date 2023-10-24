import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Method processRevealsLine()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pNick", "pName", []);
  // Spy on method dependencies
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

  it("should play cards that are played normally from hand.", () => {
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

  it("should play cards played by Vassal from graveyard.", () => {
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

  it("should take no action for a card played again by a Throne Room.", () => {
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
