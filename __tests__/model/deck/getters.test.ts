import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Deck getters", () => {
  it("should return the values of the Deck fields correctly", () => {
    const deck = new Deck("", false, "", "Player Name", "p", []);
    // Graveyard
    deck.graveyard = ["Sample", "Graveyard"];
    expect(deck.getGraveyard()).toStrictEqual(["Sample", "Graveyard"]);
    // Hand
    deck.hand = ["Sample", "Hand"];
    expect(deck.getHand()).toStrictEqual(["Sample", "Hand"]);
    // Library
    deck.library = ["Copper", "Silver", "Gold", "Curse"];
    expect(deck.getLibrary()).toStrictEqual([
      "Copper",
      "Silver",
      "Gold",
      "Curse",
    ]);
    // In Play
    deck.inPlay = ["Sample", "In", "Play", "Zone"];
    expect(deck.getInPlay()).toStrictEqual(["Sample", "In", "Play", "Zone"]);
    // Set Aside Zone
    deck.setAside = ["Sample", "Set", "Aside", "Zone"];
    expect(deck.getSetAside()).toStrictEqual([
      "Sample",
      "Set",
      "Aside",
      "Zone",
    ]);
    // Wait To Draw Library Look
    deck.waitToDrawLibraryLook = true;
    expect(deck.getWaitToDrawLibraryLook()).toBe(true);
    // Wait to Shuffle
    deck.waitToShuffle = true;
    expect(deck.getWaitToShuffle()).toBe(true);
  });
});
