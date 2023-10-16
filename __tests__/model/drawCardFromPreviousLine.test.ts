import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function drawCardFromPreviousLine()", () => {
  it("should draw one instance of the card in the most recent logArchive entry", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", [
      "Vassal",
      "Library",
    ]);
    const hand = ["Copper", "Copper", "Copper", "Estate", "Estate"];
    const library = [
      "Estate",
      "Copper",
      "Copper",
      "Copper",
      "Copper",
      "Vassal",
    ];
    const logArchive = [
      "pNick plays a Library.",
      "pNick looks at a Copper.",
      "pNick looks at a Vassal.",
    ];
    deck.setLibrary(library);
    deck.setHand(hand);
    deck.setLogArchive(logArchive);

    // Act
    deck.drawCardFromPreviousLine();
    const resultLibrary = deck.getLibrary();
    const resultHand = deck.getHand();
    const expectedLibrary = ["Estate", "Copper", "Copper", "Copper", "Copper"];
    const expectedHand = [
      "Copper",
      "Copper",
      "Copper",
      "Estate",
      "Estate",
      "Vassal",
    ];

    // Assert
    expect(resultLibrary).toStrictEqual(expectedLibrary);
    expect(resultHand).toStrictEqual(expectedHand);
  });

  it("should throw an error when there is no card found in the most recent logArchive entry", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const hand = ["Copper", "Copper", "Copper", "Estate", "Estate"];
    const library = ["Estate", "Copper", "Copper", "Copper", "Copper"];
    const logArchive = [
      "pNick plays a Library.",
      "pNick looks at a Copper.",
      "pNick looks at a Vassal.",
    ];
    deck.setLibrary(library);
    deck.setHand(hand);
    deck.setLogArchive(logArchive);

    // Act and Assert
    expect(() => deck.drawCardFromPreviousLine()).toThrowError(
      "No card found in the most recent logArchive entry."
    );
  });
});
