import { describe, it, expect } from "@jest/globals";
import { combinations } from "../../src/utils/utils";

describe('combinations', () => {
  it('should calculate the combinations correctly', () => {
    // Test some example combinations
    expect(combinations(5, 0)).toBe(1); // C(5, 0) = 1
    expect(combinations(5, 1)).toBe(5); // C(5, 1) = 5
    expect(combinations(5, 2)).toBe(10); // C(5, 2) = 10
    expect(combinations(5, 3)).toBe(10); // C(5, 3) = 10
    expect(combinations(5, 4)).toBe(5);  // C(5, 4) = 5
    expect(combinations(5, 5)).toBe(1);  // C(5, 5) = 1
  });

  it('should handle edge cases', () => {
    // Test edge cases
    expect(combinations(0, 0)).toBe(1); // C(0, 0) = 1
    expect(combinations(5, 0)).toBe(1); // C(5, 0) = 1
    expect(combinations(0, 5)).toBe(0); // C(0, 5) = 0 (n < r, invalid)
  });

  it('should calculate large combinations', () => {
    // Test large combinations
    expect(combinations(20, 10)).toBe(184756); // C(20, 10) = 184,756
  });

  // Add more test cases as needed
});