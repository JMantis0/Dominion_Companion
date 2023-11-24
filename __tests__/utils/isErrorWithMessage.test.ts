import { describe, it, expect } from "@jest/globals";
import { isErrorWithMessage } from "../../src/utils/utils";
import { ErrorWithMessage } from "../../src/utils";

describe("isErrorWithMessage", () => {
  it("should return true for an object with a \"message\" property", () => {
    // Arrange - Create a sample error object with a "message" property
    const errorObject = new Error("Sample error message");

    // Act
    const result = isErrorWithMessage(errorObject);

    // Assert
    expect(result).toBe(true);
  });

  it("should return true for a custom error object with a \"message\" property", () => {
    // Arrange - Create a sample custom error object with a "message" property
    const customErrorObject = { message: "Custom error message" } as ErrorWithMessage;

    // Act
    const result = isErrorWithMessage(customErrorObject);

    // Assert
    expect(result).toBe(true);
  });

  it("should return false for an object without a \"message\" property", () => {
    // Arrange - Create a sample object without a "message" property
    const objectWithoutMessage = { key: "value" };

    // Act
    const result = isErrorWithMessage(objectWithoutMessage);

    // Assert
    expect(result).toBe(false);
  });

  it("should return false for a non-object value", () => {
    // Arrange - Create a non-object value (string)
    const stringValue = "This is not an error object";

    // Act
    const result = isErrorWithMessage(stringValue);

    // Assert
    expect(result).toBe(false);
  });

  it("should return false for null", () => {
    // Arrange - Create a null value
    const nullValue = null;

    // Act
    const result = isErrorWithMessage(nullValue);

    // Assert
    expect(result).toBe(false);
  });

  it("should return false for an object with a non-string \"message\" property", () => {
    // Arrange - Create an object with a non-string "message" property
    const errorObjectWithNonStringMessage = { message: 42 };

    // Act
    const result = isErrorWithMessage(errorObjectWithNonStringMessage);

    // Assert
    expect(result).toBe(false);
  });
});