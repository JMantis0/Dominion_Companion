import { describe, it, expect } from "@jest/globals";
describe("Fail!", () => {
  it("Should pass", () => {
    expect(true).toBe(true);
  });
  it("Should fail2", () => {
    expect(false).toBe(true);
  });
});
