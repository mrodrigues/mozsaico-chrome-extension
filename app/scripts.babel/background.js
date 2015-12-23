'use strict';

(function IIFE(chrome, DoRequest, Routes) {
  chrome.runtime.onInstalled.addListener(details => {
    console.log('previousVersion', details.previousVersion);
  });

  let currentTopic = null;
  let currentUrl = null;
  function checkCurrentTab(tab) {
    currentUrl = tab.url;
    DoRequest.get(Routes.topics.find(), { content: tab.url })
      .done(setTopic)
      .fail(unsetTopic)
      .always(updateIcon);
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

  function onUpdated(tabId, changeInfo, tab) {
    checkCurrentTab(tab);
  }

  function onActivated(activeInfo) {
    chrome.tabs.get(activeInfo.tabId, checkCurrentTab);
  }

  chrome.tabs.onUpdated.addListener(onUpdated);
  chrome.tabs.onActivated.addListener(onActivated);

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
})(chrome, DoRequest, Routes);
