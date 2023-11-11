import { beforeEach, describe, it, expect } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("handleConsecutiveMerchantBonus", () => {
  // Declare BaseDeck reference.
  let deck: BaseDeck;

  beforeEach(() => {
    deck = new BaseDeck("", false, "", "pName", "p", []);
  });
  // Cases -
  // 1) both of the most recent logArchive entries are Merchant bonus lines
  // 2) only one of the most recent logArchive entries is a Merchant bonus line
  // 3) neither of the most recent 2 logArchive entries are Merchant bonus lines.

  // Case 1
  it("should remove two logs from logArchive if they are both Merchant bonus lines.", () => {
    // Arrange
    deck.logArchive = [
      "p plays a Silver. (+$2)",
      "p gets +$4. (Merchant)",
      "p gets +$1. (Merchant)",
    ];
    deck.lastEntryProcessed = "p gets +$1. (Merchant)";
    // const line = "p gets +$6. (Merchant)";
    // Act - Simulate handling consecutive Merchant bonus lines with the arranged line and logArchive
    deck.handleConsecutiveMerchantBonus();

    // Assert - Verify the two logArchive lines were removed
    expect(deck.logArchive).toStrictEqual(["p plays a Silver. (+$2)"]);
  });

  // Case 2
  it("should, remove only the most recent logArchive entry if it is a Merchant bonus line, but the 2nd most recent is not. ", () => {
    // Arrange - set up the current line and lastEntryProcessed to be Merchant bonus lines
    deck.logArchive = ["p plays a Silver. (+$2)", "p gets +$1. (Merchant)"];
    deck.lastEntryProcessed = "p gets +$1. (Merchant)";
    // const line = "p gets +$2. (Merchant)";

    // Simulate handling consecutive Merchant bones lines when only the most recent logArchive line is a Merchant bonus line
    deck.handleConsecutiveMerchantBonus();
    // Act and Assert - Verify only the last logArchive entry was removed
    expect(deck.logArchive).toStrictEqual(["p plays a Silver. (+$2)"]);
  });

  // Case 3 should never occur if the isConsecutiveMerchantBonusLine method is being used.
  it("should not alter the logArchive if neither of the last 2 logArchive entries are Merchant bonus lines", () => {
    // Arrange - set up the current line to be a Merchant bonus line but the last 2 logArchive entries to not be Merchant bonus lines.
    deck.logArchive = ["p draws an Estate.", "p plays a Silver. (+$2)"];
    deck.lastEntryProcessed = "p plays a Silver. (+$2)";
    // const line = "p gets +$6. (Merchant)";

    // Act - Simulate handling consecutive Merchant bonus when neither of the most recent logArchive entries are Merchant bonus lines
    deck.handleConsecutiveMerchantBonus();

    // Assert - Verify the logArchive is not altered.
    expect(deck.logArchive).toStrictEqual([
      "p draws an Estate.",
      "p plays a Silver. (+$2)",
    ]);
  });

  it("should remove the previous log entries when the given line a Merchant bonus line with a even $ value greater than 2", () => {});
});
