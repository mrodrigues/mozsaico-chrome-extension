'use strict';

(function IIFE(chrome, DoRequest, ApiRoutes, ViewRoutes, TimeSinkTimer, localStorage) {
  chrome.runtime.onInstalled.addListener(details => {
    console.log('previousVersion', details.previousVersion);
  });

  let currentTopic;
  let currentUrl;
  let currentRequest;

  let timer = new TimeSinkTimer();
  timer.onTimeDepleted(
    () => fetchSuggestion('Que tal aproveitar seu tempo livre para ler algo?')
  );

  function checkCurrentTab() {
    chrome.tabs.query({ currentWindow: true, active: true  }, function fetchCurrentTab(tabs) {
      if (tabs.length) {
        currentUrl = tabs[0].url;
        findTopic(currentUrl);
        timer.checkTimeSink(currentUrl);
      }
    });
  }

  function findTopic(currentUrl) {
    currentRequest && currentRequest.abort();
    currentRequest = DoRequest.get(
      ApiRoutes.topics.find(),
      { url: currentUrl }
    ).done(setTopic)
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
      chrome.browserAction.setIcon({ path: 'images/icon-128.png' });
    } else {
      chrome.browserAction.setIcon({ path: 'images/not-saved-yet.png' });
    }
  }

  /** Check notifications **/

  function checkNewNotifications() {
    DoRequest.get(ApiRoutes.notifications.newNotifications()).then(setNewNotificationsCount);
  }

  function setNewNotificationsCount(response) {
    var newNotificationsCount = response.new_notifications_count;

    chrome.browserAction.setBadgeText({
      text: newNotificationsCount > 0 ? newNotificationsCount.toString() : ''
    });
  }

  chrome.tabs.onUpdated.addListener(checkCurrentTab);
  chrome.tabs.onActivated.addListener(checkCurrentTab);
  setInterval(checkNewNotifications, 5000);

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

  /** Show topic suggestion **/

  let suggestedTopic;

  chrome.notifications.onClicked.addListener(function(notificationId) {
    if (notificationId == 'suggestedTopic') {
      chrome.tabs.create({
        url: ViewRoutes.topics.show(suggestedTopic.group, suggestedTopic)
      });
    }
  })

  function fetchSuggestion(title) {
    return DoRequest.get(
      ApiRoutes.topics.suggest(),
      { reading_time: 'short' }
    ).then(setSuggestedTopic(title));
  }

  function setSuggestedTopic(title) {
    return (topic) => {
      suggestedTopic = topic;
      chrome.notifications.create('suggestedTopic', {
        type: 'basic',
        title: title,
        message: `${topic.title}. Tempo estimado de leitura: ${(topic.reading_time_in_seconds / 60).toFixed()} minutos.`,
        iconUrl: 'images/icon-128.png'
      });
    };
  }

  /** Tip for date **/

  let today = new Date().toDateString();
  if (!getTipsForDates()[today]) {
    fetchSuggestion('Que tal começar o dia com uma boa leitura?')
      .then(() => assignTipForDate(today));
  }

  function getTipsForDates() {
    let tipsForDates = localStorage.getItem('tipsForDates');
    if (!tipsForDates) {
      tipsForDates = JSON.stringify({});
      localStorage.setItem('tipsForDates', tipsForDates);
    }
    return JSON.parse(tipsForDates);
  }

  function assignTipForDate(date) {
    let updatedTipsForDates = getTipsForDates();
    updatedTipsForDates[date] = true;
    localStorage.setItem('tipsForDates', JSON.stringify(updatedTipsForDates));
  }
})(chrome, DoRequest, ApiRoutes, ViewRoutes, TimeSinkTimer, localStorage);
