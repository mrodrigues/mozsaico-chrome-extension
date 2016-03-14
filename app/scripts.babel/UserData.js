'use strict';

(function IIFE(window, $, Settings) {
  const WEBAPP_URL = `${Settings.baseUrl}/assets/extension_access.html`;
  let webapp;
  let readyCallback;

  const UserData = {
    setUserData,
    getUser,
    getToken,
    whenReady
  };

  window.UserData = UserData;

  $(setWebapp);

  function setUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
    webapp.postMessage(JSON.stringify({
      method: 'setCurrentUser',
      currentUser: userData
    }), "*");
  }

  function getUser() {
    return getUserData().user;
  }

  function getToken() {
    return getUserData().token;
  }

  function getUserData() {
    return JSON.parse(localStorage.getItem('userData')) || {};
  }

  function whenReady(_readyCallback_) {
    readyCallback = _readyCallback_;
  }

  function resolveReady() {
    readyCallback && readyCallback();
  }

  function setWebapp(){
    let iframe = $(`<iframe src="${WEBAPP_URL}" style="display: none;"></iframe>`).appendTo($('body'));
    webapp = iframe[0].contentWindow;

    if (!getUser()) {
      $(iframe).load(fetchUserDataFromWebapp);
    } else {
      resolveReady();
    }
  }

  function fetchUserDataFromWebapp(){
    window.onmessage = function extractAndSetUserData(e) {
      let user = JSON.parse(e.data);
      user && setUserData(user);
      window.onmessage = undefined;
      resolveReady();
    }

    webapp.postMessage(JSON.stringify({method: 'getCurrentUser'}), "*");
  }
})(window, jQuery, Settings);
