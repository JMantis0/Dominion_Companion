import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
// import "../assets/tailwind.css";
import ChromeStorageInterface from "./components/ChromeStorageInterface";
import Home from "./components/Home";
import DeckFrame from "./components/DeckFrame";

const Options = () => {
  useEffect(() => {
    console.log("From the Options component.js");

    return () => {};
  }, []);
  return (
    <div>
      <h1 className="text-4xl text-green-500">Options</h1>
      <ul>
        <li>
          <a href="#/">Home</a>
        </li>
        <li>
          <a href="#/chromeStorage">Chrome Storage</a>
        </li>
        <li>
          <a href="#/deckFrame">Deck Frame</a>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chromeStorage" element={<ChromeStorageInterface />} />
        <Route path="/deckFrame" element={<DeckFrame />} />
      </Routes>
    </div>
  );
};

export default Options;
