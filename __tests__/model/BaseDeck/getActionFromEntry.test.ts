import { it, describe, expect, afterEach } from "@jest/globals";
import { BaseDeck } from "../../../src/model/baseDeck";

describe("Function getActionFromEntry()", () => {
  let deck = new BaseDeck("", false, "", "pNick", "pName", []);
  afterEach(() => {
    deck = new BaseDeck("", false, "", "pNick", "pName", []);
  });

  it("should return 'None' if no action is found in the provided line", () => {
    // Act and Assert
    expect(deck.getActionFromEntry("pNick gets +$3.")).toBe("None");
  });

  it("should get action 'discards' correctly", () => {
    // Act and Assert
    expect(
      deck.getActionFromEntry(
        "pNick discards a Bandit, 2 Sentries, and a Vassal."
      )
    ).toBe("discards");
  });

  it("should get action 'draws' correctly", () => {
    // Act and Assert
    expect(
      deck.getActionFromEntry("pNick draws a Bandit, 2 Sentries, and a Vassal.")
    ).toBe("draws");
  });

  it("should get action 'gains' correctly", () => {
    // Act and Assert
    expect(deck.getActionFromEntry("pNick buys and gains a Copper.")).toBe(
      "gains"
    );
  });

  it("should get action 'looks at' correctly", () => {
    // Act and Assert
    expect(
      deck.getActionFromEntry("pNick looks at a Copper and a Vassal.")
    ).toBe("looks at");
  });

  it("should get action 'plays' correctly", () => {
    // Act and Assert
    expect(deck.getActionFromEntry("pNick plays a Cellar.")).toBe("plays");
  });

  it("should get action 'plays' correctly", () => {
    // Act and Assert
    expect(deck.getActionFromEntry("pNick reveals 2 Golds.")).toBe("reveals");
  });

  it("should get action 'shuffles their deck' correctly", () => {
    // Act and Assert
    expect(deck.getActionFromEntry("pNick shuffles their deck.")).toBe(
      "shuffles their deck"
    );
  });

  it("should get action 'topDecks' correctly", () => {
    // Act and Assert
    expect(deck.getActionFromEntry("pNick topdecks a Laboratory.")).toBe(
      "topdecks"
    );
  });

  it("should get action 'trashes' correctly", () => {
    // Act and Assert
    expect(deck.getActionFromEntry("pNick trashes a Copper.")).toStrictEqual(
      "trashes"
    );
  });

  it("should return correctly when a player nickname or opponent nickname has the same action word in their name", () => {
    deck.setPlayerNick("Massivegains");
    expect(deck.getActionFromEntry("Massivegains reveals 2 Vassals.")).toBe(
      "reveals"
    );
  });
});
