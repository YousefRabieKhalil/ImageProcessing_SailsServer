module.exports = {


  friendlyName: 'Get base url',


  description: 'return the website base url',


  inputs: {

  },


  exits: {

    success: {
      outputFriendlyName: 'Base url',
      outputType: 'ref'
    },

  },


  fn: async function (inputs, exits) {

    // Get base url.
    var baseUrl;
    // TODO
    baseUrl = getBaseurl();
    // Send back the result through the success exit.
    return exits.success(baseUrl);

  }
};
function getBaseurl() {
  var usingSSL = sails.config.ssl && sails.config.ssl.key && sails.config.ssl.cert;
  var port = sails.config.proxyPort || sails.config.port;
  var localAppURL =
    (usingSSL ? 'https' : 'http') + '://' +
    (getHost() || 'localhost') +
    (port == 80 || port == 443 ? '' : ':' + port);

  return localAppURL;
};
function getHost() {
  var hasExplicitHost = sails.config.hooks.http && sails.config.explicitHost;
  var host = sails.config.proxyHost || hasExplicitHost || sails.config.host;
  return host;
};