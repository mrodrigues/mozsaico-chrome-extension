'use strict';

window.ApiRoutes = (function IIFE() {
  const ApiRoutes = {
    groups: {
      all: allGroups
    },

    topics: {
      create: createTopic,
      update: updateTopic,
      find: findTopic
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
    return '/api/groups/' + topic.group_id + '/topics/' + topic.id;
  }

  function findTopic() {
    return '/api/topics/find';
  }

  function allNotifications() {
    return '/api/notifications';
  }

  function newNotifications() {
    return `${allNotifications()}/new_notifications`;
  }
})();
