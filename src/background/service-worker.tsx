chrome.runtime.onMessage.addListener((message) => {
  switch (message.action) {
    case "openOptionsPage":
      openOptionsPage();
      break;
    default:
      break;
  }
});

const openOptionsPage = () => {
  console.log("Opening options from service worker.")
  chrome.runtime.openOptionsPage();
};
