import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  it,
} from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("processOpponentLog", () => {
  let deck: Deck;
  const checkForNonHandPlay = jest.spyOn(Deck.prototype, "checkForNonHandPlay");
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should set the latestPlaySource when act is 'plays'", () => {
    // Arrange
    // Mock response from checkForNonHandPlay
    checkForNonHandPlay.mockReturnValue("Courier");
    const line = "L plays a Copper.";
    const act = "plays";
    const cards = ["Copper"];
    const numberOfCards = [1];
    // Act
    deck.processOpponentLog(line, act, cards, numberOfCards);
    // Assert - Verify the latestPlaySource was set to "Hand"
    expect(deck.latestPlaySource).toBe("Courier");
  });

  it("should only call 'processPassesLine' when the given act is 'passes'", () => {
    // Arrange

    deck.hand = ["Bureaucrat"];
    deck.entireDeck = ["Bureaucrat", "Silver"];

    const act = "passes";
    const line = "L passes a curse to P.";
    const cards = ["Curse"];
    const numberOfCards = [1];

    // Act
    deck.processOpponentLog(line, act, cards, numberOfCards);

    // Assert - Verify a Curse was added to the hand and deck.
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Curse"]);
    expect(deck.entireDeck).toStrictEqual(["Bureaucrat", "Silver", "Curse"]);
  });
});
