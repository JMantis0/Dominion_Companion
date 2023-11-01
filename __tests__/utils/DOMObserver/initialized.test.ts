import { describe, it, expect, beforeEach } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("initialized", () => {
  beforeEach(() => {
    DOMObserver.logInitialized = true;
    DOMObserver.playersInitialized = true;
    DOMObserver.kingdomInitialized = true;
    DOMObserver.decksInitialized = true;
  });
  it("Should  return true only if all 4 initialized fields are true", () => {
    // Arranged in beforeEach.

    // Act and Assert
    expect(DOMObserver.initialized()).toBe(true);
  });

  it("should return false if logsInitialized is false.", () => {
    //  Arrange
    DOMObserver.logInitialized = false;

    // Act and Assert
    expect(DOMObserver.initialized()).toBe(false);
  });

  it("should return false if playersInitialized is false.", () => {
    // Arrange
    DOMObserver.playersInitialized = false;

    // Act and Assert
    expect(DOMObserver.initialized()).toBe(false);
  });

  it("should return false if kingdomInitialized is false.", () => {
    //  Arrange
    DOMObserver.kingdomInitialized = false;

    // Act and Assert
    expect(DOMObserver.initialized()).toBe(false);
  });

  it("should return false if decksInitialized is false.", () => {
    // Arrange
    DOMObserver.decksInitialized = false

    // Act and Assert
    expect(DOMObserver.initialized()).toBe(false);
  });
});
