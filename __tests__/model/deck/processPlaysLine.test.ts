import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("processPlaysLine", () => {
  // Declare Deck reference.
  let deck = new Deck("", false, "", "pNick", "pName", []);
  // mock checkForVassalPlay
  const checkForNonHandPlay = jest.spyOn(Deck.prototype, "checkForNonHandPlay");
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
    checkForNonHandPlay.mockReturnValue("None");
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
    // Verify latestPlaySource was set correctly.
    expect(deck.latestPlaySource).toBe("Hand");
  });

  it("should play cards played by Vassal from graveyard.", () => {
    //Arrange
    deck.latestAction = "Vassal";
    deck.hand = ["Copper", "Copper"];
    deck.inPlay = ["Vassal"];
    deck.graveyard = ["Moneylender", "Estate"];
    checkForNonHandPlay.mockReturnValue("Vassal");
    // Arguments for function being tested.
    const line = "pNick plays a Moneylender.";
    const cards = ["Moneylender"];
    const numberOfCards = [1];

    // Act - Simulate playing a card from discard with Vassal.
    deck.processPlaysLine(line, cards, numberOfCards);

    // Assert - Verify the card was played from the graveyard
    expect(deck.graveyard).toStrictEqual(["Estate"]);
    expect(deck.inPlay).toStrictEqual(["Vassal", "Moneylender"]);
    // Verify hand is unchanged
    expect(deck.hand).toStrictEqual(["Copper", "Copper"]);
    // Verify latestPlaySource was set correctly.
    expect(deck.latestPlaySource).toBe("Vassal");
  });

  it("should play Action cards played by Courier from graveyard.", () => {
    //Arrange
    deck.latestAction = "Courier";
    deck.hand = ["Copper", "Copper"];
    deck.inPlay = ["Vassal"];
    deck.graveyard = ["Moneylender", "Estate"];
    checkForNonHandPlay.mockReturnValue("Courier");
    // Arguments for function being tested.
    const line = "pNick plays a Moneylender.";
    const cards = ["Moneylender"];
    const numberOfCards = [1];

    // Act - Simulate playing an Action card from discard with Courier.
    deck.processPlaysLine(line, cards, numberOfCards);

    // Assert - Verify the card was played from the graveyard
    expect(deck.graveyard).toStrictEqual(["Estate"]);
    expect(deck.inPlay).toStrictEqual(["Vassal", "Moneylender"]);
    // Verify hand is unchanged
    expect(deck.hand).toStrictEqual(["Copper", "Copper"]);
    // Verify latestPlaySource was set correctly.
    expect(deck.latestPlaySource).toBe("Courier");
  });

  it("should play Treasure cards played by Courier from graveyard.", () => {
    //Arrange
    deck.latestAction = "Courier";
    deck.hand = ["Copper", "Copper"];
    deck.inPlay = ["Vassal"];
    deck.graveyard = ["Silver", "Estate"];
    checkForNonHandPlay.mockReturnValue("Courier");
    // Arguments for function being tested.
    const line = "pNick plays a Silver.";
    const cards = ["Silver"];
    const numberOfCards = [1];

    // Act - Simulate playing a treasure card from graveyard with Courier.
    deck.processPlaysLine(line, cards, numberOfCards);

    // Assert - Verify the card was played from the graveyard
    expect(deck.graveyard).toStrictEqual(["Estate"]);
    expect(deck.inPlay).toStrictEqual(["Vassal", "Silver"]);
    // Verify hand is unchanged
    expect(deck.hand).toStrictEqual(["Copper", "Copper"]);
    // Verify latestPlaySource was set correctly.
    expect(deck.latestPlaySource).toBe("Courier");
  });

  it("should take no action for a card played again by a Throne Room.", () => {
    //Arrange
    deck.latestAction = "Remodel";
    deck.hand = ["Copper", "Estate"];
    deck.inPlay = ["Remodel"];
    deck.graveyard = ["Estate"];
    checkForNonHandPlay.mockReturnValue("None");
    // Test arguments
    const line = "pNick plays a Remodel again.";
    const cards = ["Remodel"];
    const numberOfCards = [1];

    // Act - Simulate playing a card again with a Throne Room.
    deck.processPlaysLine(line, cards, numberOfCards);

    // Assert - Verify the graveyard, hand, inPlay, are unchanged
    expect(deck.hand).toStrictEqual(["Copper", "Estate"]);
    expect(deck.inPlay).toStrictEqual(["Remodel"]);
    expect(deck.graveyard).toStrictEqual(["Estate"]);
    // Verify latestPlaySource was set correctly.
    expect(deck.latestPlaySource).toBe("Throne Room");
  });

  it("should not play Treasures from discard if nonHandPlay is found to be a Vassal", () => {
    //  Arrange a scenario where the card being played is a treasure.
    deck.hand = ["Copper"];
    const line = "pNick plays a Copper.";
    const cards = ["Copper"];
    const numberOfCards = [1];
    checkForNonHandPlay.mockReturnValue("Vassal");
    // Act - Simulate playing a Copper from hand
    deck.processPlaysLine(line, cards, numberOfCards);

    // Assert
    expect(deck.latestPlaySource).toBe("Hand");
  });

  it("should setLatestPlaySource to 'Vassal' when the play being processed is caused by a Vassal", () => {
    // Arrange
    checkForNonHandPlay.mockReturnValue("Vassal");
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
    checkForNonHandPlay.mockReturnValue("Courier");
    deck.graveyard = ["Copper"];
    const line = "pNick plays a Copper.";
    const cards = ["Copper"];
    const numberOfCards = [1];

    // Act simulate playing a Copper from discard with a Courier.
    deck.processPlaysLine(line, cards, numberOfCards);
    expect(deck.latestPlaySource).toBe("Courier");
  });

  it("should setLatestPlaySource to 'Hand' when the play being processed is played from Hand", () => {
    // Arrange
    checkForNonHandPlay.mockReturnValue("None");
    deck.hand = ["Copper"];
    const line = "pNick plays a Copper.";
    const cards = ["Copper"];
    const numberOfCards = [1];

    // Act simulate playing a Copper from hand.
    deck.processPlaysLine(line, cards, numberOfCards);
    expect(deck.latestPlaySource).toBe("Hand");
  });

  it("should setLatestPlaySource to 'Throne Room' when the play being processed is played by a Throne Room", () => {
    // Arrange
    checkForNonHandPlay.mockReturnValue("None");
    const line = "pNick plays a Sentry again.";
    const cards = ["Sentry"];
    const numberOfCards = [1];

    // Act simulate playing a Sentry again with a Throne Room.
    deck.processPlaysLine(line, cards, numberOfCards);
    expect(deck.latestPlaySource).toBe("Throne Room");
  });

  it(
    "should play cards from setAside and set latestPlaySource to 'Fortune Hunter' when the play being processed " +
      "is played by a Fortune Hunter",
    () => {
      // Arrange
      checkForNonHandPlay.mockReturnValue("Fortune Hunter");
      deck.latestAction = "Fortune Hunter";
      deck.setAside = ["Copper", "Estate", "Chapel"];
      deck.inPlay = ["Fortune Hunter"];
      const line = "pNick plays a Copper.";
      const cards = ["Copper"];
      const numberOfCards = [1];

      // Act simulate playing a Copper from setAside with a Fortune Hunter.
      deck.processPlaysLine(line, cards, numberOfCards);
      expect(deck.setAside).toStrictEqual(["Estate", "Chapel"]);
      expect(deck.latestPlaySource).toBe("Fortune Hunter");
      expect(deck.inPlay).toStrictEqual(["Fortune Hunter", "Copper"]);
    }
  );

  it("should create a duration object when the given line plays a duration card", () => {
    // Arrange
    deck.hand = ["Rope", "Copper"];
    deck.inPlay = ["Merchant"];
    checkForNonHandPlay.mockReturnValue("None");
    const line = "pNick plays a Rope.";
    const cards = ["Rope"];
    const numberOfCards = [1];

    // Act
    deck.processPlaysLine(line, cards, numberOfCards);
    // Assert - Verify a duration object whose value for field name is "Rope"
    expect(deck.activeDurations.length).toBe(1);
    expect(deck.activeDurations[0].name).toBe("Rope");
    // Verify card was moved from hand to inPlay
    expect(deck.hand).toStrictEqual(["Copper"]);
    expect(deck.inPlay).toStrictEqual(["Merchant", "Rope"]);
  });
});
