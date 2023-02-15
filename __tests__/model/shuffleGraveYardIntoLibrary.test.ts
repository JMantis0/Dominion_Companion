import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function shuffleGraveYardIntoLibrary() ", () => {
  let rDeck: Deck = createRandomDeck();
  const currentLib = rDeck.getLibrary();
  const currentGy = rDeck.getGraveyard();
  it("should splice al elements from the graveyard, and for each element spliced, that element should be added to the library", () => {
    rDeck.shuffleGraveYardIntoLibrary();
    expect(currentLib.concat(currentGy).sort()).toStrictEqual(
      rDeck.getLibrary().sort()
    );
    expect(rDeck.getGraveyard().length).toEqual(0);
  });
});
