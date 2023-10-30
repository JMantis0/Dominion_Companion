import { describe, it, expect } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("Function isMerchantBonusLine", () => {
  it("should return true if the line is a 'Merchant Bonus Line', ie: matches a particular regex", () => {
    // Assert - simulate checking a line that is a Merchant Bonus Line.
    expect(DOMObserver.isMerchantBonusLine("pName gets +$3. (Merchant)")).toBe(
      true
    );
  });

  it("should return false if the given line is not a 'Merchant Bonus Line'", () => {
    // Assert - simulate checking a line that is not a Merchant Bonus Line.
    expect(DOMObserver.isMerchantBonusLine("pNick plays a Merchant.")).toBe(
      false
    );
  });
});
