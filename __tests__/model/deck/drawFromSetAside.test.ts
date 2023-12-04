import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";
import * as utils from "../../../src/utils/utils";

describe("drawFromSetAside", () => {
  // Declare Deck reference.
  let deck: Deck;
  const getGameLog = jest.spyOn(utils, "getClientGameLog").mockReturnValue("");

  beforeEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "pName", "pNick", ["Copper", "Moneylender"]);
  });

  it("should draw the given card from setAside into hand", () => {
    // Arrange
    deck.hand = ["Copper"];
    deck.setAside = ["Mine", "Sentry"];

    // Act - simulate drawing a Mine from setAside.
    deck.drawFromSetAside("Mine");

    // Assert - Verify card was moved from setAside to hand.
    expect(deck.hand).toStrictEqual(["Copper", "Mine"]);
    expect(deck.setAside).toStrictEqual(["Sentry"]);
  });

  it("should throw an error if the given card is not in setAside after a reconciliation attempt", () => {
    // Arrange
    deck.setAside = ["Mine", "Sentry"];
    deck.logArchive = ["pNick plays a Library"];
    getGameLog.mockReturnValue(
      "pNick plays a Library.\npNick looks at a Chapel."
    );
    // Act and Assert - Simulate drawing a card from setAside that is not present.
    expect(() => deck.drawFromSetAside("Curse")).toThrowError(
      "No Curse in setAside."
    );
  });

  it("should reconcile a missing Sage reveal before drawing", () => {
    getGameLog.mockReturnValue(
      "G gets +1 Action.\nP reveals a Copper.\nP shuffles their deck.\nP reveals a Copper and a Moneylender.\nP puts a Moneylender into their hand."
    );
    deck.logArchive = [
      "G gets +1 Action.",
      "P reveals a Copper.",
      "P shuffles their deck.",
      "P reveals a Copper.",
    ];
    deck.setAside = ["Copper"];
    deck.library = ["Copper", "Moneylender"];
    deck.latestPlay = "Sage";
    deck.lastEntryProcessed = "P reveals a Copper.";

    // Act
    deck.drawFromSetAside("Moneylender");

    // Assert - Verify the Moneylender was drawn from setAside
    expect(deck.setAside).toStrictEqual(["Copper"]);
    expect(deck.library).toStrictEqual(["Copper"]);
    expect(deck.logArchive).toStrictEqual([
      "G gets +1 Action.",
      "P reveals a Copper.",
      "P shuffles their deck.",
      "P reveals a Copper and a Moneylender.",
    ]);
  });
});
