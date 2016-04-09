'use strict';

(function IIFE($, DoRequest, ApiRoutes, ViewRoutes, UserData) {
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
      return groups;
    }

    setTopic(topic) {
      this.topic = topic;
      return topic;
    }
  }

  const state = new State();

  // ===== Render ===== //

  function renderGroups(groups) {
    return $(
             $('<ul>').append(groups.map(renderGroup))
           );
  }

  function renderLink(href, text) {
    return `<a href="${href}" target="_blank">${text}</a>`;
  }

  function renderLinkToGroup(group) {
    return renderLink(ViewRoutes.groups.show(group), group.name);
  }

  function renderLinkToTopic(group, topic) {
    return renderLink(ViewRoutes.topics.show(group, topic), "Página");
  }

  function renderGroup(group) {
    return $('<li>').append(renderChooseGroupButton(group));
  }

  function renderChooseGroupButton(group) {
    return $(`<a>${group.name}</a>`).data('group', group).click(updateGroup);
  }

  function renderCurrentUser(user) {
    return renderLink(ViewRoutes.groups.all(user), "Ir para meu Mozsaico");
  }

  function updateGroup() {
    let group = $(this).data('group');
    let data = { topic: { group_id: group.id } };
    showSpinner();
    DoRequest.patch(ApiRoutes.topics.update(state.topic), data)
      .then(() => state.topic.group = group.id)
      .then(setMessage(`${renderLinkToTopic(group, state.topic)} adicionado ao grupo ${renderLinkToGroup(group)}!`))
      .then(hideSpinner);
  }

  function setMessage(message) {
    return () => $('#message').html(message);
  }

  // ===== Save tab ===== //

  function init() {
    showSpinner();
    $("#user-page").html(renderCurrentUser(UserData.getUser()));
    DoRequest.get(ApiRoutes.groups.all())
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
      let group = state.groups.find((g) => g.id === currentTopic.group.id);
      setMessage(`${renderLinkToTopic(group, currentTopic)} salva no grupo ${renderLinkToGroup(group)}, caso queira alterar selecione abaixo:`)();
      hideSpinner();
    } else {
      DoRequest.post(ApiRoutes.topics.create(), { topic: { content: currentUrl } })
        .then((topic) => state.setTopic(topic))
        .then((topic) => {
          let group = { name: "Outros", id: topic.group.id };
          setMessage(`${renderLinkToTopic(group, topic)} adicionada ao grupo ${renderLinkToGroup(group)}! Caso queira alterar para outro grupo, selecione abaixo:`)();
        })
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

  UserData.whenReady(function initOrLogin() {
    if (UserData.getUser()) {
      init();
    } else {
      window.location.pathname = '/login.html';
    }
  });
})(jQuery, DoRequest, ApiRoutes, ViewRoutes, UserData);
