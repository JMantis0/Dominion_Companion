import { it, expect, beforeEach, describe, jest } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";
describe("isDurationEffect", () => {
  let deck: BaseDeck;
  const lineSource = jest.spyOn(BaseDeck.prototype, "lineSource");
  beforeEach(() => {
    deck = new BaseDeck("", false, "", "Player", "P", []);
  });
  it("should return true if the given line occurs within a 'starts their turn.' line", () => {
    lineSource.mockReturnValue("P starts their turn.");
    expect(deck.isDurationEffect()).toBe(true);
  });
  it("should return false if the given does not occur within a 'starts their turn.' effect", () => {
    lineSource.mockReturnValue("P plays a Vassal.");
    expect(deck.isDurationEffect()).toBe(false);
  });
});
