/**
 * @jest-environment jsdom
 */

import { it, expect, describe } from "@jest/globals";
import { getPrimaryFrameStatus } from "../../src/utils/utils";

describe("Function getPrimaryFrameStatus()", () => {
  it("should return true if the primary frame element has class hidden", () => {
    document.body.innerHTML = "<div id='primaryFrame' class='hidden'></div>";
    expect(getPrimaryFrameStatus()).toBeTruthy();
  });
  it("should return false if the primary frame element does not have he class hidden", () => {
    document.body.innerHTML = "<div id='primaryFrame' class=''></div>";
    expect(getPrimaryFrameStatus()).toBeFalsy();
  });
});
