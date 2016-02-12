'use strict';

(function IIFE($, window) {
  // ===== Constants ===== //

  const baseURL = 'http://mozsaico.herokuapp.com';

  // ===== AJAX Requests ===== //

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
        Authorization: 'bearer ' + localStorage.getItem('access_token')
      }
    });
  }
})(jQuery, window);
