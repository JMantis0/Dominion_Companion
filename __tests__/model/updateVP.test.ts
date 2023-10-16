import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";

describe("Function updateVP()", () => {
  it("should correctly update the deck VP based on the card in the entire deck.", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const entireDeckList = [
      "Estate",
      "Estate",
      "Estate",
      "Estate",
      "Library",
      "Duchy",
      "Duchy",
      "Province",
      "Province",
      "Gardens",
      "Gardens",
      "Curse",
    ];
    deck.setEntireDeck(entireDeckList);
    const expectedVP = 23; // Easily countable by inspection

    // Act
    deck.updateVP();
    const resultVP = deck.getCurrentVP();
    expect(resultVP).toBe(expectedVP);
  });

  it("should calculate VP correctly for randomized deck lists", () => {
    // Arrange
    const deck = new Deck("", false, "", "pName", "pNick", []);
    const randomNumber = () => {
      return Math.floor(Math.random() * (100 - 0) + 0);
    };
    // Generate random amounts of each Victory Card
    // and set build a deck list with them.
    const randomEstateAmount = randomNumber();
    const randomDuchyAmount = randomNumber();
    const randomProvinceAmount = randomNumber();
    const randomGardensAmount = randomNumber();
    const randomCurseAmount = randomNumber();
    const entireDeck: string[] = [];
    [...Array<number>(randomEstateAmount).keys()].forEach(() =>
      entireDeck.push("Estate")
    );
    [...Array<number>(randomDuchyAmount).keys()].forEach(() =>
      entireDeck.push("Duchy")
    );
    [...Array<number>(randomProvinceAmount).keys()].forEach(() =>
      entireDeck.push("Province")
    );
    [...Array<number>(randomGardensAmount).keys()].forEach(() =>
      entireDeck.push("Gardens")
    );
    [...Array<number>(randomCurseAmount).keys()].forEach(() =>
      entireDeck.push("Curse")
    );
    deck.setEntireDeck(entireDeck);

    // Calculate the expected VP
    const expectedVP =
      randomEstateAmount +
      randomDuchyAmount * 3 +
      randomProvinceAmount * 6 +
      randomGardensAmount * Math.floor(deck.entireDeck.length / 10) -
      randomCurseAmount;

    // Act
    deck.updateVP();
    const resultVP = deck.getCurrentVP();

    // Assert
    expect(resultVP).toEqual(expectedVP);
  });
});
