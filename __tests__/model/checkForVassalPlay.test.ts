/**
 * @jest-environment jsdom
 */
import { afterEach, it, describe, beforeEach, expect } from "@jest/globals";
import { Deck } from "../../src/model/deck";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkForVassalPlay()", () => {
  let rDeck: Deck;
  let logArchive: string[];
  let logLine1Element: HTMLElement;
  let logLine2Element: HTMLElement;
  let logLine3Element: HTMLElement;
  let logLine4Element: HTMLElement;
  let logLine5Element: HTMLElement;
  let logLineContainer: HTMLElement;
  describe("when the logArchive length is greater than 3", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = [
        "G plays a Throne Room.",
        "G plays a Vassal.",
        "G gets +$2.",
        "G discards a Vassal.",
      ];
      rDeck.setLogArchive(logArchive);
    });
    describe("and the most recent play was a vassal", () => {
      beforeEach(() => {
        logLine1Element = document.createElement("div");
        logLine1Element.setAttribute("class", "log-line");
        logLine1Element.innerText = "G plays a Throne Room.";
        logLine2Element = document.createElement("div");
        logLine2Element.setAttribute("class", "log-line");
        logLine2Element.innerText = "G plays a Vassal.";
        logLine3Element = document.createElement("div");
        logLine3Element.innerText = "G gets +$2.";
        logLine3Element.setAttribute("class", "log-line");
        logLine4Element = document.createElement("div");
        logLine4Element.innerText = "G discards a Vassal."; // Function checks the padding of this element
        logLine4Element.setAttribute("class", "log-line");
        logLine5Element = document.createElement("div");
        logLine5Element.innerText = "G plays a Vassal."; // Function checks padding of this element
        logLine5Element.setAttribute("class", "log-line");
        logLineContainer = document.createElement("div");
        logLineContainer.setAttribute("class", "log-scroll-container");
        logLineContainer.appendChild(logLine1Element);
        logLineContainer.appendChild(logLine2Element);
        logLineContainer.appendChild(logLine3Element);
        logLineContainer.appendChild(logLine4Element);
        logLineContainer.appendChild(logLine5Element);
        document.body.appendChild(logLineContainer);
      });
      afterEach(() => {
        logLineContainer.remove();
      });
      describe("and the current line's log-line element padding is greater than or equal to the previous line's log-line element padding", () => {
        beforeEach(() => {
          logLine4Element.style.paddingLeft = "8%";
          logLine5Element.style.paddingLeft = "8%";
        });
        it("should return true", () => {
          expect(rDeck.checkForVassalPlay()).toBeTruthy();
        });
      });
      describe("and the current line's log-line element padding is less than the previous line's log-line element", () => {
        beforeEach(() => {
          logLine4Element.style.paddingLeft = "8%";
          logLine5Element.style.paddingLeft = "0%";
        });
        it("should return false", () => {
          expect(rDeck.checkForVassalPlay()).toBeFalsy();
        });
      });
    });
  });
  describe("When the logArchive is length less than 3", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      logArchive = ["G plays a Vassal.", "G discards a Vassal."];
      rDeck.setLogArchive(logArchive);
      logLine1Element = document.createElement("div");
      logLine1Element.setAttribute("class", "log-line");
      logLine1Element.innerText = "G plays a Vassal";
      logLine2Element = document.createElement("div");
      logLine2Element.setAttribute("class", "log-line");
      logLine2Element.innerText = "G plays a Sentry.";

      logLineContainer.appendChild(logLine1Element);
      logLineContainer.appendChild(logLine2Element);
      document.body.appendChild(logLineContainer);
      logLine1Element.style.paddingLeft = "8%";
      logLine2Element.style.paddingLeft = "8%";
    });
    it("should return false", () => {
      expect(rDeck.checkForVassalPlay()).toBeFalsy();
    });
  });
});
