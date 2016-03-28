'use strict';

(function IIFE(window, Settings) {
  const baseURL = Settings.baseUrl;

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
})(window, Settings);
