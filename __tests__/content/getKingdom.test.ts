/**
 * @jest-environment jsdom
 */

import { beforeAll } from "@jest/globals";
import { expect, describe, it } from "@jest/globals";
import { getKingdom } from "../../src/utils/utils";

describe("Function getKingdom()", () => {
  describe("when element with class kingdom-viewer-group is present", () => {
    let kingdomViewerGroupElement: HTMLElement;
    beforeAll(() => {
      // create the name layer elements, assign innerText and name-layer class
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
      // create the parent element, and assign kingdom-viewer-group class
      kingdomViewerGroupElement = document.createElement("div");
      kingdomViewerGroupElement.setAttribute("class", "kingdom-viewer-group");
      //  append name-layer elements to the kingdom-group-layer
      kingdomViewerGroupElement.appendChild(nameEl1);
      kingdomViewerGroupElement.appendChild(nameEl2);
      kingdomViewerGroupElement.appendChild(nameEl3);
      kingdomViewerGroupElement.appendChild(nameEl4);
      //  append kingdom-group-layer element to document
      document.body.appendChild(kingdomViewerGroupElement);
    });
    it("should return an array of the innerText of each name-layer element, and the common cards", () => {
      expect(getKingdom()).toStrictEqual([
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
  });
});
