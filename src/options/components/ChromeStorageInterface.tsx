import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPlayerDeck, setOpponentDeck } from "../redux/optionsSlice";
import { RootState } from "../redux/store";
import { StoreDeck } from "../../model/storeDeck";

const ChromeStorageInterface = () => {
  const pDeck: StoreDeck = useSelector(
    (state: RootState) => state.options.playerDeck
  );
  const oDeck: StoreDeck = useSelector(
    (state: RootState) => state.options.opponentDeck
  );
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("Message from Chrome Storage Interface UseEffect");
    chrome.storage.sync.get(["playerDeck", "opponentDeck"]).then((result) => {
      console.log("First render.  Setting initial redux state.")
      //  Next step update state with results
      dispatch(setPlayerDeck(JSON.parse(result.playerDeck)));
      dispatch(setOpponentDeck(JSON.parse(result.opponentDeck)));
    });
    const storageLlistenerFunction = (
      changes: {
        [key: string]: chrome.storage.StorageChange;
      },
      namespace: "sync" | "local" | "managed" | "session"
    ) => {
      for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        // console.log(
        //   `Storage key "${key}" in namespace "${namespace}" changed.`,
        //   `Old value was "${oldValue}", new value is "${newValue}".`
        // );
        console.log("Storage change detected:")
        if (key === "playerDeck") {
          console.log("Dispatching setPlayerDeck");
          dispatch(setPlayerDeck(JSON.parse(newValue)));
        } else if (key === "opponentDeck") {
          console.log("Dispatching setOpponentDeck");
          dispatch(setOpponentDeck(JSON.parse(newValue)));
        }
      }
    };
    chrome.storage.onChanged.addListener(storageLlistenerFunction);
    return function cleanup() {
      chrome.storage.onChanged.removeListener(storageLlistenerFunction);
    };
  }, []);

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
      <button onClick={() => console.log("Testing the redux state: ", pDeck)}>
        Test player deck state
      </button>
      <button onClick={() => console.log("Testing the redux state: ", oDeck)}>
        Test opponent deck state
      </button>
      <button
        onClick={() => {
          // console.log("testing functino turnDeckListIntoMap");
          console.log("pdeck", pDeck);
          console.log(getCountsFromArray(pDeck.entireDeck));
        }}
      >
        Get Decklist Card Counts
      </button>
    </div>
  );
};

export default ChromeStorageInterface;
