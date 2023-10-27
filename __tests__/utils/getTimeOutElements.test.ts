/**
 * @jest-environment jsdom
 */
import { describe, it, expect } from "@jest/globals";
import { getTimeOutElements } from "../../src/utils/utils";

describe("Fimctopm getTimeOutElements", () => {
  it("should return the children of the <game-end-notification> element that have the class 'timeout'", () => {
    // Arrange innerHTML to simulate a window that appears when the game has ended.
    document.body.innerHTML = `
          <game-ended-notification>
              <!----><modal-window ng-if="$ctrl.shouldShow()" class="" style="">
              <div class="centered-container">
                  <div class="modal-window centered-content">
                      <ng-transclude>
                  <div class="timeout">The game has ended.</div>
                  <!----><div ng-if="$ctrl.wasResigned()" class="timeout">pName has resigned.</div><!---->
                  <button class="lobby-button" ng-click="$ctrl.ok()">Ok</button>
              </ng-transclude>
                  </div>
              </div></modal-window><!---->
          </game-ended-notification>`;

    // Act - get the timeOutElements
    const timeOutElements = getTimeOutElements();

    expect(timeOutElements.length).toBe(2);
    expect(timeOutElements[0].innerHTML).toBe("The game has ended.");
    expect(timeOutElements[0].classList.contains("timeout")).toBe(true);
    expect(timeOutElements[1].innerHTML).toBe("pName has resigned.");
    expect(timeOutElements[1].classList.contains("timeout")).toBe(true);
  });
});
