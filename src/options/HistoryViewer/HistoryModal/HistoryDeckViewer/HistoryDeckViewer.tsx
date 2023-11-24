import React, { useState, useEffect, FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import {
  getCountsFromArray,
  combineDeckListMapAndZoneListMap,
  splitCombinedMapsByCardTypes,
  createEmptySplitMapsObject,
  sortHistoryDeckView,
  getRowColor,
} from "../../../../utils/utils";
import NameAndResult from "./NameAndResult/NameAndResult";
import ZoneCardRow from "../../../../content/PrimaryFrame/ZoneViewer/ZoneCardRow/ZoneCardRow";
import type {
  SplitMaps,
  StoreDeck,
  OpponentStoreDeck,
} from "../../../../utils";

type HistoryDeckViewerProps = {
  deck: StoreDeck | OpponentStoreDeck;
};

const HistoryDeckViewer: FunctionComponent<HistoryDeckViewerProps> = ({
  deck,
}) => {
  const [splitMaps, setSplitMaps] = useState<SplitMaps>(
    createEmptySplitMapsObject()
  );
  const sortButtonState = useSelector(
    (state: RootState) => state.options.sortButtonState
  );
  useEffect(() => {
    const unsortedSplitMap = splitCombinedMapsByCardTypes(
      combineDeckListMapAndZoneListMap(
        getCountsFromArray(deck.entireDeck),
        getCountsFromArray(deck.entireDeck)
      )
    );
    const sortedActions = sortHistoryDeckView(
      sortButtonState.category,
      unsortedSplitMap.actions!,
      sortButtonState.sort
    );
    const sortedTreasures = sortHistoryDeckView(
      sortButtonState.category,
      unsortedSplitMap.treasures!,
      sortButtonState.sort
    );
    const sortedVictories = sortHistoryDeckView(
      sortButtonState.category,
      unsortedSplitMap.victories!,
      sortButtonState.sort
    );
    const sortedCurses = sortHistoryDeckView(
      sortButtonState.category,
      unsortedSplitMap.curses!,
      sortButtonState.sort
    );
    setSplitMaps({
      treasures: sortedTreasures,
      victories: sortedVictories,
      actions: sortedActions,
      curses: sortedCurses,
    });
  }, [deck]);

  return (
    <React.Fragment>
      <NameAndResult
        playerName={deck.playerName}
        gameResult={deck.gameResult}
        deck={deck}
      />
      <div>with {deck.currentVP} victory points</div>
      <div> Turns: {deck.gameTurn}</div>
      {deck.ratedGame ? (
        <div>Rating: {deck.rating}</div>
      ) : (
        <div>Unrated Game</div>
      )}
      <div>Deck List</div>
      <div className="outer-shell w-[200px] h-[322px] overflow-hidden border-8 border-double border-gray-300 box-border">
        {/* Victory section */}
        <div className="col-span-12 text-white">Victories</div>
        {Array.from(splitMaps?.victories!.keys()).map((card, idx) => {
          return (
            <ZoneCardRow
              key={idx}
              cardName={card}
              cardAmountInZone={
                splitMaps.victories!.get(card)!.entireDeckCount
              }
              color={getRowColor(card)}
            />
          );
        })}
        {Array.from(splitMaps?.curses!.keys()).map((card, idx) => {
          return (
            <ZoneCardRow
              key={idx}
              cardName={card}
              cardAmountInZone={splitMaps.curses!.get(card)!.entireDeckCount}
              color={getRowColor(card)}
            />
          );
        })}
        {/* Treasure Section */}
        <div className="col-span-12 text-white">Treasures</div>
        {Array.from(splitMaps.treasures!.keys()).map((card, idx) => {
          return (
            <ZoneCardRow
              key={idx}
              cardName={card}
              cardAmountInZone={
                splitMaps.treasures!.get(card)!.entireDeckCount
              }
              color={getRowColor(card)}
            />
          );
        })}
        {/* Action section */}
        <div className="col-span-12 text-white">Actions</div>
        {Array.from(splitMaps?.actions!.keys()).map((card, idx) => {
          return (
            <ZoneCardRow
              key={idx}
              cardName={card}
              cardAmountInZone={splitMaps.actions!.get(card)!.entireDeckCount}
              color={getRowColor(card)}
            />
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default HistoryDeckViewer;
