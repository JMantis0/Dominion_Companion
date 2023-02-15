import { it, describe, expect, beforeEach } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function gain()", () => {
  let rDeck: Deck;
  let gyBefore: string[];
  let gyAfter: string[];
  let cardToBeGained: string;
  beforeEach(() => {
    rDeck = createRandomDeck();
    gyBefore = rDeck.getGraveyard().slice();
    cardToBeGained = rDeck.getEntireDeck()[0];
    rDeck.gain(cardToBeGained);
    gyAfter = rDeck.getGraveyard().slice();
  });
  it("should add the given card to the Deck's graveyard field array", () => {
    expect(gyBefore.concat([cardToBeGained]).sort()).toStrictEqual(
      gyAfter.sort()
    );
  });
  it("Should add one length to the graveyard field array", () => {
    expect(gyBefore.length).toEqual(rDeck.getGraveyard().length - 1);
  });
});
