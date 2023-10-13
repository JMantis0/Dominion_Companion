import { describe, it, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import {
  cumulativeHyperGeometricProbability,
  getCumulativeHyperGeometricProbabilityForCard,
  hyperGeometricProbability,
} from "../../src/utils/utils";

describe("Function getCumulativeHyperGeometricProbabilityForCard()", () => {
  let lib: string[];
  let gy: string[];
  let deck: Deck;
  describe("When given a sample size smaller than the library length", () => {
    deck = new Deck("Title", false, "Rating", "PlayerName", "PlayerNick", [
      "Kingdom",
    ]);
    lib = ["Vassal", "Laboratory", "Sentry", "Silver"];
    gy = ["Harbinger", "Militia", "Copper"];
    deck.setLibrary(deck.getLibrary().concat(lib));
    deck.setGraveyard(gy);
    deck.setEntireDeck(deck.getLibrary().concat(gy));
    it("Should return correct probability", () => {
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          1
        ).hyperGeo
      ).toEqual(0.5);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          1
        ).cumulative
      ).toEqual(0.5);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          2
        ).hyperGeo
      ).toEqual(0.5385);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          2
        ).cumulative
      ).toEqual(0.7692);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          3
        ).hyperGeo
      ).toEqual(0.4038);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          3
        ).cumulative
      ).toEqual(0.9038);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          4
        ).hyperGeo
      ).toEqual(0.2448);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          4
        ).cumulative
      ).toEqual(0.965);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          5
        ).hyperGeo
      ).toEqual(0.1224);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          5
        ).cumulative
      ).toEqual(0.9895);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          6
        ).hyperGeo
      ).toEqual(0.049);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          6
        ).cumulative
      ).toEqual(0.9977);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          7
        ).hyperGeo
      ).toEqual(0.0143);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          7
        ).cumulative
      ).toEqual(0.9997);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          8
        ).hyperGeo
      ).toEqual(0.0023);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          8
        ).cumulative
      ).toEqual(1);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          9
        ).hyperGeo
      ).toEqual(0);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          9
        ).cumulative
      ).toEqual(1);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          10
        ).hyperGeo
      ).toEqual(0);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          10
        ).cumulative
      ).toEqual(1);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          11
        ).hyperGeo
      ).toEqual(0);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          11
        ).cumulative
      ).toEqual(1);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          12
        ).hyperGeo
      ).toEqual(0);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          12
        ).cumulative
      ).toEqual(1);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          13
        ).hyperGeo
      ).toEqual(0);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          13
        ).cumulative
      ).toEqual(1);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          14
        ).hyperGeo
      ).toEqual(0);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Copper",
          "Current",
          1,
          14
        ).cumulative
      ).toEqual(1);
      for (let cardAmount = 1; cardAmount <= 14; cardAmount++) {
        expect(
          getCumulativeHyperGeometricProbabilityForCard(
            deck,
            "Militia",
            "Current",
            1,
            cardAmount
          ).hyperGeo
        ).toEqual(0);
        expect(
          getCumulativeHyperGeometricProbabilityForCard(
            deck,
            "Militia",
            "Current",
            1,
            cardAmount
          ).cumulative
        ).toEqual(0);
      }
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Militia",
          "Current",
          1,
          15
        ).hyperGeo
      ).toEqual(0.3333);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Militia",
          "Current",
          1,
          15
        ).cumulative
      ).toEqual(0.3333);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Militia",
          "Current",
          1,
          16
        ).hyperGeo
      ).toEqual(0.6667);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Militia",
          "Current",
          1,
          16
        ).cumulative
      ).toEqual(0.6667);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Militia",
          "Current",
          1,
          17
        ).hyperGeo
      ).toEqual(1);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Militia",
          "Current",
          1,
          17
        ).cumulative
      ).toEqual(1);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Militia",
          "Current",
          1,
          18
        ).hyperGeo
      ).toEqual(1);
      expect(
        getCumulativeHyperGeometricProbabilityForCard(
          deck,
          "Militia",
          "Current",
          1,
          18
        ).cumulative
      ).toEqual(1);
    });
  });
});

describe("cumulativeHyperGeometricProbability", () => {
  it("should return the cumulative hypergeometric probability", () => {
    // Define your test parameters
    const populationSize = 100;
    const populationSuccesses = 30;
    const sampleSize = 10;
    const sampleSuccesses = 3;

    // Expected result (you may need to calculate it manually)
    const expectedResult = 0.62714; // Replace with the actual expected result

    // Call the function and assert the result using Jest's expect
    const result = cumulativeHyperGeometricProbability(
      populationSize,
      populationSuccesses,
      sampleSize,
      sampleSuccesses
    );

    expect(result).toBeCloseTo(expectedResult, 4); // Adjust precision as needed
  });

  // Add more test cases as needed
});

