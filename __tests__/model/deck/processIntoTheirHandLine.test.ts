import { beforeEach, describe, expect, it } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("processIntoTheirHandLine", () => {
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck("", false, "", "Player", "P", []);
  });

  it("should draw cards into hand from setAside when caused by a Sage", () => {
    // Arrange
    deck.latestAction = "Sage";
    deck.setAside = ["Copper", "Copper", "Vassal"];
    deck.hand = ["Bureaucrat"];
    // Act
    deck.processIntoTheirHandLine(["Vassal"], [1]);

    expect(deck.setAside).toStrictEqual(["Copper", "Copper"]);
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Vassal"]);
  });

  it("should draw cards into hand from setAside when caused by a Sea Chart", () => {
    // Arrange
    deck.latestAction = "Sage";
    deck.setAside = ["Copper", "Copper", "Vassal"];
    deck.hand = ["Bureaucrat"];
    // Act
    deck.processIntoTheirHandLine(["Vassal"], [1]);

    expect(deck.setAside).toStrictEqual(["Copper", "Copper"]);
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Vassal"]);
  });

  it("should draw cards into hand from setAside when caused by a Farming Village", () => {
    // Arrange
    deck.latestAction = "Farming Village";
    deck.setAside = ["Copper", "Copper", "Vassal"];
    deck.hand = ["Bureaucrat"];
    // Act
    deck.processIntoTheirHandLine(["Vassal"], [1]);

    expect(deck.setAside).toStrictEqual(["Copper", "Copper"]);
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Vassal"]);
  });

  it("should draw cards into hand from graveyard when caused by a Mountain Village", () => {
    // Arrange
    deck.latestAction = "Mountain Village";
    deck.graveyard = ["Copper", "Copper", "Vassal"];
    deck.hand = ["Bureaucrat"];
    // Act
    deck.processIntoTheirHandLine(["Vassal"], [1]);

    expect(deck.graveyard).toStrictEqual(["Copper", "Copper"]);
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Vassal"]);
  });
});
