import { describe, it, expect } from "@jest/globals";
import { getProb } from "../../src/content/PrimaryFrame/componentFunctions";
import { Deck } from "../../src/model/deck";

describe("Function getProb()", () => {
  let lib: string[];
  let gy: string[];
  let deck: Deck;
  describe("When given a sample size smaller than the library length", () => {
    deck = new Deck("Title", false, "Rating", "PlayerName", "PlayerNick", [
      "Kingdom",
    ]);
    lib = ["Vassal", "Laboratory", "Sentry", "Silver"];
    gy = ["Harbinger", "Militia", "Copper"];
    deck.setLibrary(deck.getLibrary().concat(lib));
    deck.setGraveyard(gy);
    deck.setEntireDeck(deck.getLibrary().concat(gy));
    it("Should return correct probability", () => {
      expect(getProb(deck, "Copper", "Current", 1, 1).hyperGeo).toEqual(0.5);
      expect(getProb(deck, "Copper", "Current", 1, 1).cumulative).toEqual(0.5);
      expect(getProb(deck, "Copper", "Current", 1, 2).hyperGeo).toEqual(0.5385);
      expect(getProb(deck, "Copper", "Current", 1, 2).cumulative).toEqual(
        0.7692
      );
      expect(getProb(deck, "Copper", "Current", 1, 3).hyperGeo).toEqual(0.4038);
      expect(getProb(deck, "Copper", "Current", 1, 3).cumulative).toEqual(
        0.9038
      );
      expect(getProb(deck, "Copper", "Current", 1, 4).hyperGeo).toEqual(0.2448);
      expect(getProb(deck, "Copper", "Current", 1, 4).cumulative).toEqual(
        0.965
      );
      expect(getProb(deck, "Copper", "Current", 1, 5).hyperGeo).toEqual(0.1224);
      expect(getProb(deck, "Copper", "Current", 1, 5).cumulative).toEqual(
        0.9895
      );
      expect(getProb(deck, "Copper", "Current", 1, 6).hyperGeo).toEqual(0.049);
      expect(getProb(deck, "Copper", "Current", 1, 6).cumulative).toEqual(
        0.9977
      );
      expect(getProb(deck, "Copper", "Current", 1, 7).hyperGeo).toEqual(0.0143);
      expect(getProb(deck, "Copper", "Current", 1, 7).cumulative).toEqual(
        0.9997
      );
      expect(getProb(deck, "Copper", "Current", 1, 8).hyperGeo).toEqual(0.0023);
      expect(getProb(deck, "Copper", "Current", 1, 8).cumulative).toEqual(1);
      expect(getProb(deck, "Copper", "Current", 1, 9).hyperGeo).toEqual(0);
      expect(getProb(deck, "Copper", "Current", 1, 9).cumulative).toEqual(1);
      expect(getProb(deck, "Copper", "Current", 1, 10).hyperGeo).toEqual(0);
      expect(getProb(deck, "Copper", "Current", 1, 10).cumulative).toEqual(1);
      expect(getProb(deck, "Copper", "Current", 1, 11).hyperGeo).toEqual(0);
      expect(getProb(deck, "Copper", "Current", 1, 11).cumulative).toEqual(1);
      expect(getProb(deck, "Copper", "Current", 1, 12).hyperGeo).toEqual(0);
      expect(getProb(deck, "Copper", "Current", 1, 12).cumulative).toEqual(1);
      expect(getProb(deck, "Copper", "Current", 1, 13).hyperGeo).toEqual(0);
      expect(getProb(deck, "Copper", "Current", 1, 13).cumulative).toEqual(1);
      expect(getProb(deck, "Copper", "Current", 1, 14).hyperGeo).toEqual(0);
      expect(getProb(deck, "Copper", "Current", 1, 14).cumulative).toEqual(1);
      for (let cardAmount = 1; cardAmount <= 14; cardAmount++) {
        expect(
          getProb(deck, "Militia", "Current", 1, cardAmount).hyperGeo
        ).toEqual(0);
        expect(
          getProb(deck, "Militia", "Current", 1, cardAmount).cumulative
        ).toEqual(0);
      }
      expect(getProb(deck, "Militia", "Current", 1, 15).hyperGeo).toEqual(
        0.3333
      );
      expect(getProb(deck, "Militia", "Current", 1, 15).cumulative).toEqual(
        0.3333
      );
      expect(getProb(deck, "Militia", "Current", 1, 16).hyperGeo).toEqual(
        0.6667
      );
      expect(getProb(deck, "Militia", "Current", 1, 16).cumulative).toEqual(
        0.6667
      );
      expect(getProb(deck, "Militia", "Current", 1, 17).hyperGeo).toEqual(1);
      expect(getProb(deck, "Militia", "Current", 1, 17).cumulative).toEqual(1);
      expect(getProb(deck, "Militia", "Current", 1, 18).hyperGeo).toEqual(1);
      expect(getProb(deck, "Militia", "Current", 1, 18).cumulative).toEqual(1);
    });
  });
});
