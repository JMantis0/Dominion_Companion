import React from "react";
import "./content.css";
const LibraryHover = () => {
  return (
    <div
      onMouseOver={() => console.log("mouseover library area")}
      onMouseLeave={() => console.log("mouse leave library area")}
      id="libHoverEl"
    >
      LibraryHover
    </div>
  );
};

export default LibraryHover;
