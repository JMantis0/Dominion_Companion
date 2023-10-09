/**
 * @jest-environment jsdom
 */

import {
  describe,
  afterEach,
  expect,
  it,
  beforeEach,
  // jest,
} from "@jest/globals";
import { addResizableAndCustomHandleToCustomSelectScrollBars } from "../../src/utils/utils";
import $ from "jquery";

describe("addResizableAndCustomHandleToCustomSelectScrollBars", () => {
  let selectScrollbarsElement: JQuery<HTMLElement>;
  let handleId: string;
  let customHandle: HTMLElement;

  beforeEach(() => {
    const scrollEl = document.createElement("div");
    handleId = "custom-handle-id";
    customHandle = document.createElement("div");

    document.body.appendChild(scrollEl);
  });

  afterEach(() => {
    // Clean up the DOM and reset spies after each test
    document.body.removeChild(customHandle);
  });

  it("should add resizable widget with custom handle", () => {
    // Call the function to be tested
    addResizableAndCustomHandleToCustomSelectScrollBars(
      $,
      $(selectScrollbarsElement),
      handleId
    );

    // Assert that the custom handle was added to the element
    expect(selectScrollbarsElement[0].contains(customHandle)).toBe(true);

    // // Assert that the jQuery resizable function was called with the expected arguments
    // expect($.fn.resizable).toHaveBeenCalledTimes(2); // Called twice in the function

    // Assert that the custom handle has the required classes and id
    expect(customHandle.classList).toContain("ui-resizable-handle");
    expect(customHandle.classList).toContain("ui-resizable-s");
    expect(customHandle.classList).toContain("ui-resizable-se");
    expect(customHandle.classList).toContain("ui-icon");
    expect(customHandle.classList).toContain("ui-icon-gripsmall-diagonal-se");
    expect(customHandle.id).toBe(handleId);
  });
});
