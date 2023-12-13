import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("moveCard", () => {
  let deck: Deck;
  beforeEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "Player", "P", []);
  });

  it(
    "should remove an instance of the given card from the given fromZone, add an instance to the given toZone, " +
      "and return the resulting arrays",
    () => {
      // Arrange - set up a fromZone and toZone
      const fromZone = ["Copper", "Copper", "Estate"];
      const toZone = ["Oasis"];
      // Act
      const result = deck.moveCard("Copper", fromZone, toZone);
      // Assert - Verify resulting zones are correct.
      expect(result.newFromZone).toStrictEqual(["Copper", "Estate"]);
      expect(result.newToZone).toStrictEqual(["Oasis", "Copper"]);
    }
  );
  it("should throw an error if the given card is not present in the fromZone", () => {
    // Arrange - set up a fromZone and toZone
    const fromZone = ["Copper", "Copper", "Estate"];
    const toZone = ["Oasis"];
    // Act and Assert
    expect(() => deck.moveCard("Sentry", fromZone, toZone)).toThrowError(
      "No Sentry in fromZone."
    );
  });
});
