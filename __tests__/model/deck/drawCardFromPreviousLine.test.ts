import { describe, it, expect, afterEach, jest } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function drawCardFromPreviousLine()", () => {
  // Instantiate Deck object.
  let deck = new Deck("", false, "", "pName", "pNick", ["Vassal", "Library"]);
  const drawFromSetAside = jest
    .spyOn(Deck.prototype, "drawFromSetAside")
    .mockImplementation(() => null);
  afterEach(() => {
    deck = new Deck("", false, "", "pName", "pNick", ["Vassal", "Library"]);
  });
  it("should draw one instance of the card in the most recent logArchive entry", () => {
    // Arrange
    deck.logArchive = [
      "pNick plays a Library.",
      "pNick looks at a Copper.",
      "pNick looks at a Vassal.",
    ];

    // Act
    deck.drawCardFromPreviousLine();

    expect(drawFromSetAside).toBeCalledTimes(1);
    expect(drawFromSetAside).toBeCalledWith("Vassal");
  });

  it("should throw an error when there is no card found in the most recent logArchive entry", () => {
    // Arrange
    deck.logArchive = ["pNick plays a Militia.", "pNick gets +$2."];

    // Act and Assert
    expect(() => deck.drawCardFromPreviousLine()).toThrowError(
      "No card found in the most recent logArchive entry."
    );
  });
});
