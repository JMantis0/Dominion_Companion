import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setPlayerDeck, setOpponentDeck } from "../redux/optionsSlice";

const ChromeStorageInterface = () => {
  const pDeck = useSelector((state: any) => state.options.playerDeck);
  const oDeck = useSelector((state: any) => state.options.opponentDeck);
  const dispatch = useDispatch();

  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      // console.log(
      //   `Storage key "${key}" in namespace "${namespace}" changed.`,
      //   `Old value was "${oldValue}", new value is "${newValue}".`
      // );
      if (key === "playerDeck") {
        console.log("dispatching setPlayerDeck");
        dispatch(setPlayerDeck(newValue));
      } else if (key === "opponentDeck") {
        console.log("dispatching setOpponentDeck");
        dispatch(setOpponentDeck(newValue));
      }
    }
  });

  const getCountsFromArray = (
    decklistArray: Array<string>
  ): Map<string, number> => {
    const cardCountsMap = new Map<string, number>();
    decklistArray.forEach((card) => {
      if (cardCountsMap.has(card)) {
        cardCountsMap.set(card, cardCountsMap.get(card) + 1);
      } else {
        cardCountsMap.set(card, 1);
      }
    });
    return cardCountsMap;
  };

  return (
    <div>
      ChromeStorageInterface
      <button
        onClick={() =>
          console.log("Testing the redux state: ", JSON.parse(pDeck))
        }
      >
        Test player deck state
      </button>
      <button
        onClick={() =>
          console.log("Testing the redux state: ", JSON.parse(oDeck))
        }
      >
        Test opponent deck state
      </button>
      <button
        onClick={() => {
          // console.log("testing functino turnDeckListIntoMap");
          console.log("pdeck", pDeck);
          console.log(getCountsFromArray(JSON.parse(pDeck).entireDeck));
        }}
      >
        Get Decklist Card Counts
      </button>
    </div>
  );
};

export default ChromeStorageInterface;
