'use strict';

(function IIFE($, window, UserData, Settings) {
  const baseURL = Settings.baseUrl;

  const DoRequest = {
    get: buildRequest(baseURL, 'GET'),
    post: buildRequest(baseURL, 'POST'),
    patch: buildRequest(baseURL, 'PATCH')
  };

  window.DoRequest = DoRequest;

  function buildRequest(url, method) {
    return (path, params = {}) => sendRequest(url + path, method, params);
  }

  function sendRequest(url, method, params = {}) {
    return $.ajax({
      url: url,
      method: method,
      data: params,
      headers: {
        Authorization: 'bearer ' + UserData.getToken()
      }
    });
  }
})(jQuery, window, UserData, Settings);
