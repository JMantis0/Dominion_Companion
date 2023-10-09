/**
 * @jest-environment jsdom
 */

import { it, describe, expect, beforeEach, afterEach } from "@jest/globals";
import { getLogScrollContainerLogLines } from "../../src/utils/utils";

describe("Function getLogScrollContainerLogLines", () => {
  let logScrollContainer: HTMLElement;
  let logLine1: HTMLElement;
  let logLine2: HTMLElement;
  let logLine1Text: Element;
  let logLine2Text: Element;
  let frag: DocumentFragment;
  let expectedLogLine1: HTMLElement;
  let expectedLogLine2: HTMLElement;
  let expectedLogLine1Text: HTMLElement;
  let expectedLogLine2Text: HTMLElement;
  let expectedCollection: HTMLCollection;

  describe("when a div with class 'log-scroll-container' is present in the DOM, should return a collection of all of it's children having class 'log-line'", () => {
    beforeEach(() => {
      logScrollContainer = document.createElement("div");
      logScrollContainer.setAttribute("class", "log-scroll-container");
      logLine1 = document.createElement("div");
      logLine1.setAttribute("class", "log-line");
      logLine2 = document.createElement("div");
      logLine2.setAttribute("class", "log-line");
      logLine1Text = document.createElement("span");
      logLine2Text = document.createElement("span");
      logLine1Text.textContent = "I'm inside log-line 1";
      logLine2Text.textContent = "I'm inside log-line 2";

      logLine1.appendChild(logLine1Text);
      logLine2.appendChild(logLine2Text);
      logScrollContainer.appendChild(logLine1);
      logScrollContainer.appendChild(logLine2);

      expectedLogLine1 = document.createElement("div");
      expectedLogLine1.setAttribute("class", "log-line");
      expectedLogLine2 = document.createElement("div");
      expectedLogLine2.setAttribute("class", "log-line");
      expectedLogLine1Text = document.createElement("span");
      expectedLogLine2Text = document.createElement("span");
      expectedLogLine1Text.textContent = "I'm inside log-line 1";
      expectedLogLine2Text.textContent = "I'm inside log-line 2";

      expectedLogLine1.appendChild(expectedLogLine1Text);
      expectedLogLine2.appendChild(expectedLogLine2Text);
      frag = document.createDocumentFragment();

      frag.appendChild(expectedLogLine1);
      frag.appendChild(expectedLogLine2);
      expectedCollection = frag.children;

      document.body.appendChild(logScrollContainer);
    });
    afterEach(() => {
      logScrollContainer.remove();
    });
    it("should return true", () => {
      expect(getLogScrollContainerLogLines()).toStrictEqual(expectedCollection);
    });
  });
  describe("When no div with class 'log-scroll-container' exists in the DOM", () => {
    beforeEach(() => {});
    it("should throw an error", () => {
      expect(() => getLogScrollContainerLogLines()).toThrow(Error);
    });
  });
  // Another suite with some different techniques.
  describe("getLogScrollContainerLogLines", () => {
    // Mock the document and necessary elements
    beforeEach(() => {
      document.body.innerHTML = `
        <div class="log-scroll-container">
          <div class="log-line">Log Line 1</div>
          <div class="log-line">Log Line 2</div>
          <div class="log-line">Log Line 3</div>
        </div>
      `;
    });

    // Reset the document after each test
    afterEach(() => {
      document.body.innerHTML = "";
    });

    it("should return a collection of log lines", () => {
      // Act
      const logLineCollection = getLogScrollContainerLogLines();

      // Assert
      expect(logLineCollection).toBeInstanceOf(HTMLCollection);
      expect(logLineCollection.length).toBe(3); // Assuming there are 3 log lines
    });

    it("should throw an error if the container element is undefined", () => {
      // Arrange - Remove the container element to simulate an undefined scenario
      const containerElement = document.querySelector(".log-scroll-container");
      if (containerElement) {
        containerElement.parentNode?.removeChild(containerElement);
      }

      // Act and Assert
      expect(() => getLogScrollContainerLogLines()).toThrowError(
        "Element is undefined"
      );
    });

    // Add more test cases as needed
  });
});
