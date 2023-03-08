import { it, describe, expect, beforeEach } from "@jest/globals";
import { createRandomDeck } from "../testUtilFuncs";

describe("Function checkForCleanup()", () => {
  let line1: string;
  let line2: string;
  let line3: string;
  let line4: string;
  let line5: string;
  let line6: string;
  let line7: string;
  let line8: string;
  let line9: string;
  let line10: string;
  let rDeck = createRandomDeck();
  describe("when given a line that has a combined total of 5 a's and/or an's and/or number values", () => {
    beforeEach(() => {
      rDeck = createRandomDeck();
      line1 = `${rDeck.getPlayerNick} draws a frog, a mouse, a dog, a cat, and a fish`;
      line2 = `${rDeck.getPlayerNick}draws a frog, a mouse, a dog, and 2 cats`;
      line3 = `${rDeck.getPlayerNick}draws a frog, a mouse, and 3 dogs.`;
      line4 = `${rDeck.getPlayerNick}draws a frog and 4 mice`;
      line5 = `${rDeck.getPlayerNick}draws 5 mice.`;
      line6 = `${rDeck.getPlayerNick}draws 4 mice and a frog.`;
      line7 = `${rDeck.getPlayerNick}draws 3 mice, a frog, and a dog.`;
      line8 = `${rDeck.getPlayerNick}draws 2 mice, a frog, a dog, and a cat.`;
      line9 = `${rDeck.getPlayerNick}draws a mouse, a frog, a dog, a cat, and a fish.`;
      line10 = `${rDeck.getPlayerNick}draws 5 dogs.`;
    });
    it("should return true", () => {
      expect(rDeck.checkForCleanUp(line1)).toBeTruthy();
      expect(rDeck.checkForCleanUp(line2)).toBeTruthy();
      expect(rDeck.checkForCleanUp(line3)).toBeTruthy();
      expect(rDeck.checkForCleanUp(line4)).toBeTruthy();
      expect(rDeck.checkForCleanUp(line5)).toBeTruthy();
      expect(rDeck.checkForCleanUp(line6)).toBeTruthy();
      expect(rDeck.checkForCleanUp(line7)).toBeTruthy();
      expect(rDeck.checkForCleanUp(line8)).toBeTruthy();
      expect(rDeck.checkForCleanUp(line9)).toBeTruthy();
      expect(rDeck.checkForCleanUp(line10)).toBeTruthy();
    });
  });
  describe("when given a line that has a combined total of more or less than exactly 5 a's and/or an's and/or number values", () => {
    beforeEach(() => {
      line1 = "rNick draws a frog.";
      line2 = "rNick draws a frog and a monkey.";
      line3 = "rNick draws a frog, a mouse, and a monkey.";
      line4 = "rNick draws a frog, a mouse, a dog,and a monkey.";
      line5 = "rNick draws 5 mice,a monkey.";
      line6 = "rNick draws 4 mice a frog, and a monkey.";
      line7 = "rNick draws 3 mice,a frog, a dog, and a monkey.";
      line8 = "rNick draws 2 mice,a frog, a dog, a cat, and a monkey.";
      line9 =
        "rNick draws a mouse, a frog, a dog, a cat, a fish, and a monkey.";
      line10 = "rNick draws a cat and a monkey.";
    });
    it("should return false", () => {
      expect(rDeck.checkForCleanUp(line1)).toBeFalsy();
      expect(rDeck.checkForCleanUp(line2)).toBeFalsy();
      expect(rDeck.checkForCleanUp(line3)).toBeFalsy();
      expect(rDeck.checkForCleanUp(line4)).toBeFalsy();
      expect(rDeck.checkForCleanUp(line5)).toBeFalsy();
      expect(rDeck.checkForCleanUp(line6)).toBeFalsy();
      expect(rDeck.checkForCleanUp(line7)).toBeFalsy();
      expect(rDeck.checkForCleanUp(line8)).toBeFalsy();
      expect(rDeck.checkForCleanUp(line9)).toBeFalsy();
      expect(rDeck.checkForCleanUp(line10)).toBeFalsy();
    });
  });
});
