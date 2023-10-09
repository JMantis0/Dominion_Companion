import { describe, it, expect } from "@jest/globals";
import { getRowColor } from "../../src/utils/utils"; // Update with the actual file path

describe("getRowColor", () => {
  it("should return the correct color for a treasure card", () => {
    // Arrange - Create a sample card name for a treasure card
    const cardName = "Silver";

    // Act
    const color = getRowColor(cardName);

    // Assert
    expect(color).toBe("text-[#F4FF00]");
  });

  it("should return the correct color for a victory card", () => {
    // Arrange - Create a sample card name for a victory card
    const cardName = "Province";

    // Act
    const color = getRowColor(cardName);

    // Assert
    expect(color).toBe("text-green-300");
  });

  it("should return the correct color for a curse card", () => {
    // Arrange - Create a sample card name for a curse card
    const cardName = "Curse";

    // Act
    const color = getRowColor(cardName);

    // Assert
    expect(color).toBe("text-purple-400");
  });

  it("should return the correct color for a reaction card", () => {
    // Arrange - Create a sample card name for a reaction card
    const cardName = "Moat";

    // Act
    const color = getRowColor(cardName);

    // Assert
    expect(color).toBe("text-[#6eccff]");
  });

  it("should return the default color for an action card", () => {
    // Arrange - Create a sample card name for an action card
    const cardName = "Village"; // Not in any special category

    // Act
    const color = getRowColor(cardName);

    // Assert
    expect(color).toBe("text-[#fff5c7]");
  });

  // Add more test cases as needed
});
