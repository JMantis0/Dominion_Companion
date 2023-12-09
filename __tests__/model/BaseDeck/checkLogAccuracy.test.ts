/**
 * @jest-environment jsdom
 */

import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import * as utils from "../../../src/utils/utils";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("checkLogAccuracy", () => {
  let deck: BaseDeck;
  const getLogScrollContainerLogLines = jest.spyOn(
    utils,
    "getLogScrollContainerLogLines"
  );
  beforeEach(() => {
    deck = new BaseDeck("", false, "", "Player", "P", []);
  });
  it("should return false if the logArchive and game-log lengths are not equal", () => {
    // Arrange
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createElement("div"));
    frag.appendChild(document.createElement("div"));
    frag.appendChild(document.createElement("div"));
    const logLines = frag.children as HTMLCollectionOf<HTMLElement>; //Length 3
    getLogScrollContainerLogLines.mockReturnValue(logLines);
    // Act
    deck.logArchive = ["1", "2"]; // Length 2
    // Assert
    expect(deck.checkLogAccuracy()).toBe(false);
  });
});
