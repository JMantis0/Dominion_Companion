import { describe, it, expect, jest, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function drawFromSetAside()", () => {
  // Instantiate Deck object
  let deck = new Deck("", false, "", "pName", "pNick", []);
  // Spy on function dependencies
  const setSetAside = jest
    .spyOn(Deck.prototype, "setSetAside")
    .mockImplementation(() => null);
  const setHand = jest
    .spyOn(Deck.prototype, "setHand")
    .mockImplementation(() => null);
  afterEach(() => {
    jest.clearAllMocks();
    deck = new Deck("", false, "", "pName", "pNick", []);
  });

  it("should draw the given card from setAside into hand", () => {
    // Arrange
    deck.hand = ["Copper"];
    deck.setAside = ["Mine", "Sentry"];
    // Act - simulate drawing a Mine from setAside.
    deck.drawFromSetAside("Mine");
    expect(setHand).toBeCalledTimes(1);
    expect(setHand).toBeCalledWith(["Copper", "Mine"]);
    expect(setSetAside).toBeCalledTimes(1);
    expect(setSetAside).toBeCalledWith(["Sentry"]);
  });

  it("should throw an error if the given card is not in setAside", () => {
    // Arrange
    deck.setAside = ["Mine", "Sentry"];
    // Act and Assert - Simulate drawing a card from setAside that is not present.
    expect(() => deck.drawFromSetAside("Curse")).toThrowError(
      "No Curse in setAside."
    );
  });
});
