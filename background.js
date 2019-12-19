chrome.commands.onCommand.addListener(function(command) {
  if (command == "remove-tabs") {
    chrome.tabs.query({ currentWindow: true }, function(tabs) {
      let set = new Set();
      for (const tab of tabs) {
        if (set.has(tab.url)) {
          chrome.tabs.remove(tab.id);
        } else {
          set.add(tab.url);
        }
      }
    });
  }

  if (command == "sort-tabs") {
    chrome.tabs.query({ currentWindow: true }, function(tabs) {
      let sortedTabs = {};
      let startingIndex = 0;
      for (const tab of tabs) {
        const url = new URL(tab.url);
        if (!sortedTabs[url.origin]) {
          sortedTabs[url.origin] = [];
        }
        if (tab.pinned) {
          startingIndex++;
          continue;
        }
        sortedTabs[url.origin].push(tab);
      }
      let sortedArr = [];
      for (key in sortedTabs) {
        sortedArr.push(...sortedTabs[key]);
      }
      for (tab of sortedArr) {
        chrome.tabs.move(tab.id, { index: ++startingIndex });
      }
    });
  }
});
