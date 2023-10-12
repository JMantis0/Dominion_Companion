import { product_Range } from "../../src/utils/utils"; // Import the function and adjust the path
import { describe, it, expect } from "@jest/globals";

describe("product_Range", () => {
  it("should calculate the product of numbers in the range from a to b (inclusive)", () => {
    // Arrange
    const a = 2;
    const b = 5;

    // Act
    const result = product_Range(a, b);

    // Assert
    // The product of numbers from 2 to 5 (inclusive) is 2 * 3 * 4 * 5 = 120
    expect(result).toBe(120);
  });

  it("should return correct answer if a and b are the same", () => {
    // Arrange
    const a = 3;
    const b = 3;

    // Act
    const result = product_Range(a, b);

    // Assert
    // The product of a single number is itself, so it should return 3.
    expect(result).toBe(3);
  });

  it("should throw an error if a is greater than b", () => {
    // Arrange
    const a = 5;
    const b = 3;

    // Act and Assert
    // If a is greater than b, the product should still be 1.
    expect(()=>product_Range(a, b)).toThrowError("product_Range invalid parameters (a>b)");
  });
});