describe("hyperGeometricProbability", () => {
  it("should return the hypergeometric probability", () => {
    // Define your test parameters
    const populationSize = 100;
    const populationSuccesses = 30;
    const sampleSize = 10;
    const sampleSuccesses = 3;

    // Expected result (you may need to calculate it manually)
    const expectedResult = 0.2136; // Replace with the actual expected result

    // Call the function and assert the result using Jest's expect
    const result = hyperGeometricProbability(
      populationSize,
      populationSuccesses,
      sampleSize,
      sampleSuccesses
    );

    expect(result).toBeCloseTo(expectedResult, 0.28116); // Adjust precision as needed
  });

  // Add more test cases as needed () => {
  it("should calculate the cumulative hypergeometric probability for a card when drawing one card", () => {
    const deck: Deck = new Deck("title", false, "", "name", "nick", []);
    deck.setLibrary(["Card A", "Card A", "Card B", "Card B", "Card B"]);

    const cardName = "Card A";
    const turn = "Current";
    const successCount = 1;
    const drawCount = 1;

    // Expected hypergeometric probability for drawing one Card A
    const expectedHyperGeo = 0.4; // 2 out of 5 cards are Card A
    // Expected cumulative probability for drawing one Card A or more
    const expectedCumulative = 0.4; // Certain to draw at least one Card A

    const result = getCumulativeHyperGeometricProbabilityForCard(
      deck,
      cardName,
      turn,
      successCount,
      drawCount
    );

    expect(result.hyperGeo).toBeCloseTo(expectedHyperGeo, 4);
    expect(result.cumulative).toBe(expectedCumulative);
  });

  it("should handle the case when the card is in the graveyard", () => {
    const deck: Deck = new Deck("title", false, "", "name", "nick", []);
    deck.setLibrary(["Card A", "Card B", "Card C", "Card D", "Card E"]);
    deck.setGraveyard(["Card A"]);

    const cardName = "Card A";
    const turn = "Current";
    const successCount = 1;
    const drawCount = 3;

    // Expected hypergeometric probability for drawing one Card A
    const expectedHyperGeo = 0.6; // 1 out of 5 remaining cards in the library is Card A
    // Expected cumulative probability for drawing one Card A or more
    const expectedCumulative = 0.6; // 20% chance to draw Card A or more

    const result = getCumulativeHyperGeometricProbabilityForCard(
      deck,
      cardName,
      turn,
      successCount,
      drawCount
    );

    expect(result.hyperGeo).toBeCloseTo(expectedHyperGeo, 4);
    expect(result.cumulative).toBeCloseTo(expectedCumulative, 4);
  });

  it("should handle the case when drawing more cards than available in the library", () => {
    const deck: Deck = new Deck("title", false, "", "name", "nick", []);
    deck.setLibrary(["Card A", "Card B", "Card C", "Card D", "Card E"]);
    deck.setGraveyard([]);

    const cardName = "Card A";
    const turn = "Current";
    const successCount = 2;
    const drawCount = 4;

    // Expected hypergeometric probability for drawing two Card A
    const expectedHyperGeo = 0; // Not possible to draw 2 Card A from 3 cards
    // Expected cumulative probability for drawing two Card A or more
    const expectedCumulative = 0; // Not possible to draw 2 Card A from 3 cards

    const result = getCumulativeHyperGeometricProbabilityForCard(
      deck,
      cardName,
      turn,
      successCount,
      drawCount
    );

    expect(result.hyperGeo).toBe(expectedHyperGeo);
    expect(result.cumulative).toBe(expectedCumulative);
  });

  // Case where turn is Next and the second draw pool includes nonempty hand and inPlay cards.
  it("should calculate probability correctly for the next turn when the topCardLook amount exceeds library size", () => {
    //Arrange
    const deck = new Deck("Title", false, "rating", "Name", "nick", [
      "Kingdom",
    ]);
    deck.setEntireDeck([
      "Card1",
      "Card2",
      "Card2",
      "Card3",
      "Card3",
      "Card3",
      "Card4",
      "Card4",
      "Card4",
      "Card4",
      "Card5",
      "Card5",
      "Card5",
      "Card5",
      "Card5",
    ]);
    deck.setLibrary(["Card5"]);
    deck.setGraveyard([
      "Card2",
      "Card2",
      "Card3",
      "Card3",
      "Card4",
      "Card4",
      "Card4",
      "Card4",
      "Card5",
    ]);
    deck.setHand(["Card5", "Card5", "Card5", "Card1"]);
    deck.setInPlay(["Card3"]);
    const cardName = "Card1";
    const turn = "Next";
    const successCount = 1;
    const topCardsLookAmount = 3;
    //Act
    const result = getCumulativeHyperGeometricProbabilityForCard(
      deck,
      cardName,
      turn,
      successCount,
      topCardsLookAmount
    ).cumulative;

    // Expected result
    // Population size = graveyard length 10 + hand length 4 + inPlay length 1 - library size = 14
    // Population successes = 1
    // sample size = topCardsLookAmount 3 - librarySize 1 = 2
    // sample successes = 1

    const expectedResult = 0.14286;
    expect(result).toBeCloseTo(expectedResult);
  });
  it("should calculate probability correctly for the next turn when the topCardLook amount exceeds library size", () => {
    //Arrange
    const deck = new Deck("Title", false, "rating", "Name", "nick", [
      "Kingdom",
    ]);
    deck.setEntireDeck([
      "Card1",
      "Card2",
      "Card2",
      "Card3",
      "Card3",
      "Card3",
      "Card4",
      "Card4",
      "Card4",
      "Card4",
      "Card5",
      "Card5",
      "Card5",
      "Card5",
      "Card5",
    ]);
    deck.setLibrary(["Card5"]);
    deck.setGraveyard([
      "Card2",
      "Card2",
      "Card3",
      "Card3",
      "Card4",
      "Card4",
      "Card4",
      "Card4",
      "Card5",
    ]);
    deck.setHand(["Card5", "Card5", "Card5", "Card1"]);
    deck.setInPlay(["Card3"]);
    const cardName = "Card1";
    const turn = "Next";
    const successCount = 1;
    const topCardsLookAmount = 3;
    //Act
    const result = getCumulativeHyperGeometricProbabilityForCard(
      deck,
      cardName,
      turn,
      successCount,
      topCardsLookAmount
    ).cumulative;

    // Expected result
    // Population size = graveyard length 10 + hand length 4 + inPlay length 1 - library size = 14
    // Population successes = 1
    // sample size = topCardsLookAmount 3 - librarySize 1 = 2
    // sample successes = 1

    const expectedResult = 0.14286;
    expect(result).toBeCloseTo(expectedResult);
  });
});
