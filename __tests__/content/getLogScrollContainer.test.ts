/**
 * @jest-environment jsdom
 */

import { it, expect, describe, beforeEach } from "@jest/globals";
import { getLogScrollContainer } from "../../src/content/contentFunctions";

describe("Function getLogScrollContainer()", () => {
  let logScrollContainer: HTMLElement;
  describe("when elemement  with class 'log-scroll-container' is present in the DOM", () => {
    beforeEach(() => {
      logScrollContainer = document.createElement("div");
      logScrollContainer.setAttribute("class", "log-scroll-container");
      document.body.appendChild(logScrollContainer);
    });
    it("should return the element", () => {
      expect(getLogScrollContainer()).toStrictEqual(logScrollContainer);
    });
  });
  describe("when element with class 'log-scroll-container' is not presend in the DOM", () => {
    beforeEach(() => {
      logScrollContainer.remove()
    });
    it("should throw an error", () => {
      expect(() => getLogScrollContainer()).toThrow(Error);
    });
  });
});

