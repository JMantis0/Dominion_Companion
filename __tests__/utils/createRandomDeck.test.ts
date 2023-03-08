import { describe, it, expect } from "@jest/globals";
import { createRandomDeck } from "../testUtilFuncs";
import { Deck } from "../../src/model/deck";

describe("Function createRandomDeck()", () => {
  let rDeck: Deck;
  it("should return a random Deck object", () => {
    rDeck = createRandomDeck();
    expect(rDeck).toBeInstanceOf(Deck);
  });
  it("should have an entireDeck field array with length equal to the sum of the lengths of the graveyard, hand, inPlay, and library arrays", () => {
    expect(rDeck.getEntireDeck().length).toBe(
      rDeck.getGraveyard().length +
        rDeck.getHand().length +
        rDeck.getInPlay().length +
        rDeck.getLibrary().length
    );
  });
  it("should have field arrays all with at least one member", () => {
    expect(rDeck.getEntireDeck().length).toBeGreaterThan(0);
    expect(rDeck.getLibrary().length).toBeGreaterThan(0);
    expect(rDeck.getHand().length).toBeGreaterThan(0);
    expect(rDeck.getInPlay().length).toBeGreaterThan(0);
    expect(rDeck.getTrash().length).toBeGreaterThan(0);
    expect(rDeck.getGraveyard().length).toBeGreaterThan(0);
  });
});
