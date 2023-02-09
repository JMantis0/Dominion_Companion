import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
// import "../assets/tailwind.css";
import ChromeStorageInterface from "./components/ChromeStorageInterface";
import CurrentGame from "./components/CurrentGame";
import DecklistView from "./components/DecklistView";

const Options = () => {
  useEffect(() => {
    console.log("From the Options component.js");

    return () => {};
  }, []);
  return (
    <div>
      <h1 className="text-4xl text-green-500">Dom View</h1>
      <ul>
        <li>
          <a href="#/">Full List</a>
        </li>
        <li>
          <a href="#/currentGame">Current Game</a>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<DecklistView />} />
        <Route path="/currentGame" element={<CurrentGame />} />
      </Routes>
      <ChromeStorageInterface />
    </div>
  );
};

export default Options;
