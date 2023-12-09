import { beforeEach, describe, expect, it } from "@jest/globals";
import durationList from "../../../src/utils/durations";
import { BaseDeck } from "../../../src/model/baseDeck";
describe("isDurationPlay", () => {
  let bDeck: BaseDeck;
  const durationNames: string[] = Object.keys(durationList);
  beforeEach(() => {
    bDeck = new BaseDeck("", false, "", "Player", "P", []);
  });
  it("should return true when the given line plays a duration card", () => {
    durationNames.forEach((cardName) => {
      expect(bDeck.isDurationPlay(`P plays a $${cardName}.`)).toBe(true);
    });
  });
  it("should return false when the given line is not a play line.", () => {
    durationNames.forEach((cardName) => {
      expect(bDeck.isDurationPlay(`P draws a $${cardName}.`)).toBe(false);
    });
  });
  it("should return false when the given line plays a card that is not a duration.", () => {
    ["Copper", "Sentry", "Vassal"].forEach((cardName) => {
      expect(bDeck.isDurationPlay(`P draws a $${cardName}.`)).toBe(false);
    });
  });
});
