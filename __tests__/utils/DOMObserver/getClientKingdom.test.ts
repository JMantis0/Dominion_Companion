/**
 * @jest-environment jsdom
 */

import { expect, describe, it } from "@jest/globals";
import { DOMObserver } from "../../../src/utils/DOMObserver";
describe("getKingdom()", () => {
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
    // Create the parent element, and assign kingdom-viewer-group class.
    const kingdomViewerGroupElement = document.createElement("div");
    kingdomViewerGroupElement.setAttribute("class", "kingdom-viewer-group");
    //  Append name-layer elements to the kingdom-group-layer.
    kingdomViewerGroupElement.appendChild(nameEl1);
    kingdomViewerGroupElement.appendChild(nameEl2);
    kingdomViewerGroupElement.appendChild(nameEl3);
    kingdomViewerGroupElement.appendChild(nameEl4);
    //  Append kingdom-group-layer element to document body.
    document.body.appendChild(kingdomViewerGroupElement);
    // Act and Assert - Simulate getting the client kingdom arranged above.
    expect(DOMObserver.getClientKingdom()).toStrictEqual([
      "Fire",
      "Water",
      "Air",
      "Earth",
      "Province",
      "Gold",
      "Duchy",
      "Silver",
      "Estate",
      "Copper",
      "Curse",
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
