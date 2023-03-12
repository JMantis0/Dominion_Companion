import React, { FunctionComponent, useEffect } from "react";
import { Deck } from "../../model/deck";
import {
  areNewLogsToSend,
  getGameLog,
  getUndispatchedLogs,
} from "../contentScriptFunctions";
import { setOpponentDeck, setPlayerDeck } from "../../redux/contentSlice";
import { useDispatch } from "react-redux";
import { ContentProps } from "../DomRoot";
import { OpponentDeck } from "../../model/opponentDeck";

/**
 * Sets up a MutationObserver on the ".game-log" element in the Dominion Client DOM, and
 * invokes the update() method on Deck objects when new logs are collected.
 * @param param0
 * @returns
 */
const LogObserver: FunctionComponent<ContentProps> = ({
  playerName,
  opponentName,
  decks: d,
  gameLog: g,
}) => {
  const dispatch = useDispatch();
  let logsProcessed: string;
  let gameLog: string = g;
  let decks: Map<string, Deck | OpponentDeck> = d;

  /**
   * Mutation observer function for the Mutation Observer to use
   * when observing the ".game-log element" in the Client.
   * Use - When a mutation of time "childList" occurs in the ".game-log" element
   * of the client DOM, this function triggers.
   * Logic ensures that action is only taken if the mutation created added nodes,
   * and only if the last of the added nodes has an innerText value.
   * If the last added node has an innerText value, then another logic checks
   * if there are any new logs using the areNewLogsToSend() function.  If there
   * are new logs, they are obtained with the getUndispatchedLogs() function and
   * the Deck objects' update() methods are invoked using the new logs as an argument,
   * and finally, the global variable 'logsProcessed' is updated.
   * @param mutationList
   */
  const observerFunc: MutationCallback = (mutationList: MutationRecord[]) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        const addedNodes = mutation.addedNodes;
        if (addedNodes.length > 0) {
          const lastAddedNode: HTMLElement = addedNodes[
            addedNodes.length - 1
          ] as HTMLElement;
          const lastAddedNodeText = lastAddedNode.innerText;
          if (lastAddedNodeText.length > 0) {
            if (areNewLogsToSend(logsProcessed, getGameLog())) {
              gameLog = getGameLog();
              const newLogsToDispatch = getUndispatchedLogs(
                logsProcessed,
                gameLog
              )
                .split("\n")
                .slice();
              decks.get(playerName)?.update(newLogsToDispatch);
              dispatch(
                setPlayerDeck(JSON.parse(JSON.stringify(decks.get(playerName))))
              );
              decks.get(opponentName)?.update(newLogsToDispatch);
              dispatch(
                setOpponentDeck(
                  JSON.parse(JSON.stringify(decks.get(opponentName)))
                )
              );
              logsProcessed = gameLog;
            }
          }
        }
      }
    }
  };

  /**
   * After the LogObserver component renders, a MutationObserver object is created, and is
   * set to observe the ".game-log" element from the client DOM, and an ini
   */
  useEffect(() => {
    const mo = new MutationObserver(observerFunc);
    const gameLogElement = document.getElementsByClassName("game-log")[0];
    mo.observe(gameLogElement, {
      childList: true,
      subtree: true,
    });
    const newLogsToDispatch = getUndispatchedLogs(logsProcessed, gameLog) // Initial dispatch
      .split("\n")
      .slice();
    decks.get(playerName)?.update(newLogsToDispatch);
    dispatch(setPlayerDeck(JSON.parse(JSON.stringify(decks.get(playerName)))));
    decks.get(opponentName)?.update(newLogsToDispatch);
    dispatch(
      setOpponentDeck(JSON.parse(JSON.stringify(decks.get(opponentName))))
    );

    logsProcessed = gameLog;
    return () => {
      mo.disconnect();
    };
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          console.log("gameLog", gameLog.split("\n"));
          console.log("logsProcessed", logsProcessed.split("\n"));
          console.log(decks);
        }}
      >
        show gameLog /logsProcessed
      </button>
    </div>
  );
};

export default LogObserver;
