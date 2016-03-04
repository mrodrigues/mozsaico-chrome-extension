'use strict';

(function IIFE(chrome, DoRequest, ApiRoutes) {
  chrome.runtime.onInstalled.addListener(details => {
    console.log('previousVersion', details.previousVersion);
  });

  let currentTopic;
  let currentUrl;
  let currentRequest;
  function checkCurrentTab() {
    chrome.tabs.query({ currentWindow: true, active: true  }, function fetchCurrentTab(tabs) {
      currentUrl = tabs[0].url;
      currentRequest && currentRequest.abort();
      currentRequest = DoRequest.get(ApiRoutes.topics.find(), { content: currentUrl })
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
      chrome.browserAction.setIcon({ path: 'images/icon-128.png' });
    } else {
      chrome.browserAction.setIcon({ path: 'images/not-saved-yet.png' });
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
