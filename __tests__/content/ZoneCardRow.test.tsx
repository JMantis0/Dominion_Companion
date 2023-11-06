/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom/jest-globals";
import React from "react";
import { describe, it, expect } from "@jest/globals";
import { renderWithProvidersAndCSS } from "./assets/test-utils";
import { screen } from "@testing-library/react";
import ZoneCardRow, {
  ZoneCardRowProps,
} from "../../src/content/PrimaryFrame/ZoneViewer/ZoneCardRow/ZoneCardRow";

describe("ZoneCardRow", () => {
  it("should render with the correct cardName, amount (unsure how to test color without just testing the class)", () => {
    let props: ZoneCardRowProps = {
      cardName: "Card Name",
      cardAmountInZone: 44,
      color: "text-[#fff5c7]",
    };
    renderWithProvidersAndCSS(<ZoneCardRow {...props} />);
    const cardNameDiv = screen.getByText(props.cardName);
    const cardAmountDiv = screen.getByText(props.cardAmountInZone);
    expect(cardNameDiv).toBeInTheDocument();
    expect(cardAmountDiv).toBeInTheDocument();

  });
});
