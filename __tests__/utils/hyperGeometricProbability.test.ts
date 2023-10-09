import { hyperGeometricProbability } from "../../src/utils/utils";
import { expect, describe, it } from "@jest/globals";
describe("hyperGeometricProbability", () => {
  it("should calculate the hypergeometric probability correctly", () => {
    // Arrange - Define input values and expected output
    const populationSize = 100;
    const populationSuccesses = 30;
    const sampleSize = 10;
    const sampleSuccesses = 5;

    // Act - Call the function
    const result = hyperGeometricProbability(
      populationSize,
      populationSuccesses,
      sampleSize,
      sampleSuccesses
    );

    // Assert - Check if the function correctly calculates hypergeometric probability
    expect(result).toBeCloseTo(0.09964);
  });
});
