import { it, describe, expect } from "@jest/globals";
import { createRandomDeck } from "../testUtilFuncs";
describe("Function cleanup()", () => {
  let rDeck = createRandomDeck();
  let graveYardBefore = rDeck.getGraveyard();
  let handBefore = rDeck.getHand();
  let inPlayBefore = rDeck.getInPlay();
  rDeck.cleanup();
  it("should remove all members from the hand and inPlay field arrays, and add them to the graveyard field array", () => {
    expect(rDeck.getGraveyard().sort()).toStrictEqual(
      graveYardBefore.concat(handBefore).concat(inPlayBefore).sort()
    );
  });
  it("should empty the hand field array", () => {
    expect(rDeck.getHand().length).toEqual(0);
  });
  it("should empty the inPlay field array", () => {
    expect(rDeck.getInPlay().length).toEqual(0);
  });
});
