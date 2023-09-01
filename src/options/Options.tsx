import React, {
  // , useState
} from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import SavedGameViewer from "./components/SavedGameViewer";

const options = () => {
  return (
    <React.Fragment>
      <Provider store={store}>
          <SavedGameViewer />
      </Provider>
    </React.Fragment>
  );
};

export default options;
