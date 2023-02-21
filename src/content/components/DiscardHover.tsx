import React from "react";

const DiscardHover = () => {
  return (
    <div
      onMouseOver={() => console.log("mouseover Discard Area")}
      onMouseLeave={() => console.log("mouse leave discard area")}
      id="discardHoverEl"
    >
      DiscardHover
    </div>
  );
};

export default DiscardHover;
