import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("processAsideLine", () => {
  let deck: Deck;
  const lineSourceMock = jest.spyOn(BaseDeck.prototype, "lineSource");
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", ["Royal Galley"]);
    lineSourceMock.mockReturnValue("None");
    jest.clearAllMocks();
  });

  it("should move the given cards in the given amounts from hand to durationSetAside when caused by a Grotto", () => {
    // Arrange
    deck.hand = ["Estate", "Copper", "Estate", "Estate", "Vassal"];
    const cards = ["Estate", "Copper"];
    const numberOfCards = [3, 1];
    // Act
    deck.processAsideLine(cards, numberOfCards);
    // Assert
    expect(deck.durationSetAside).toStrictEqual([
      "Estate",
      "Estate",
      "Estate",
      "Copper",
    ]);
    expect(deck.hand).toStrictEqual(["Vassal"]);
  });

  it("should move the given cards in the given amounts from library to durationSetAside when caused by a Research", () => {
    // Arrange
    deck.latestAction = "Research";
    deck.library = ["Estate", "Copper", "Royal Galley"];
    const cards = ["Royal Galley", "Copper"];
    const numberOfCards = [1, 1];
    // Act
    deck.processAsideLine(cards, numberOfCards);
    // Assert
    expect(deck.durationSetAside).toStrictEqual(["Royal Galley", "Copper"]);
    expect(deck.library).toStrictEqual(["Estate"]);
  });

  it("should move the cards set aside by Royal Galley from inPlay to durationSetAside", () => {
    // Arrange
    lineSourceMock.mockReturnValue("P plays a Royal Galley.");
    deck.latestAction = "Secret Passage";
    deck.inPlay = ["Research", "Royal Galley", "Secret Passage"];
    const cards = ["Secret Passage"];
    const numberOfCards = [1];
    // Act
    deck.processAsideLine(cards, numberOfCards);
    // Assert
    expect(deck.inPlay).toStrictEqual(["Research", "Royal Galley"]);
    expect(deck.durationSetAside).toStrictEqual(["Secret Passage"]);
  });

  // In the case of Archive, the setAside action already occurs during the 'looks at line'  This test
  // confirms that the cards are not setAside a second time.
  it("should not move cards at all if latestAction is Archive", () => {
    deck.latestAction = "Archive";
    deck.durationSetAside = ["Copper", "Estate"];
    deck.setAside = [];
    deck.hand = ["Copper", "Estate"];
    const cards = ["Copper", "Estate"];
    const numberOfCards = [1, 1];
    // Act - Simulate processing an aside line caused by an Archive.  It should not move any cards.
    deck.processAsideLine(cards, numberOfCards);
    // Assert - Verify no cards were moved.
    expect(deck.durationSetAside).toStrictEqual(["Copper", "Estate"]);
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.hand).toStrictEqual(["Copper", "Estate"]);
  });
});
