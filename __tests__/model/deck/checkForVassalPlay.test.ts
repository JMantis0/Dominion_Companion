/**
 * @jest-environment jsdom
 */
import { it, describe, expect, beforeEach, afterEach } from "@jest/globals";
import { Deck } from "../../../src/model/deck";

describe("Function checkForVassalPlay()", () => {
  const rDeck: Deck = new Deck("", false, "", "pName", "pNick", []);
  const logLineContainer = document.createElement("div");
  const logLine1Element = document.createElement("div");
  const logLine2Element = document.createElement("div");
  const logLine3Element = document.createElement("div");
  const logLine4Element = document.createElement("div");
  const logLine5Element = document.createElement("div");

  // Arrange DOM before each test
  beforeEach(() => {
    /** The document body innerHTML:
   * 
  <div class="log-scroll-container">
    <div class="log-line">pNick plays a Throne Room.</div>
    <div class="log-line">pNick plays a Vassal.</div>
    <div class="log-line">pNick gets +$2.</div>
    <div class="log-line" style="padding-left: 8%;">
      pNick discards a Vassal.
    </div>
    <div class="log-line" style="padding-left: 8%;">
      pNick plays a Vassal.
    </div>
  </div>;
  */
    logLine1Element.setAttribute("class", "log-line");
    logLine1Element.innerHTML = "pNick plays a Throne Room.";
    logLine2Element.setAttribute("class", "log-line");
    logLine2Element.innerHTML = "pNick plays a Vassal.";
    logLine3Element.innerHTML = "pNick gets +$2.";
    logLine3Element.setAttribute("class", "log-line");
    logLine4Element.innerHTML = "pNick discards a Vassal."; // Function checks the padding of this element
    logLine4Element.setAttribute("class", "log-line");
    logLine4Element.style.paddingLeft = "8%";
    logLine5Element.innerHTML = "pNick plays a Vassal."; // Function checks padding of this element
    logLine5Element.setAttribute("class", "log-line");
    logLine5Element.style.paddingLeft = "8%";
    logLineContainer.setAttribute("class", "log-scroll-container");
    logLineContainer.appendChild(logLine1Element);
    logLineContainer.appendChild(logLine2Element);
    logLineContainer.appendChild(logLine3Element);
    logLineContainer.appendChild(logLine4Element);
    logLineContainer.appendChild(logLine5Element);
    document.body.appendChild(logLineContainer);
  });
  // Clear the DOM after each test
  afterEach(() => {
    document.body.innerHTML = "";
  });
  it("should return true if the most recent play was a Vassal whose div element has equal left padding to the current div element", () => {
    //  Arrange
    const logArchive = [
      "pNick plays a Throne Room.",
      "pNick plays a Vassal.",
      "pNick gets +$2.",
      "pNick discards a Vassal.",
    ];
    rDeck.setLogArchive(logArchive);

    // Act
    const result = rDeck.checkForVassalPlay();

    // Assert
    expect(result).toBe(true);
  });

  it("should return false if the most recent play was a Vassal whose div element has equal left padding to the current div element", () => {
    //  Arrange
    const logArchive = [
      "pNick plays a Throne Room.",
      "pNick plays a Vassal.",
      "pNick gets +$2.",
      "pNick discards a Vassal.",
    ];
    rDeck.setLogArchive(logArchive);

    // Make padding of element of the card being played less the padding of the preceding element
    logLine5Element.style.paddingLeft = "0%";
    
    // Act
    const result = rDeck.checkForVassalPlay();

    // Assert
    expect(result).toBe(false);
  });

  it("should return false when the most recent play in the logArchive is not a Vassal", () => {
    // Arrange
    const logArchive = [
      "pNick plays a Throne Room.",
      "pNick plays a Sentry.",
      "pNick draws a Gold.",
      "pNick gets +1 Action.",
      "pNick looks at a Copper and an Estate.",
      "pNick trashes a Copper and an Estate.",
      "pNick plays a Sentry again.",
      "pNick draws a Gold.",
      "pNick gets +1 Action.",
      "pNick looks at a Copper and a Silver.",
      "pNick trashes a Copper.",
      "pNick topdecks a Silver.",
    ];
    rDeck.setLogArchive(logArchive);
    logLineContainer.remove();

    // Act
    const result = rDeck.checkForVassalPlay();

    // Assert
    expect(result).toBe(false);
  });

  it("should throw an error if the element for the current line paddingLeft property values to not end in a '%' character", () => {
    //  Arrange
    const logArchive = [
      "pNick plays a Throne Room.",
      "pNick plays a Vassal.",
      "pNick gets +$2.",
      "pNick discards a Vassal.",
    ];
    rDeck.setLogArchive(logArchive);

    // Make padding of element of the card being played less the padding of the preceding element
    logLine5Element.style.paddingLeft = "0";

    // Act and Assert
    expect(() => rDeck.checkForVassalPlay()).toThrowError(
      "Current line paddingLeft property does not end with %."
    );
  });

  it("should throw an error if the element for the previous line paddingLeft property values to not end in a '%' character", () => {
    //  Arrange
    const logArchive = [
      "pNick plays a Throne Room.",
      "pNick plays a Vassal.",
      "pNick gets +$2.",
      "pNick discards a Vassal.",
    ];
    rDeck.setLogArchive(logArchive);

    // Make padding of element of the card being played less the padding of the preceding element
    logLine4Element.style.paddingLeft = "0";

    // Act and Assert
    expect(() => rDeck.checkForVassalPlay()).toThrowError(
      "Previous line paddingLeft property does not end with %."
    );
  });
});
