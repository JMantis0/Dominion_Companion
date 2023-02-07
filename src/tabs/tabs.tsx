import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../tabs/components/Home";
import About from "../tabs/components/About";
import "./tabs.css";

const Tabs = () => {
  return (
    <div>
      <ul>
        <li>
          <a href="#/">Home</a>
        </li>
        <li>
          <a href="#/about">About</a>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" index element={<About />} />
      </Routes>
    </div>
  );
};

export default Tabs;
