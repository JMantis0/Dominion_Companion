import { toErrorWithMessage} from "../../src/utils/utils";
import { ErrorWithMessage } from "../../src/utils";
import { describe, it, expect } from "@jest/globals";

describe("toErrorWithMessage", () => {
  it("should return an ErrorWithMessage when given an ErrorWithMessage", () => {
    const inputError: ErrorWithMessage = new Error("Test Error");
    const result = toErrorWithMessage(inputError);
    expect(result).toBe(inputError);
  });

  it("should return an ErrorWithMessage with the correct message when given an object", () => {
    const inputObject = { key: "value" };
    const result = toErrorWithMessage(inputObject);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe(JSON.stringify(inputObject));
  });

  it("should return an ErrorWithMessage with the correct message when given a non-string primitive", () => {
    const inputPrimitive = 42;
    const result = toErrorWithMessage(inputPrimitive);
    expect(result).toBeInstanceOf(Error);
    expect(result.message).toBe(String(inputPrimitive));
  });
});
