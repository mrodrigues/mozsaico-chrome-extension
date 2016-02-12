'use strict';

(function IIFE(chrome, DoRequest, ApiRoutes) {
  chrome.runtime.onInstalled.addListener(details => {
    console.log('previousVersion', details.previousVersion);
  });

  let currentTopic = null;
  let currentUrl = null;
  function checkCurrentTab() {
    chrome.tabs.query({ currentWindow: true, active: true  }, function fetchCurrentTab(tabs) {
      currentUrl = tabs[0].url;
      DoRequest.get(ApiRoutes.topics.find(), { content: currentUrl })
        .done(setTopic)
        .fail(unsetTopic)
        .always(updateIcon);
    });
  }

  function setTopic(topic) {
    currentTopic = topic;
  }

  function unsetTopic() {
    currentTopic = null;
  }

  function updateIcon() {
    if (currentTopic !== null) {
      chrome.browserAction.setBadgeText({text: 'Saved'});
    } else {
      chrome.browserAction.setBadgeText({text: 'New'});
    }
  }

  chrome.tabs.onUpdated.addListener(checkCurrentTab);
  chrome.tabs.onActivated.addListener(checkCurrentTab);

  chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    switch (message.method) {
      case 'getCurrentTopicAndUrl':
        sendResponse({ currentTopic, currentUrl });
        break;
      case 'savedTopic':
        currentTopic = message.topic;
        updateIcon();
        break;
    }
  });
})(chrome, DoRequest, ApiRoutes);
