'use strict';

(function IIFE(window) {
  const UserData = {
    setUserData: setUserData,
    getUser: getUser,
    getToken: getToken
  };

  window.UserData = UserData;

  function setUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
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
})(window);
