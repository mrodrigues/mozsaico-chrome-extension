'use strict';

(function IIFE(window) {
  const baseURL = 'http://mozsaico.herokuapp.com';

  const ViewRoutes = {
    groups: {
      show: showGroup,
      all: allGroupsForUser
    },
    topics: {
      show: showTopic
    }
  };

  window.ViewRoutes = ViewRoutes;

  function showGroup(group) {
    return `${baseURL}/groups/${group.id}/topics`;
  }

  function allGroupsForUser(user) {
    return `${baseURL}/@${user.username}/groups`;
  }

  function showTopic(group, topic) {
    return `${showGroup(group)}/${topic.id}`;
  }
})(window);
