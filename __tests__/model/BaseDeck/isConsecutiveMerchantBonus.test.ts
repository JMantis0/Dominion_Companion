import { beforeEach, describe, it, expect } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("isConsecutiveMerchantBonus", () => {
  // Declare BaseDeck reference.
  let deck: BaseDeck;

  beforeEach(() => {
    deck = new BaseDeck("", false, "", "pName", "p", []);
  });

  it("should return true if the given line and the lastEntryProcessed field are both 'merchant bonus' lines, and the current line is not for exactly $1", () => {
    // Arrange - set up the current line and lastEntryProcessed to be merchant bonus lines
    deck.lastEntryProcessed = "p gets +$1. (Merchant)";
    const line = "p gets +$12. (Merchant)";

    // Act and Assert - Verify the method returns true
    expect(deck.isConsecutiveMerchantBonus(line)).toBe(true);
  });

  it("should return false if the current line is a merchant bonus line for exactly $1", () => {
    // Arrange - set up the current line and lastEntryProcessed to be merchant bonus lines, but the current
    // line is for exactly $1.
    deck.lastEntryProcessed = "p gets +$2. (Merchant)";
    const line = "p gets +$1. (Merchant)";

    // Act and Assert - Verify the method returns true
    expect(deck.isConsecutiveMerchantBonus(line)).toBe(false);
  });

  it("should return false if the given line is a Merchant bonus line, but the lastEntryProcessed is not.", () => {
    // Arrange - given line is a Merchant bonus line, but lastEntryProcessed is not
    deck.lastEntryProcessed = "p plays a Silver. (+$2)";
    const line = "p gets +$18. (Merchant)";

    // Act and Assert - Simulate checking for consecutive Merchant Bonus Lines and verify it returns false.
    expect(deck.isConsecutiveMerchantBonus(line)).toBe(false);
  });
});
