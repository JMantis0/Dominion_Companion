import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("processRevealsLine", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pNick", "pName", []);
  // Spy on method dependencies
  const checkForVassalPlay = jest.spyOn(Deck.prototype, "checkForVassalPlay");

  afterEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "pNick", "pName", []);
  });

  it("should play cards that are played normally from hand.", () => {
    //Arrange
    deck.latestPlay = "Market";
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
    deck.latestPlay = "Vassal";
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

  it("should take no action for a card played again by a Throne Room.", () => {
    //Arrange
    deck.latestPlay = "Remodel";
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
    console.log("Last test", deck.hand);
    // Act - Simulate playing a Copper from hand
    deck.processPlaysLine(line, cards, numberOfCards);

    // Assert
    expect(checkForVassalPlay).not.toBeCalled();
  });
});
