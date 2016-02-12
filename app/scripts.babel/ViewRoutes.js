'use strict';

(function IIFE(window) {
  const baseURL = 'http://mozsaico.herokuapp.com';

  const ViewRoutes = {
    groups: {
      show: showGroup
    },
    topics: {
      show: showTopic
    }
  };

  window.ViewRoutes = ViewRoutes;

  function showGroup(group) {
    return `${baseURL}/groups/${group.id}/topics`;
  }

  function showTopic(group, topic) {
    return `${showGroup(group)}/${topic.id}`;
  }
})(window);
