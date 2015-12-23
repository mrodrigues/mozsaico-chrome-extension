'use strict';

(function IIFE($, DoRequest, Routes) {
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
    return $(`<a>${group.name}</a>`).data('group', group).click(updateGroup);
  }

  function updateGroup() {
    let group = $(this).data('group');
    let data = { topic: { group_id: group.id } };
    showSpinner();
    DoRequest.patch(Routes.topics.update(state.topic), data)
      .then(() => state.topic.group_id = group.id)
      .then(setMessage(`Adicionado ao grupo ${group.name}!`))
      .then(hideSpinner);
  }

  function setMessage(message) {
    return () => $('#message').html(message);
  }

  // ===== Save tab ===== //

  function init() {
    showSpinner();
    DoRequest.get(Routes.groups.all())
      .then(state.setGroups.bind(state))
      .then(() => {
        chrome.runtime.sendMessage(
            { method: 'getCurrentTopicAndUrl' },
            saveCurrentUrl
        );
      });
  }

  function saveCurrentUrl({ currentTopic, currentUrl }) {
    if (currentTopic) {
      state.setTopic(currentTopic);
      let group = state.groups.find((g) => g.id === currentTopic.group_id);
      setMessage(`Página está salva no grupo ${group.name}, caso queira alterar selecione abaixo:`)();
      hideSpinner();
    } else {
      DoRequest.post(Routes.topics.create(), { topic: { content: currentUrl } })
        .then((topic) => state.setTopic(topic))
        .then(setMessage('Página adicionada ao grupo Outros! Caso queira alterar para outro grupo, selecione abaixo:'))
        .then(hideSpinner)
        .then(() => {
          chrome.runtime.sendMessage({
            method: 'savedTopic',
            topic: state.topic
          });
        });
    }
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
    init();
  } else {
    window.location.pathname = '/login.html';
  }
})(jQuery, DoRequest, Routes);
