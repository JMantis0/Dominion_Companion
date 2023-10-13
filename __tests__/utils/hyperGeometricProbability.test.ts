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
  it("should calculate probability of 0 if parameters are out of bounds: negative sample successes.", () => {
    // Arrange
    const n = 100; // population size
    const N = 10; // # of population successes
    const k = 50; // sample size
    const x = -1; // # of sample successes NEGATIVE

    const expected = 0;

    // Act
    const result = hyperGeometricProbability(n, N, k, x);
    expect(result).toEqual(expected);
  });
  it("should calculate probability of 0 if parameters are out of bounds: sample successes exceed sample size", () => {
    // Arrange
    const n = 100; // population size
    const N = 10; // # of population successes
    const k = 5; // sample size
    const x = 6; // # of sample successes GREATER THAN SAMPLE SIZE

    const expected = 0;

    // Act
    const result = hyperGeometricProbability(n, N, k, x);
    expect(result).toEqual(expected);
  });
  it("should calculate probability of 0 if parameters are out of bounds: sample successes exceed population successes", () => {
    // Arrange
    const n = 100; // population size
    const N = 10; // # of population successes
    const k = 50; // sample size
    const x = 11; // more sample successes than population successes

    const expected = 0;

    // Act
    const result = hyperGeometricProbability(n, N, k, x);
    expect(result).toEqual(expected);
  });
  it("should calculate probability of 0 if parameters are out of bounds: sample failures exceeds population failures", () => {
    // Arrange
    const n = 10; // population size
    const N = 9; // # of population successes
    const k = 3; // sample size
    const x = 1; // only 1 failure in population but two failures in sample.

    const expected = 0;

    // Act
    const result = hyperGeometricProbability(n, N, k, x);
    expect(result).toEqual(expected);
  });
});
