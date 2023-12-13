import { beforeEach, describe, expect, it } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("isDurationResolutionLine", () => {
  let deck: BaseDeck;
  beforeEach(() => {
    deck = new BaseDeck("", false, "", "Player", "P", []);
  });
  it("should return true if the given line matches the name of a duration in parentheses", () => {
    expect(
      deck.isDurationResolutionLine("P draws 2 Coppers and 2 Estates. (Grotto)")
    ).toBe(true);
  });
  it("should return false if the given line does not match the name of a duration in parentheses", () => {
    expect(
      deck.isDurationResolutionLine("P draws 2 Coppers and 2 Estates.")
    ).toBe(false);
  });
});
