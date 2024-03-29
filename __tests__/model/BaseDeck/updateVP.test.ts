import { describe, it, expect, afterEach } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("updateVP", () => {
  // Instantiate BaseDeck object.
  let deck = new BaseDeck("", false, "", "pName", "pNick", []);

  afterEach(() => {
    deck = new BaseDeck("", false, "", "pName", "pNick", []);
  });

  it("should correctly update the deck VP based on the card in the entire deck.", () => {
    // Arrange
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
      "Mill",
      "Mill",
      "Duke",
    ];
    deck.setEntireDeck(entireDeckList);
    const expectedVP = 27; // Easily countable by inspection

    // Act
    deck.updateVP();

    expect(deck.currentVP).toBe(expectedVP);
  });

  it("should calculate VP correctly for randomized deck lists", () => {
    // Arrange
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
    const randomMillAmount = randomNumber();
    const randomDukeAmount = randomNumber();
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
    [...Array<number>(randomMillAmount).keys()].forEach(() =>
      entireDeck.push("Mill")
    );
    [...Array<number>(randomDukeAmount).keys()].forEach(() =>
      entireDeck.push("Duke")
    );
    deck.setEntireDeck(entireDeck);

    // Calculate the expected VP
    const expectedVP =
      randomEstateAmount +
      randomMillAmount +
      randomDuchyAmount * 3 +
      randomProvinceAmount * 6 +
      randomDukeAmount * randomDuchyAmount +
      randomGardensAmount * Math.floor(deck.entireDeck.length / 10) -
      randomCurseAmount;

    // Act
    deck.updateVP();
    const resultVP = deck.currentVP;

    // Assert
    expect(resultVP).toEqual(expectedVP);
  });
});
