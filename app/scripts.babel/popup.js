'use strict';

(function IIFE($) {
  // ===== Constants ===== //

  const baseURL = 'http://localhost:3000';

  // ===== AJAX Requests ===== //

  const Request = {
    get: buildRequest(baseURL, 'GET'),
    post: buildRequest(baseURL, 'POST'),
    patch: buildRequest(baseURL, 'PATCH')
  };

  function buildRequest(url, method) {
    return (path, params = {}) => sendRequest(url + path, method, params);
  }

  function sendRequest(url, method, params = {}) {
    return $.ajax({
      url: url,
      method: method,
      data: params,
      headers: {
        Authorization: 'bearer ' + localStorage.getItem('access_token')
      }
    });
  }

  // ===== Routes ===== //

  const Routes = {
    groups: {
      all: allGroups
    },
    topics: {
      create: createTopic,
      update: updateTopic
    }
  };

  function allGroups() {
    return '/api/groups';
  }

  function createTopic() {
    return '/api/topics';
  }

  function updateTopic(topic) {
    return '/api/groups/' + topic.group_id + '/topics/' + topic.id;
  }

  // ===== State ===== //

  class State {
    constructor() {
      this.groups = [];
      this.topic = null;
      this.container = $('#groups');
    }

    setGroups(groups) {
      this.groups = groups;
      this.container.html(renderGroups(this.groups));
    }

    setTopic(topic) {
      this.topic = topic;
    }
  }

  const state = new State();

  // ===== Render ===== //

  function renderGroups(groups) {
    return $(
             $('<ul>').append(groups.map(renderGroup))
           );
  }

  function renderGroup(group) {
    return $('<li>').append(renderLink(group));
  }

  function renderLink(group) {
    return $('<a>' + group.name + '</a>').data('group', group).click(updateGroup);
  }

  function updateGroup() {
    let group = $(this).data('group');
    let data = { topic: { group_id: group.id } };
    showSpinner();
    Request.patch(Routes.topics.update(state.topic), data)
      .then(() => state.topic.group_id = group.id)
      .then(setMessage("Adicionado ao grupo " + group.name + "!"))
      .then(hideSpinner);
  }

  function setMessage(message) {
    return () => $('#message').html(message);
  }

  // ===== Save tab ===== //

  function saveCurrentTab (tabs) {
    showSpinner();
    Request.get(Routes.groups.all()).done((groups) => state.setGroups(groups));
    let url = tabs[0].url;
    $('#url').innerHTML = url;
    Request.post(Routes.topics.create(), { topic: { content: url } })
      .then((topic) => state.setTopic(topic))
      .then(setMessage("Página adicionada ao grupo Outros! Caso queira alterar para outro grupo, selecione abaixo:"))
      .then(hideSpinner);
  }

  function hideSpinner() {
    $('.content').show();
    $('.spinner').hide();
  }

  function showSpinner() {
    $('.content').hide();
    $('.spinner').show();
  }

  if (localStorage.getItem('access_token')) {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, saveCurrentTab);
  } else {
    window.location.pathname = '/login.html';
  }
})(jQuery);
