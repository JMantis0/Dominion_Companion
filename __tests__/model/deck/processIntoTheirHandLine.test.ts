import { beforeEach, describe, expect, it } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("processIntoTheirHandLine", () => {
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });
  it("should draw cards put into hand from setAside when caused by a Sage", () => {
    // Arrange
    deck.latestPlay = "Sage";
    deck.setAside = ["Copper", "Copper", "Vassal"];
    deck.hand = ["Bureaucrat"];
    // Act
    deck.processIntoTheirHandLine(["Vassal"], [1]);

    expect(deck.setAside).toStrictEqual(["Copper", "Copper"]);
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Vassal"]);
  });
});
