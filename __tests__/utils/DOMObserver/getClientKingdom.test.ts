/**
 * @jest-environment jsdom
 */

import { expect, describe, it } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
describe("getClientKingdom()", () => {
  it("should return an array of the innerText of each name-layer element, and the common cards when element with class kingdom-viewer-group is present", () => {
    // Arrange
    // Create the name layer elements, assign innerText and name-layer class.
    const nameEl1: HTMLElement = document.createElement("div");
    nameEl1.innerText = "Fire";
    nameEl1.setAttribute("class", "name-layer");
    const nameEl2: HTMLElement = document.createElement("div");
    nameEl2.innerText = "Water";
    nameEl2.setAttribute("class", "name-layer");
    const nameEl3: HTMLElement = document.createElement("div");
    nameEl3.innerText = "Air";
    nameEl3.setAttribute("class", "name-layer");
    const nameEl4: HTMLElement = document.createElement("div");
    nameEl4.innerText = "Earth";
    nameEl4.setAttribute("class", "name-layer");
    const nameEl5: HTMLElement = document.createElement("div");
    nameEl5.innerText = "";
    nameEl5.setAttribute("class", "name-layer");
    // Create the parent element, and assign kingdom-viewer-group class.
    const kingdomViewerGroupElement = document.createElement("div");
    kingdomViewerGroupElement.setAttribute("class", "kingdom-viewer-group");
    const cardStacksElement = document.createElement("div");
    cardStacksElement.setAttribute("class", "card-stacks");
    //  Append name-layer elements to the card-stacks element.
    cardStacksElement.appendChild(nameEl1);
    cardStacksElement.appendChild(nameEl2);
    cardStacksElement.appendChild(nameEl3);
    cardStacksElement.appendChild(nameEl4);
    cardStacksElement.appendChild(nameEl5);
    //  Append kingdom-group-layer element to document body.
    document.body.appendChild(kingdomViewerGroupElement);
    document.body.appendChild(cardStacksElement);
    // Act and Assert - Simulate getting the client kingdom arranged above.
    expect(DOMObserver.getClientKingdom()).toStrictEqual([
      "Fire",
      "Water",
      "Air",
      "Earth",
    ]);
  });

  it("should throw an error if there is no kingdom viewer group element in the document", () => {
    // Arrange
    document.body.innerHTML = "";
    // Act and Assert - Simulate getting the client kingdom when no such elements are present in the DOM.
    expect(() => DOMObserver.getClientKingdom()).toThrowError(
      "The kingdom-viewer-group element is not present in the DOM"
    );
  });
});
