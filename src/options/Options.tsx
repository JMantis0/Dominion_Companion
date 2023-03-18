import React, {
  useEffect,
  // , useState
} from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import SavedGameViewer from "./components/SavedGameViewer";

const options = () => {
  // const [chromeStorage, setChromeStorage] = useState();
  useEffect(() => {
    console.log("HELLO?");
    chrome.storage.local.get(null, (items: any) => {
      console.log("all items are coming in:");

      console.log(items);
      console.log(items);
      console.log(items);
      console.log("HUH");
    });
  }, []);
  return (
    <React.Fragment>
      <Provider store={store}>
          <SavedGameViewer />
      </Provider>
    </React.Fragment>
  );
};

export default options;
