import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("processIntoTheirHandLine", () => {
  let deck: Deck;
  const isDurationEffect = jest
    .spyOn(BaseDeck.prototype, "isDurationEffect")
    .mockReturnValue(true);
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    // Assert
    expect(deck.setAside).toStrictEqual(["Copper", "Copper"]);
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Vassal"]);
  });

  it("should draw cards into hand from setAside when caused by a Journeyman", () => {
    // Arrange
    deck.latestAction = "Journeyman";
    deck.setAside = [
      "Estate",
      "Estate",
      "Copper",
      "Copper",
      "Wandering Minstrel",
    ];
    deck.hand = ["Bureaucrat"];
    // Act
    deck.processIntoTheirHandLine(["Estate", "Wandering Minstrel"], [2, 1]);

    // Assert
    expect(deck.setAside).toStrictEqual(["Copper", "Copper"]);
    expect(deck.hand).toStrictEqual([
      "Bureaucrat",
      "Estate",
      "Estate",
      "Wandering Minstrel",
    ]);
  });

  it("should draw cards into hand from setAside when caused by a Sea Chart", () => {
    // Arrange
    deck.latestAction = "Sea Chart";
    deck.setAside = ["Copper", "Copper", "Vassal"];
    deck.hand = ["Bureaucrat"];
    // Act
    deck.processIntoTheirHandLine(["Vassal"], [1]);
    // Assert
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
    // Assert
    expect(deck.setAside).toStrictEqual(["Copper", "Copper"]);
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Vassal"]);
  });

  it("should draw cards into hand from setAside when caused by a Hunter", () => {
    // Arrange
    deck.latestAction = "Hunter";
    deck.setAside = ["Estate", "Copper", "Vassal"];
    deck.hand = ["Bureaucrat"];
    // Act
    deck.processIntoTheirHandLine(["Estate", "Copper", "Vassal"], [1, 1, 1]);
    // Assert
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.hand).toStrictEqual([
      "Bureaucrat",
      "Estate",
      "Copper",
      "Vassal",
    ]);
  });

  it("should draw cards into hand from setAside when caused by a Seer", () => {
    // Arrange
    deck.latestAction = "Seer";
    deck.setAside = ["Estate", "Vassal"];
    deck.hand = ["Bureaucrat"];
    // Act
    deck.processIntoTheirHandLine(["Estate", "Vassal"], [1, 1]);

    // Assert - Verify cards were moved from setAside to hand.
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Estate", "Vassal"]);
  });

  it("should draw cards into hand from setAside when caused by a Hunting Party", () => {
    // Arrange
    deck.latestAction = "Hunting Party";
    deck.setAside = ["Silver", "Silver", "Cellar"];
    deck.hand = ["Bureaucrat"];
    // Act
    deck.processIntoTheirHandLine(["Cellar"], [1]);

    expect(deck.setAside).toStrictEqual(["Silver", "Silver"]);
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Cellar"]);
  });

  it("should draw cards into hand from setAside when caused by a Patrol", () => {
    // Arrange
    deck.latestAction = "Patrol";
    deck.setAside = ["Copper", "Gold", "Estate", "Gardens"];
    deck.hand = ["Bureaucrat"];
    // Act
    deck.processIntoTheirHandLine(["Estate", "Gardens"], [1, 1]);
    // Assert
    expect(deck.setAside).toStrictEqual(["Copper", "Gold"]);
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Estate", "Gardens"]);
  });

  it("should draw cards into hand from setAside when caused by an Advisor", () => {
    // Arrange
    deck.latestAction = "Advisor";
    deck.setAside = ["Copper", "Gold", "Estate"];
    deck.hand = ["Bureaucrat"];
    // Act
    deck.processIntoTheirHandLine(["Estate", "Copper"], [1, 1]);
    // Assert
    expect(deck.setAside).toStrictEqual(["Gold"]);
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Estate", "Copper"]);
  });

  it("should draw cards into hand from setAside when caused by an Envoy", () => {
    // Arrange
    deck.latestAction = "Envoy";
    deck.setAside = ["Copper", "Copper", "Estate", "Moneylender"];
    deck.hand = ["Bureaucrat"];
    // Act
    deck.processIntoTheirHandLine(
      ["Copper", "Copper", "Estate", "Moneylender"],
      [1, 1, 1, 1]
    );
    // Assert
    expect(deck.setAside).toStrictEqual([]);
    expect(deck.hand).toStrictEqual([
      "Bureaucrat",
      "Copper",
      "Copper",
      "Estate",
      "Moneylender",
    ]);
  });

  it("should draw cards into hand from graveyard when caused by a Mountain Village", () => {
    // Arrange
    deck.latestAction = "Mountain Village";
    deck.graveyard = ["Copper", "Copper", "Vassal"];
    deck.hand = ["Bureaucrat"];
    // Act
    deck.processIntoTheirHandLine(["Vassal"], [1]);

    // Assert
    expect(deck.graveyard).toStrictEqual(["Copper", "Copper"]);
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Vassal"]);
  });

  it("should draw cards into hand from durationSetAside when caused by a duration effect", () => {
    // Arrange
    deck.latestAction = "None";
    deck.durationSetAside = ["Copper", "Copper", "Vassal"];
    deck.hand = ["Bureaucrat"];
    isDurationEffect.mockReturnValue(true);
    // Act
    deck.processIntoTheirHandLine(["Vassal"], [1]);
    // Assert
    expect(deck.durationSetAside).toStrictEqual(["Copper", "Copper"]);
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Vassal"]);
  });

  it("should draw cards into hand from durationSetAside when caused by an Archive", () => {
    // Arrange
    deck.latestAction = "Archive";
    deck.durationSetAside = ["Copper", "Estate", "Tide Pools"];
    deck.hand = ["Bureaucrat"];
    isDurationEffect.mockReturnValue(false);
    // Act
    deck.processIntoTheirHandLine(["Tide Pools"], [1]);
    // Assert
    expect(deck.durationSetAside).toStrictEqual(["Copper", "Estate"]);
    expect(deck.hand).toStrictEqual(["Bureaucrat", "Tide Pools"]);
  });
});
