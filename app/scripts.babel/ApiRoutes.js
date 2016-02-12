'use strict';

(function IIFE(window) {
  const ApiRoutes = {
    groups: {
      all: allGroups
    },
    topics: {
      create: createTopic,
      update: updateTopic,
      find: findTopic
    }
  };

  window.ApiRoutes = ApiRoutes;

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
})(window);
