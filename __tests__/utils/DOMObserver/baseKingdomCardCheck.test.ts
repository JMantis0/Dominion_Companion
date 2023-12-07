import { describe, it, expect } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("Static method baseKingdomCardCheck", () => {
  it("should return true for a kingdom containing only base cards", () => {
    // Arrange
    const kingdom = [
      "Cellar",
      "Chapel",
      "Moat",
      "Harbinger",
      "Merchant",
      "Vassal",
      "Village",
      "Workshop",
      "Bureaucrat",
      "Gardens",
      "Militia",
      "Moneylender",
      "Poacher",
      "Remodel",
      "Smithy",
      "Throne Room",
      "Bandit",
      "Council Room",
      "Festival",
      "Laboratory",
      "Library",
      "Market",
      "Mine",
      "Sentry",
      "Witch",
      "Artisan",
      "Copper",
      "Silver",
      "Gold",
      "Province",
      "Duchy",
      "Estate",
      "Curse",
    ];

    // Act and Assert - Simulate checking for a base-card kingdom when the kingdom only has base set cards.
    expect(DOMObserver.supportedKingdomCardCheck(kingdom)).toBe(true);
  });

  it("should return false for a kingdom containing non-base cards", () => {
    const kingdom = [
      "Cellar",
      "Chapel",
      "Moat",
      "Harbinger",
      "Merchant",
      "Vassal",
      "Village",
      "Workshop",
      "Bureaucrat",
      "Gardens",
      "Militia",
      "Moneylender",
      "Poacher",
      "Remodel",
      "Smithy",
      "Throne Room",
      "Bandit",
      "Council Room",
      "Festival",
      "Laboratory",
      "Library",
      "Market",
      "Mine",
      "Sentry",
      "Witch",
      "Artisan",
      "Copper",
      "Silver",
      "Gold",
      "Province",
      "Duchy",
      "Estate",
      "Curse",
      "Vampire", // A non-base card
    ];

    // Act and Assert - Simulate checking for a base-card kingdom when the kingdom contains a card that is not in the base set.
    expect(DOMObserver.supportedKingdomCardCheck(kingdom)).toBe(false);
  });

  it("should return true for an empty kingdom", () => {
    // Arrange
    const kingdom: string[] = [];

    // Simulate checking for base kingdom when the kingdom is empty.
    expect(DOMObserver.supportedKingdomCardCheck(kingdom)).toBe(true);
  });
});
