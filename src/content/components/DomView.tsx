import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { HashRouter as Router } from "react-router-dom";
// import "../assets/tailwind.css";
import DataInterface from "../../options/components/DataInterface";
import CurrentGame from "../../options/components/CurrentGame";
import DecklistView from "../../options/components/DecklistView";
import LibraryHover from "./LibraryHover";
import "./content.css"

const DomView = () => {
  useEffect(() => {
    console.log("From the DomView component.js");

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
      <Provider store={store}>
        <LibraryHover />
        <Router>
          <Routes>
            <Route path="/" element={<DecklistView />} />
            <Route path="/currentGame" element={<CurrentGame />} />
          </Routes>
        </Router>
        <DataInterface />
      </Provider>
    </div>
  );
};

export default DomView;
