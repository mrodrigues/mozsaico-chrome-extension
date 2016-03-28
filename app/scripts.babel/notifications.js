'use strict';

(function IIFE($, DoRequest, ApiRoutes, ViewRoutes) {
  const content = $('.content');
  const spinner = $('.spinner');
  const notificationsList = $('.notifications');
  init();

  function init() {
    showSpinner();
    DoRequest
      .get(ApiRoutes.notifications.all())
      .then(setNotifications)
      .then(hideSpinner);
  }

  function setNotifications(notifications) {
    notificationsList.html(notifications.map(renderNotification));
  }

  function renderNotification(notification) {
    let group = { id: notification.notifiable.group_id };
    let topic = { id: notification.notifiable.topic_id };

    return `<li>
             ${renderLinkToUser(notification.author)} mencionou você em um ${renderLinkToTopic(group, topic)}
           </li>`;
  }

  function renderLinkToUser(user) {
    return renderLink(ViewRoutes.groups.all(user), `@${user.username}`);
  }

  function renderLinkToTopic(group, topic) {
    return renderLink(ViewRoutes.topics.show(group, topic), "tópico");
  }

  function renderLink(href, text) {
    return `<a href="${href}" target="_blank">${text}</a>`;
  }

  function hideSpinner() {
    content.show();
    spinner.hide();
  }

  function showSpinner() {
    content.hide();
    spinner.show();
  }
})(jQuery, DoRequest, ApiRoutes, ViewRoutes);
