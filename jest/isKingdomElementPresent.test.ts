import { beforeEach } from "@jest/globals";
import { expect, jest, describe, it } from "@jest/globals";
import { isKingdomElementPresent } from "../src/content/contentFunctions";

describe("Function isKingdomElementPresent", () => {
  describe("when element with class kinddom-viewer-group is present", () => {
    beforeEach(() => {
      let kingdomElement: HTMLElement = document.createElement(
        "div"
      ) as HTMLElement;
      kingdomElement.setAttribute("class", "kingdom-viewer-group)");
      document.body.appendChild(kingdomElement);
      let elementCollection: HTMLCollectionOf<HTMLElement>;
      let frag: DocumentFragment = document.createDocumentFragment();
      frag.appendChild(kingdomElement);
      elementCollection = frag.children as HTMLCollectionOf<HTMLElement>;
      const spy = jest.spyOn(document, "getElementsByClassName");
      spy.mockReturnValue(elementCollection);
    });
    it("should return true", () => {
      expect(isKingdomElementPresent()).toBe(true);
    });
  });
});
