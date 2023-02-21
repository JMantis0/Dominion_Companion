chrome.runtime.onInstalled.addListener(() => {
  console.log("I just installed my chrome extenstion")
})

chrome.bookmarks.onCreated.addListener(() => {
  console.log("Page just got bookmarked")
})

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});




