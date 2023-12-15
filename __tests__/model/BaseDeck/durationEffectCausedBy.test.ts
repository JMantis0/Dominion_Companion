import { beforeEach, describe, expect, it } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("durationEffectCausedBy", () => {
  let deck: Deck;
  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });
  it("should get the name of the Duration that is causing the given durationEffect", () => {
    // Arrange
    const line = "P discards a Copper and an Estate. (Dungeon)";
    // Act and Assert
    expect(deck.durationEffectCausedBy(line)).toBe("Dungeon");
  });
});
