import { it, describe, expect } from "@jest/globals";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function gainIntoHand()", () => {
  let rDeck = createRandomDeck();
  let handBefore = rDeck.getHand().slice();
  let cardToBeGained = rDeck.getEntireDeck()[0];
  it("should the given card and add it to the Deck's hand field array", () => {
    rDeck.gainIntoHand(cardToBeGained);
    expect(handBefore.concat([cardToBeGained]).sort()).toStrictEqual(rDeck.getHand())
  });
});
