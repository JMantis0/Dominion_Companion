import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPlayerDeck, setOpponentDeck } from "../redux/optionsSlice";
import { RootState } from "../redux/store";
import { StoreDeck } from "../../model/storeDeck";

const DataInterface = () => {
  const pDeck: StoreDeck = useSelector(
    (state: RootState) => state.options.playerDeck
  );
  const oDeck: StoreDeck = useSelector(
    (state: RootState) => state.options.opponentDeck
  );
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Message from Chrome Storage Interface UseEffect");
    // Need an initial to content script on load;

    (async () => {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      const response = await chrome.tabs.sendMessage(tab.id, {
        message: "initLoad",
      });
      console.log(
        `Response from initial deck request on options load: `,
        response
      );
      dispatch(setPlayerDeck(JSON.parse(response.decks.playerDeck)));
      dispatch(setOpponentDeck(JSON.parse(response.decks.opponentDeck)));
    })();

    // Listener for changes is chrome sync.
    // chrome.storage.sync.get(["playerDeck", "opponentDeck"]).then((result) => {
    //   console.log("First render.  Setting initial redux state.");
    //   //  Next step update state with results
    //   dispatch(setPlayerDeck(JSON.parse(result.playerDeck)));
    //   dispatch(setOpponentDeck(JSON.parse(result.opponentDeck)));
    // });
    // const storageLlistenerFunction = (
    //   changes: {
    //     [key: string]: chrome.storage.StorageChange;
    //   },
    //   namespace: "sync" | "local" | "managed" | "session"
    // ) => {
    //   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    //     // console.log(
    //     //   `Storage key "${key}" in namespace "${namespace}" changed.`,
    //     //   `Old value was "${oldValue}", new value is "${newValue}".`
    //     // );
    //     console.log("Storage change detected:");
    //     if (key === "playerDeck") {
    //       console.log("Dispatching setPlayerDeck");
    //       dispatch(setPlayerDeck(JSON.parse(newValue)));
    //     } else if (key === "opponentDeck") {
    //       console.log("Dispatching setOpponentDeck");
    //       dispatch(setOpponentDeck(JSON.parse(newValue)));
    //     }
    //   }
    // };

    // Listener for messages from content script
    const messageListenerFunction = (request, sender, sendResponse) => {
      console.log(
        sender.tab
          ? "from a content script:" + sender.tab.url
          : "from the extension"
      );
      if (request.playerDeck) {
        console.log("setting playerdeck", JSON.parse(request.playerDeck));
        dispatch(setPlayerDeck(JSON.parse(request.playerDeck)));
      } else if (request.opponentDeck) {
        console.log("setting opponentDeck", JSON.parse(request.opponentDeck));
        dispatch(setPlayerDeck(JSON.parse(request.opponentDeck)));
      }
      sendResponse({ message: `deck updated in Redux for ${request}` });
    };
    chrome.runtime.onMessage.addListener(messageListenerFunction);

    // chrome.storage.onChanged.addListener(storageLlistenerFunction);
    return function cleanup() {
      chrome.runtime.onMessage.removeListener(messageListenerFunction);
      // chrome.storage.onChanged.removeListener(storageLlistenerFunction);
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
      DataInterface
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

export default DataInterface;
