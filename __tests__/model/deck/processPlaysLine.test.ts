import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("processPlaysLine", () => {
  // Declare Deck reference.
  let deck = new Deck("", false, "", "pNick", "pName", []);
  // mock checkForVassalPlay
  const checkForVassalPlay = jest.spyOn(Deck.prototype, "checkForVassalPlay");
  const checkForCourierPlay = jest.spyOn(Deck.prototype, "checkForCourierPlay");

  beforeEach(() => {
    jest.resetAllMocks();
    deck = new Deck("", false, "", "pNick", "pName", []);
  });

  it("should play cards that are played normally from hand.", () => {
    //Arrange
    deck.latestAction = "Market";
    deck.hand = ["Chapel", "Market"];
    deck.inPlay = ["Cellar"];
    deck.graveyard = ["Estate"];
    checkForVassalPlay.mockReturnValue(false);
    // Arguments for function being tested.
    const line = "pNick plays a Market.";
    const cards = ["Market"];
    const numberOfCards = [1];

    // Act - Simulate playing a card from hand
    deck.processPlaysLine(line, cards, numberOfCards);

    // Assert - Verify card was moved from hand to inPlay
    expect(deck.hand).toStrictEqual(["Chapel"]);
    expect(deck.inPlay).toStrictEqual(["Cellar", "Market"]);
    // Verify graveyard was not changed
    expect(deck.graveyard).toStrictEqual(["Estate"]);
  });

  it("should play cards played by Vassal from graveyard.", () => {
    //Arrange
    deck.latestAction = "Vassal";
    deck.hand = ["Copper", "Copper"];
    deck.inPlay = ["Vassal"];
    deck.graveyard = ["Moneylender", "Estate"];
    checkForVassalPlay.mockReturnValue(true);
    // Arguments for function being tested.
    const line = "pNick plays a Moneylender.";
    const cards = ["Moneylender"];
    const numberOfCards = [1];

    // Act - Simulate playing a card from discard.
    deck.processPlaysLine(line, cards, numberOfCards);

    // Assert - Verify the card was played from the graveyard
    expect(deck.graveyard).toStrictEqual(["Estate"]);
    expect(deck.inPlay).toStrictEqual(["Vassal", "Moneylender"]);
    // Verify hand is unchanged
    expect(deck.hand).toStrictEqual(["Copper", "Copper"]);
  });

  it("should play Action cards played by Courier from graveyard.", () => {
    //Arrange
    deck.latestAction = "Courier";
    deck.hand = ["Copper", "Copper"];
    deck.inPlay = ["Vassal"];
    deck.graveyard = ["Moneylender", "Estate"];
    checkForCourierPlay.mockReturnValue(true);
    // Arguments for function being tested.
    const line = "pNick plays a Moneylender.";
    const cards = ["Moneylender"];
    const numberOfCards = [1];

    // Act - Simulate playing a card from discard.
    deck.processPlaysLine(line, cards, numberOfCards);

    // Assert - Verify the card was played from the graveyard
    expect(deck.graveyard).toStrictEqual(["Estate"]);
    expect(deck.inPlay).toStrictEqual(["Vassal", "Moneylender"]);
    // Verify hand is unchanged
    expect(deck.hand).toStrictEqual(["Copper", "Copper"]);
  });

  it("should play Treasure cards played by Courier from graveyard.", () => {
    //Arrange
    deck.latestAction = "Courier";
    deck.hand = ["Copper", "Copper"];
    deck.inPlay = ["Vassal"];
    deck.graveyard = ["Silver", "Estate"];
    checkForCourierPlay.mockReturnValue(true);
    // Arguments for function being tested.
    const line = "pNick plays a Silver.";
    const cards = ["Silver"];
    const numberOfCards = [1];

    // Act - Simulate playing a card from discard.
    deck.processPlaysLine(line, cards, numberOfCards);

    // Assert - Verify the card was played from the graveyard
    expect(deck.graveyard).toStrictEqual(["Estate"]);
    expect(deck.inPlay).toStrictEqual(["Vassal", "Silver"]);
    // Verify hand is unchanged
    expect(deck.hand).toStrictEqual(["Copper", "Copper"]);
  });

  it("should take no action for a card played again by a Throne Room.", () => {
    //Arrange
    deck.latestAction = "Remodel";
    deck.hand = ["Copper", "Estate"];
    deck.inPlay = ["Remodel"];
    deck.graveyard = ["Estate"];
    checkForVassalPlay.mockReturnValue(false);
    const line = "pNick plays a Remodel again.";
    const cards = ["Remodel"];
    const numberOfCards = [1];

    // Act - Simulate playing a card Again with a Throne Room.
    deck.processPlaysLine(line, cards, numberOfCards);

    // Assert - Verify the graveyard, hand, inPlay, are unchanged
    expect(deck.hand).toStrictEqual(["Copper", "Estate"]);
    expect(deck.inPlay).toStrictEqual(["Remodel"]);
    expect(deck.graveyard).toStrictEqual(["Estate"]);
  });

  it("should not check for vassal plays if the line is playing a treasure", () => {
    //  Arrange a scenario where the card being played is a treasure.
    deck.hand = ["Copper"];
    const line = "pNick plays a Copper.";
    const cards = ["Copper"];
    const numberOfCards = [1];
    // Act - Simulate playing a Copper from hand
    deck.processPlaysLine(line, cards, numberOfCards);

    // Assert
    expect(checkForVassalPlay).not.toBeCalled();
  });

  it("should setLatestPlaySource to 'Vassal' when the play being processed is caused by a Vassal", () => {
    // Arrange
    // Mock true response from checkForVassalPlay()
    checkForVassalPlay.mockReturnValue(true);
    deck.graveyard = ["Sentry"];
    const line = "pNick plays a Sentry.";
    const cards = ["Sentry"];
    const numberOfCards = [1];

    // Act simulate playing a Sentry from discard with a Vassal.
    deck.processPlaysLine(line, cards, numberOfCards);
    expect(deck.latestPlaySource).toBe("Vassal");
  });

  it("should setLatestPlaySource to 'Courier' when the play being processed is caused by a Courier", () => {
    // Arrange
    // Mock true response from checkForVassalPlay()
    checkForCourierPlay.mockReturnValue(true);
    deck.graveyard = ["Copper"];
    const line = "pNick plays a Copper.";
    const cards = ["Copper"];
    const numberOfCards = [1];

    // Act simulate playing a Sentry from discard with a Vassal.
    deck.processPlaysLine(line, cards, numberOfCards);
    expect(deck.latestPlaySource).toBe("Courier");
  });

  it("should setLatestPlaySource to 'Hand' when the play being processed is played from Hand", () => {
    // Arrange
    // Mock true response from checkForVassalPlay()
    checkForCourierPlay.mockReturnValue(false);
    checkForVassalPlay.mockReturnValue(false);
    deck.hand = ["Copper"];
    const line = "pNick plays a Copper.";
    const cards = ["Copper"];
    const numberOfCards = [1];

    // Act simulate playing a Sentry from discard with a Vassal.
    deck.processPlaysLine(line, cards, numberOfCards);
    expect(deck.latestPlaySource).toBe("Hand");
  });

  it("should setLatestPlaySource to 'Throne Room' when the play being processed is played by a Throne Room", () => {
    // Arrange
    // Mock true response from checkForVassalPlay()
    checkForCourierPlay.mockReturnValue(false);
    checkForVassalPlay.mockReturnValue(false);
    const line = "pNick plays a Sentry again.";
    const cards = ["Sentry"];
    const numberOfCards = [1];

    // Act simulate playing a Sentry from discard with a Vassal.
    deck.processPlaysLine(line, cards, numberOfCards);
    expect(deck.latestPlaySource).toBe("Throne Room");
  });
});
