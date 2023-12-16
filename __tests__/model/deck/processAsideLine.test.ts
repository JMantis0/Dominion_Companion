import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("processAsideLine", () => {
  let deck: Deck;
  const lineSourceMock = jest
    .spyOn(BaseDeck.prototype, "lineSource")
    .mockReturnValue("None");
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", ["Royal Galley"]);
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
});
