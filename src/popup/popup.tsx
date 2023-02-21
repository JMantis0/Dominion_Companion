import React, { useEffect } from "react";
import "../assets/tailwind.css";


const handleInput = (e: React.BaseSyntheticEvent) => {
  e.preventDefault();
  console.log(e);
  const name: any = e.target[0].value;
  let frog = [];
  frog[0] = "test";
  chrome.storage.sync.set({ name: name }).then(() => {
    console.log("Name is set to " + name);
  });
  chrome.storage.local.set({ name: name }).then(() => {
    console.log("Name is set to " + name);
  });
};

const Popup = () => {
  useEffect(() => {
    chrome.storage.sync.get(["name"]),
      (res: any) => {
        console.log(res.name);
      };
  }, []);
  return (
    <div className="h-screen">
      <form
        onSubmit={handleInput}
        className="flex justify-center items-center py-44"
      >
        <input
          type="text"
          name="name"
          className="bg-gray ring-black px-4 py-4"
          placeholder="Enter a Word"
        />
        <button className="py-4 px-3 bg-indigo-500 text-white m-2">
          Submit
        </button>
        <img src="Bandit.jpg"></img>
      </form>
    </div>
  );
};

export default Popup;
