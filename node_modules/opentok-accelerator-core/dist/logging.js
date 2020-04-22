'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OTKAnalytics = require('opentok-solutions-logging');

// eslint-disable-next-line no-console
var message = function message(messageText) {
  return console.log('otAccCore: ' + messageText);
};

/** Analytics */

var logVariation = {
  attempt: 'Attempt',
  success: 'Success',
  fail: 'Fail'
};

var logAction = {
  // vars for the analytics logs. Internal use
  init: 'Init',
  initPackages: 'InitPackages',
  connect: 'ConnectCoreAcc',
  disconnect: 'DisconnectCoreAcc',
  forceDisconnect: 'ForceDisconnectCoreAcc',
  forceUnpublish: 'ForceUnpublishCoreAcc',
  getAccPack: 'GetAccPack',
  signal: 'SignalCoreAcc',
  startCall: 'StartCallCoreAcc',
  endCall: 'EndCallCoreAcc',
  toggleLocalAudio: 'ToggleLocalAudio',
  toggleLocalVideo: 'ToggleLocalVideo',
  toggleRemoteAudio: 'ToggleRemoteAudio',
  toggleRemoteVideo: 'ToggleRemoteVideo',
  subscribe: 'SubscribeCoreAcc',
  unsubscribe: 'UnsubscribeCoreAcc'
};

var Analytics = function Analytics(source, sessionId, connectionId, apikey, applicationName) {
  _classCallCheck(this, Analytics);

  _initialiseProps.call(this);

  var otkanalyticsData = {
    clientVersion: 'js-vsol-2.0.15', // x.y.z filled by npm build script
    source: source,
    componentId: 'acceleratorCore',
    name: applicationName || 'coreAccelerator',
    partnerId: apikey
  };

  this.analytics = new OTKAnalytics(otkanalyticsData);

  if (connectionId) {
    this.update(sessionId, connectionId, apikey);
  }
};

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  Object.defineProperty(this, 'update', {
    enumerable: true,
    writable: true,
    value: function value(sessionId, connectionId, apiKey) {
      if (sessionId && connectionId && apiKey) {
        var sessionInfo = {
          sessionId: sessionId,
          connectionId: connectionId,
          partnerId: apiKey
        };
        _this.analytics.addSessionInfo(sessionInfo);
      }
    }
  });
  Object.defineProperty(this, 'log', {
    enumerable: true,
    writable: true,
    value: function value(action, variation) {
      _this.analytics.logEvent({ action: action, variation: variation });
    }
  });
};

module.exports = {
  Analytics: Analytics,
  logVariation: logVariation,
  logAction: logAction,
  message: message
};