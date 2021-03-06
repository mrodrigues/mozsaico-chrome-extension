'use strict';

window.ApiRoutes = (function IIFE() {
  const ApiRoutes = {
    groups: {
      all: allGroups
    },

    topics: {
      create: createTopic,
      update: updateTopic,
      find: findTopic,
      suggest: suggestTopic
    },

    notifications: {
      all: allNotifications,
      newNotifications: newNotifications
    }
  };

  return ApiRoutes;

  function allGroups() {
    return '/api/groups';
  }

  function createTopic() {
    return '/api/topics';
  }

  function updateTopic(topic) {
    return '/api/groups/' + topic.group.id + '/topics/' + topic.id;
  }

  function findTopic() {
    return '/api/topics/find';
  }

  function suggestTopic() {
    return '/api/topics/suggest';
  }

  function allNotifications() {
    return '/api/notifications';
  }

  function newNotifications() {
    return `${allNotifications()}/new_notifications`;
  }
})();
