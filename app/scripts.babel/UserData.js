'use strict';

window.UserData = (function IIFE(window, $, Settings) {
  const WEBAPP_URL = `${Settings.baseUrl}/assets/extension_access.html`;
  let webapp;
  let readyCallback;

  const UserData = {
    setUserData,
    getUser,
    getToken,
    whenReady
  };

  $(setWebapp);

  return UserData;

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
    let data = localStorage.getItem('userData');
    return data !== "undefined" && JSON.parse(data) || {};
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
      if (e.data.success) {
        let data = e.data.currentUser;
        let user = data !== "undefined" && JSON.parse(data);
        user && setUserData(user);
        window.onmessage = undefined;
        resolveReady();
      } else {
        console.error(e.data.message);
      }
    }

    webapp.postMessage(JSON.stringify({method: 'getCurrentUser'}), "*");
  }
})(window, jQuery, Settings);
