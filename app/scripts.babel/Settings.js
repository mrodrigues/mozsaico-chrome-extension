'use strict';

window.Settings = (function IIFE() {
  var ENV = "<!-- build:env -->";

  let baseUrl;

  switch (ENV) {
    case 'staging':
      baseUrl= 'http://mozsaico-staging.herokuapp.com';
      break;
    case 'production':
      baseUrl= 'http://www.mozsaico.com';
      break;
    default:
      baseUrl = 'http://localhost:3000';
  }

  const Settings = { baseUrl };

  return Settings;
})();
