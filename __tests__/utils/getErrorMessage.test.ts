import {
  getErrorMessage,
  // toErrorWithMessage,
  // isErrorWithMessage,
} from "../../src/utils/utils";
import { it, describe, expect } from "@jest/globals";

describe("getErrorMessage", () => {
  it("should return the error message", () => {
    // Error case
    const mockError = new Error("Test error message");
    const errorMessage = getErrorMessage(mockError);
    expect(errorMessage).toBe("Test error message");

    // Non error case
    const mockNonError = "Just a string";
    const nonErrorMessage = getErrorMessage(mockNonError);
    expect(nonErrorMessage).toStrictEqual('"Just a string"');

    // ErrorWithMessage case
    const mockErrorOject = {
      message: "Test object error message",
    };
    //
    const errorObjectMessage = getErrorMessage(mockErrorOject);
    expect(errorObjectMessage).toStrictEqual("Test object error message");
  });

  // NonError Object case
  const mockNonErrorOject = {
    notAMessage: "Test object error message",
  };
  const nonErrorObjectMessage = getErrorMessage(mockNonErrorOject);
  expect(nonErrorObjectMessage).toStrictEqual(
    JSON.stringify(mockNonErrorOject)
  );
});
