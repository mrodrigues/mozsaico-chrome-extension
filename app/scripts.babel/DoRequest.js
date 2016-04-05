'use strict';

window.DoRequest = (function IIFE($, UserData, Settings) {
  const baseURL = Settings.baseUrl;

  const DoRequest = {
    get: buildRequest(baseURL, 'GET'),
    post: buildRequest(baseURL, 'POST'),
    patch: buildRequest(baseURL, 'PATCH')
  };

  return DoRequest;

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
})(jQuery, UserData, Settings);
