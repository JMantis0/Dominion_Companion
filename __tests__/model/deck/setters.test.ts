import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Deck setters", () => {
  it("should return the values of the Deck fields correctly", () => {
    const deck = new Deck("", false, "", "Player Name", "p", []);
    // Graveyard
    deck.setGraveyard(["Sample", "Graveyard"]);
    expect(deck.graveyard).toStrictEqual(["Sample", "Graveyard"]);
    // Hand
    deck.setHand(["Sample", "Hand"]);
    expect(deck.hand).toStrictEqual(["Sample", "Hand"]);
    // In Play
    deck.setInPlay(["Sample", "In", "Play", "Zone"]);
    expect(deck.inPlay).toStrictEqual(["Sample", "In", "Play", "Zone"]);
    // Library
    deck.setLibrary(["Sample", "Library", "Zone"]);
    expect(deck.library).toStrictEqual(["Sample", "Library", "Zone"]);
    // Set Aside Zone
    deck.setSetAside(["Sample", "Set", "Aside", "Zone"]);
    expect(deck.setAside).toStrictEqual(["Sample", "Set", "Aside", "Zone"]);
    // Wait To Draw Library Look
    deck.setWaitToDrawLibraryLook(true);
    expect(deck.waitToDrawLibraryLook).toBe(true);
    // Wait to Shuffle
    deck.setWaitToShuffle(true);
    expect(deck.waitToShuffle).toBe(true);
  });
});
