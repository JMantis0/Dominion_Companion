import { describe, it, expect } from "@jest/globals";
import { stringifyProbability } from "../../src/utils/utils";
describe("Function stringifyProbability", () => {
  it("should take a number and output a human readable string with 1 decimal ", () => {
    // Arrange
    const probability = 0.4534351;
    const expectedString = "45.3%";

    // Act
    let probabilityString = stringifyProbability(probability);

    // Assert
    expect(probabilityString).toStrictEqual(expectedString);
  });
  it("should take a number and output a human readable string, rounding up", () => {
    // Arrange
    const probability = 0.4536;
    const expectedString = "45.4%";

    // Act
    let probabilityString = stringifyProbability(probability);

    // Assert
    expect(probabilityString).toStrictEqual(expectedString);
  });
  it("should take a number and output a human readable string, rounding down", () => {
    // Arrange
    const probability = 0.4436;
    const expectedString = "44.4%";

    // Act
    let probabilityString = stringifyProbability(probability);

    // Assert
    expect(probabilityString).toStrictEqual(expectedString);
  });
});
