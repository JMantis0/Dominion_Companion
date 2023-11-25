/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom/jest-globals";
import React from "react";
import PrimaryFrame from "../../../src/content/PrimaryFrame/PrimaryFrame";
import { act, cleanup, fireEvent, screen } from "@testing-library/react";
import { it, expect, describe, afterEach } from "@jest/globals";
import {
  renderWithProviders,
  renderWithProvidersAndCSS,
} from "../assets/test-utils";
import {
  setBaseOnly,
  setGameActiveStatus,
  setOpponentDeck,
  setPlayerDeck,
} from "../../../src/redux/contentSlice";
import { Deck } from "../../../src/model/deck";
import { OpponentDeck } from "../../../src/model/opponentDeck";
import { DOMObserver } from "../../../src/utils/DOMObserver";

describe("PrimaryFrame", () => {
  afterEach(() => {
    cleanup();
  });

  it("should render correctly as user interacts with PrimaryFrameTabs", async () => {
    // Arrange
    const { store } = renderWithProvidersAndCSS(<PrimaryFrame />);
    act(() => {
      store.dispatch(setBaseOnly(true));
      store.dispatch(setGameActiveStatus(true));
      store.dispatch(
        setPlayerDeck(
          JSON.parse(
            JSON.stringify(new Deck("", false, "", "Player Name", "P", []))
          )
        )
      );
      store.dispatch(
        setOpponentDeck(
          JSON.parse(
            JSON.stringify(
              new OpponentDeck("", false, "", "Opponent Name", "O", [])
            )
          )
        )
      );
    });
    const deckTab = screen.getByRole("button", { name: /Deck \d*/ });
    const opponentTab = screen.getByRole("button", { name: /Opponent \d*/ });
    const discardTab = screen.getByRole("button", { name: /Discard \d*/ });
    const trashTab = screen.getByRole("button", { name: /Trash \d*/ });
    const opponentViewer = screen.getByText(/Opponent Name's Deck/);
    const mainDeckViewer = screen.getByText(/Player Name's Deck/);
    const discardViewer = screen.getByText(/Player Name's discard pile:/);
    const trashViewer = screen.getByText(/Player Name's trash/);

    // Verify all 4 tabs and all 4 viewers are in the document.
    expect(deckTab).toBeInTheDocument();
    expect(opponentTab).toBeInTheDocument();
    expect(discardTab).toBeInTheDocument();
    expect(trashTab).toBeInTheDocument();
    expect(mainDeckViewer).toBeInTheDocument();
    expect(discardViewer).toBeInTheDocument();
    expect(opponentViewer).toBeInTheDocument();
    expect(trashViewer).toBeInTheDocument();

    // Verify only the Main Deck Viewer is visible.
    expect(mainDeckViewer).toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Hover the Opponent Tab and verify only the Opponent Viewer is visible.
    fireEvent.mouseEnter(opponentTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Unhover and verify only Main Deck viewer is visible once again.
    fireEvent.mouseLeave(opponentTab);
    expect(mainDeckViewer).toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Hover the Trash Tab and verify only the Trash Viewer is visible
    fireEvent.mouseEnter(trashTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).toBeVisible();

    // Unhover and verify only Main Deck viewer is visible once again.
    fireEvent.mouseLeave(trashTab);
    expect(mainDeckViewer).toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Hover the Discard Tab and verify only the Discard Viewer is visible.
    fireEvent.mouseEnter(discardTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Unhover and verify only Main Deck viewer is visible once again.
    fireEvent.mouseLeave(discardTab);
    expect(mainDeckViewer).toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Hover, click, and unhover the Discard Tab, and verify only the Discard Viewer is visible.
    fireEvent.mouseEnter(discardTab);
    fireEvent.click(discardTab);
    fireEvent.mouseLeave(discardTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Hover the Deck Tab and verify only the Main Viewer is visible
    fireEvent.mouseEnter(deckTab);
    expect(mainDeckViewer).toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Unhover and verify only the Discard Viewer is visible once again.
    fireEvent.mouseLeave(deckTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Hover the Opponent Tab and verify only the Opponent Viewer is visible
    fireEvent.mouseEnter(opponentTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Unhover and verify only the Discard Viewer is visible once again.
    fireEvent.mouseLeave(opponentTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Hover the Trash Tab and verify only the Trash Viewer is visible
    fireEvent.mouseEnter(trashTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).toBeVisible();

    // Unhover and verify only the Discard Viewer is visible once again.
    fireEvent.mouseLeave(trashTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Hover, click, and unhover the Opponent Tab, and verify only the Opponent Viewer is visible.
    fireEvent.mouseEnter(opponentTab);
    fireEvent.click(opponentTab);
    fireEvent.mouseLeave(opponentTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Hover the Deck Tab and verify only the Main Viewer is visible
    fireEvent.mouseEnter(deckTab);
    expect(mainDeckViewer).toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Unhover and verify only the Opponent Viewer is visible once again.
    fireEvent.mouseLeave(deckTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Hover the Discard Tab and verify only the Discard Viewer is visible.
    fireEvent.mouseEnter(discardTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Unhover and verify only Opponent viewer is visible once again.
    fireEvent.mouseLeave(discardTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Hover the Trash Tab and verify only the Trash Viewer is visible.
    fireEvent.mouseEnter(trashTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).toBeVisible();

    // Unhover and verify only Opponent Viewer is visible once again.
    fireEvent.mouseLeave(trashTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Hover, click, and unhover the Trash Tab, and verify only the Trash Viewer is visible.
    fireEvent.mouseEnter(trashTab);
    fireEvent.click(trashTab);
    fireEvent.mouseLeave(trashTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).toBeVisible();

    // Hover the Deck Tab and verify only the Main Viewer is visible
    fireEvent.mouseEnter(deckTab);
    expect(mainDeckViewer).toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Unhover and verify only the Trash Viewer is visible once again.
    fireEvent.mouseLeave(deckTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).toBeVisible();

    // Hover the Discard Tab and verify only the Discard Viewer is visible.
    fireEvent.mouseEnter(discardTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Unhover and verify only Trash Viewer is visible once again.
    fireEvent.mouseLeave(discardTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).toBeVisible();

    // Hover the Opponent Tab and verify only the Opponent Viewer is visible.
    fireEvent.mouseEnter(opponentTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).toBeVisible();
    expect(trashViewer).not.toBeVisible();

    // Unhover and verify only Trash Viewer is visible once again.
    fireEvent.mouseLeave(opponentTab);
    expect(mainDeckViewer).not.toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).toBeVisible();

    // Hover, click, and unhover the Main Deck Tab, and verify only the Main Deck Viewer is visible.
    fireEvent.mouseEnter(deckTab);
    fireEvent.click(deckTab);
    fireEvent.mouseLeave(deckTab);
    expect(mainDeckViewer).toBeVisible();
    expect(discardViewer).not.toBeVisible();
    expect(opponentViewer).not.toBeVisible();
    expect(trashViewer).not.toBeVisible();
  });

  it("If non-base cards are detected, should display a div with the card name text for each non-base card found", () => {
    // Arrange - Render the Primary frame with a provide, and get the store instance.
    const { store } = renderWithProviders(<PrimaryFrame />);
    act(() => {
      // Simulate a kingdom with non-base card
      DOMObserver.setKingdom(["Vampire", "Fairy"]);
      store.dispatch(setBaseOnly(false));
      store.dispatch(setGameActiveStatus(true));
    });
    const nonBaseDiv1 = screen.getByText("Vampire");
    const nonBaseDiv2 = screen.getByText("Fairy");
    //Verify that elements with the non-base card text are in the document..
    expect(nonBaseDiv1).toBeInTheDocument();
    expect(nonBaseDiv2).toBeInTheDocument();
  });
});
