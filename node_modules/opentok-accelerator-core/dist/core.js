'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global OT */
/**
 * Dependencies
 */
var util = require('./util');
var State = require('./state').default;
var accPackEvents = require('./events');
var Communication = require('./communication').default;
var OpenTokSDK = require('./sdk-wrapper/sdkWrapper');

var _require = require('./errors'),
    CoreError = _require.CoreError;

var _require2 = require('./logging'),
    message = _require2.message,
    Analytics = _require2.Analytics,
    logAction = _require2.logAction,
    logVariation = _require2.logVariation;

/**
 * Helper methods
 */


var dom = util.dom,
    path = util.path,
    pathOr = util.pathOr,
    properCase = util.properCase;

/**
 * Ensure that we have the required credentials
 * @param {Object} credentials
 * @param {String} credentials.apiKey
 * @param {String} credentials.sessionId
 * @param {String} credentials.token
 */

var validateCredentials = function validateCredentials() {
  var credentials = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var required = ['apiKey', 'sessionId', 'token'];
  required.forEach(function (credential) {
    if (!credentials[credential]) {
      throw new CoreError(credential + ' is a required credential', 'invalidParameters');
    }
  });
};

var AccCore = function AccCore(options) {
  _classCallCheck(this, AccCore);

  _initialiseProps.call(this);

  // Options/credentials validation
  if (!options) {
    throw new CoreError('Missing options required for initialization', 'invalidParameters');
  }
  var credentials = options.credentials;

  validateCredentials(options.credentials);
  this.name = options.name;

  // Init analytics
  this.applicationName = options.applicationName;
  this.analytics = new Analytics(window.location.origin, credentials.sessionId, null, credentials.apiKey);
  this.analytics.log(logAction.init, logVariation.attempt);

  // Create session, setup state
  var sessionProps = options.largeScale ? { connectionEventsSuppressed: true } : undefined;
  this.session = OT.initSession(credentials.apiKey, credentials.sessionId, sessionProps);
  this.internalState = new State();
  this.internalState.setSession(this.session);
  this.internalState.setCredentials(credentials);
  this.internalState.setOptions(options);

  // Individual accelerator packs
  this.communication = null;
  this.textChat = null;
  this.screenSharing = null;
  this.annotation = null;
  this.archiving = null;

  // Create internal event listeners
  this.createEventListeners(this.session, options);

  this.analytics.log(logAction.init, logVariation.success);
}

// OpenTok SDK Wrapper


// Expose utility methods


/**
 * Get access to an accelerator pack
 * @param {String} packageName - textChat, screenSharing, annotation, or archiving
 * @returns {Object} The instance of the accelerator pack
 */


/** Eventing */

/**
 * Register events that can be listened to be other components/modules
 * @param {array | string} events - A list of event names. A single event may
 * also be passed as a string.
 */


/**
 * Register a callback for a specific event or pass an object with
 * with event => callback key/value pairs to register listeners for
 * multiple events.
 * @param {String | Object} event - The name of the event
 * @param {Function} callback
 */


/**
 * Remove a callback for a specific event.  If no parameters are passed,
 * all event listeners will be removed.
 * @param {String} event - The name of the event
 * @param {Function} callback
 */


/**
 * Trigger an event and fire all registered callbacks
 * @param {String} event - The name of the event
 * @param {*} data - Data to be passed to callback functions
 */


/**
 * Get the current OpenTok session object
 * @returns {Object}
 */


/**
 * Returns the current OpenTok session credentials
 * @returns {Object}
 */


/**
 * Returns the options used for initialization
 * @returns {Object}
 */


/**
 * Connect to the session
 * @returns {Promise} <resolve: -, reject: Error>
 */


/**
 * Disconnect from the session
 * @returns {Promise} <resolve: -, reject: Error>
 */


/**
 * Force a remote connection to leave the session
 * @param {Object} connection
 * @returns {Promise} <resolve: empty, reject: Error>
 */


/**
 * Start publishing video and subscribing to streams
 * @param {Object} publisherProps - https://goo.gl/0mL0Eo
 * @returns {Promise} <resolve: State + Publisher, reject: Error>
 */


/**
 * Stop all publishing un unsubscribe from all streams
 * @returns {void}
 */


/**
 * Start publishing video and subscribing to streams
 * @returns {Object} The internal state of the core session
 */


/**
 * Manually subscribe to a stream
 * @param {Object} stream - An OpenTok stream
 * @param {Object} [subscriberProperties] - https://tokbox.com/developer/sdks/js/reference/Session.html#subscribe
 * @param {Boolean} [networkTest] - Subscribing to our own publisher as part of a network test?
 * @returns {Promise} <resolve: Subscriber, reject: Error>
 */


/**
 * Manually unsubscribe from a stream
 * @param {Object} subscriber - An OpenTok subscriber object
 * @returns {Promise} <resolve: void, reject: Error>
 */


/**
 * Force the publisher of a stream to stop publishing the stream
 * @param {Object} stream
 * @returns {Promise} <resolve: empty, reject: Error>
 */


/**
 * Get the local publisher object for a stream
 * @param {Object} stream - An OpenTok stream object
 * @returns {Object} - The publisher object
 */


/**
 * Get the local subscriber objects for a stream
 * @param {Object} stream - An OpenTok stream object
 * @returns {Array} - An array of subscriber object
 */


/**
 * Send a signal using the OpenTok signaling apiKey
 * @param {String} type
 * @param {*} [data]
 * @param {Object} [to] - An OpenTok connection object
 * @returns {Promise} <resolve: empty, reject: Error>
 */


/**
 * Enable or disable local audio
 * @param {Boolean} enable
 */


/**
 * Enable or disable local video
 * @param {Boolean} enable
 */


/**
 * Enable or disable remote audio
 * @param {String} id - Subscriber id
 * @param {Boolean} enable
 */


/**
 * Enable or disable remote video
 * @param {String} id - Subscriber id
 * @param {Boolean} enable
 */
;

Object.defineProperty(AccCore, 'OpenTokSDK', {
  enumerable: true,
  writable: true,
  value: OpenTokSDK
});
Object.defineProperty(AccCore, 'util', {
  enumerable: true,
  writable: true,
  value: util
});

var _initialiseProps = function _initialiseProps() {
  var _this = this;

  Object.defineProperty(this, 'getAccPack', {
    enumerable: true,
    writable: true,
    value: function value(packageName) {
      var analytics = _this.analytics,
          textChat = _this.textChat,
          screenSharing = _this.screenSharing,
          annotation = _this.annotation,
          archiving = _this.archiving;

      analytics.log(logAction.getAccPack, logVariation.attempt);
      var packages = {
        textChat: textChat,
        screenSharing: screenSharing,
        annotation: annotation,
        archiving: archiving
      };
      analytics.log(logAction.getAccPack, logVariation.success);
      return packages[packageName];
    }
  });
  Object.defineProperty(this, 'registerEvents', {
    enumerable: true,
    writable: true,
    value: function value(events) {
      var eventListeners = _this.eventListeners;

      var eventList = Array.isArray(events) ? events : [events];
      eventList.forEach(function (event) {
        if (!eventListeners[event]) {
          eventListeners[event] = new Set();
        }
      });
    }
  });
  Object.defineProperty(this, 'on', {
    enumerable: true,
    writable: true,
    value: function value(event, callback) {
      var eventListeners = _this.eventListeners,
          on = _this.on;
      // analytics.log(logAction.on, logVariation.attempt);

      if ((typeof event === 'undefined' ? 'undefined' : _typeof(event)) === 'object') {
        Object.keys(event).forEach(function (eventName) {
          on(eventName, event[eventName]);
        });
        return;
      }
      var eventCallbacks = eventListeners[event];
      if (!eventCallbacks) {
        message(event + ' is not a registered event.');
        // analytics.log(logAction.on, logVariation.fail);
      } else {
        eventCallbacks.add(callback);
        // analytics.log(logAction.on, logVariation.success);
      }
    }
  });
  Object.defineProperty(this, 'off', {
    enumerable: true,
    writable: true,
    value: function value(event, callback) {
      var eventListeners = _this.eventListeners;
      // analytics.log(logAction.off, logVariation.attempt);

      if (!event && !callback) {
        Object.keys(eventListeners).forEach(function (eventType) {
          eventListeners[eventType].clear();
        });
      } else {
        var eventCallbacks = eventListeners[event];
        if (!eventCallbacks) {
          // analytics.log(logAction.off, logVariation.fail);
          message(event + ' is not a registered event.');
        } else {
          eventCallbacks.delete(callback);
          // analytics.log(logAction.off, logVariation.success);
        }
      }
    }
  });
  Object.defineProperty(this, 'triggerEvent', {
    enumerable: true,
    writable: true,
    value: function value(event, data) {
      var eventListeners = _this.eventListeners,
          registerEvents = _this.registerEvents;

      var eventCallbacks = eventListeners[event];
      if (!eventCallbacks) {
        registerEvents(event);
        message(event + ' has been registered as a new event.');
      } else {
        eventCallbacks.forEach(function (callback) {
          return callback(data, event);
        });
      }
    }
  });
  Object.defineProperty(this, 'getSession', {
    enumerable: true,
    writable: true,
    value: function value() {
      return _this.internalState.getSession();
    }
  });
  Object.defineProperty(this, 'getCredentials', {
    enumerable: true,
    writable: true,
    value: function value() {
      return _this.internalState.getCredentials();
    }
  });
  Object.defineProperty(this, 'getOptions', {
    enumerable: true,
    writable: true,
    value: function value() {
      return _this.internalState.getOptions();
    }
  });
  Object.defineProperty(this, 'createEventListeners', {
    enumerable: true,
    writable: true,
    value: function value(session, options) {
      _this.eventListeners = {};
      var registerEvents = _this.registerEvents,
          internalState = _this.internalState,
          triggerEvent = _this.triggerEvent,
          on = _this.on,
          getSession = _this.getSession;

      Object.keys(accPackEvents).forEach(function (type) {
        return registerEvents(accPackEvents[type]);
      });

      /**
       * If using screen sharing + annotation in an external window, the screen sharing
       * package will take care of calling annotation.start() and annotation.linkCanvas()
       */
      var usingAnnotation = path('screenSharing.annotation', options);
      var internalAnnotation = usingAnnotation && !path('screenSharing.externalWindow', options);

      /**
       * Wrap session events and update internalState when streams are created
       * or destroyed
       */
      accPackEvents.session.forEach(function (eventName) {
        session.on(eventName, function (event) {
          if (eventName === 'streamCreated') {
            internalState.addStream(event.stream);
          }
          if (eventName === 'streamDestroyed') {
            internalState.removeStream(event.stream);
          }
          triggerEvent(eventName, event);
        });
      });

      if (usingAnnotation) {
        on('subscribeToScreen', function (_ref) {
          var subscriber = _ref.subscriber;

          _this.annotation.start(getSession()).then(function () {
            var absoluteParent = dom.query(path('annotation.absoluteParent.subscriber', options));
            var linkOptions = absoluteParent ? { absoluteParent: absoluteParent } : null;
            _this.annotation.linkCanvas(subscriber, subscriber.element.parentElement, linkOptions);
          });
        });

        on('unsubscribeFromScreen', function () {
          _this.annotation.end();
        });
      }

      on('startScreenSharing', function (publisher) {
        internalState.addPublisher('screen', publisher);
        triggerEvent('startScreenShare', Object.assign({}, { publisher: publisher }, internalState.getPubSub()));
        if (internalAnnotation) {
          _this.annotation.start(getSession()).then(function () {
            var absoluteParent = dom.query(path('annotation.absoluteParent.publisher', options));
            var linkOptions = absoluteParent ? { absoluteParent: absoluteParent } : null;
            _this.annotation.linkCanvas(publisher, publisher.element.parentElement, linkOptions);
          });
        }
      });

      on('endScreenSharing', function (publisher) {
        // delete publishers.screen[publisher.id];
        internalState.removePublisher('screen', publisher);
        triggerEvent('endScreenShare', internalState.getPubSub());
        if (usingAnnotation) {
          _this.annotation.end();
        }
      });
    }
  });
  Object.defineProperty(this, 'setupExternalAnnotation', {
    enumerable: true,
    writable: true,
    value: function value() {
      return _this.annotation.start(_this.getSession(), { screensharing: true });
    }
  });
  Object.defineProperty(this, 'linkAnnotation', {
    enumerable: true,
    writable: true,
    value: function value(pubSub, annotationContainer, externalWindow) {
      var annotation = _this.annotation,
          internalState = _this.internalState;

      annotation.linkCanvas(pubSub, annotationContainer, {
        externalWindow: externalWindow
      });

      if (externalWindow) {
        // Add subscribers to the external window
        var streams = internalState.getStreams();
        var cameraStreams = Object.keys(streams).reduce(function (acc, streamId) {
          var stream = streams[streamId];
          return stream.videoType === 'camera' || stream.videoType === 'sip' ? acc.concat(stream) : acc;
        }, []);
        cameraStreams.forEach(annotation.addSubscriberToExternalWindow);
      }
    }
  });
  Object.defineProperty(this, 'initPackages', {
    enumerable: true,
    writable: true,
    value: function value() {
      var analytics = _this.analytics,
          getSession = _this.getSession,
          getOptions = _this.getOptions,
          internalState = _this.internalState;
      var on = _this.on,
          registerEvents = _this.registerEvents,
          setupExternalAnnotation = _this.setupExternalAnnotation,
          triggerEvent = _this.triggerEvent,
          linkAnnotation = _this.linkAnnotation;

      analytics.log(logAction.initPackages, logVariation.attempt);
      var session = getSession();
      var options = getOptions();
      /**
       * Try to require a package.  If 'require' is unavailable, look for
       * the package in global scope.  A switch ttatement is used because
       * webpack and Browserify aren't able to resolve require statements
       * that use variable names.
       * @param {String} packageName - The name of the npm package
       * @param {String} globalName - The name of the package if exposed on global/window
       * @returns {Object}
       */
      var optionalRequire = function optionalRequire(packageName, globalName) {
        var result = void 0;
        /* eslint-disable global-require, import/no-extraneous-dependencies, import/no-unresolved */
        try {
          switch (packageName) {
            case 'opentok-text-chat':
              result = require('opentok-text-chat');
              break;
            case 'opentok-screen-sharing':
              result = require('opentok-screen-sharing');
              break;
            case 'opentok-annotation':
              result = require('opentok-annotation');
              break;
            case 'opentok-archiving':
              result = require('opentok-archiving');
              break;
            default:
              break;
          }
          /* eslint-enable global-require */
        } catch (error) {
          result = window[globalName];
        }
        if (!result) {
          analytics.log(logAction.initPackages, logVariation.fail);
          throw new CoreError('Could not load ' + packageName, 'missingDependency');
        }
        return result;
      };

      var availablePackages = {
        textChat: function textChat() {
          return optionalRequire('opentok-text-chat', 'TextChatAccPack');
        },
        screenSharing: function screenSharing() {
          return optionalRequire('opentok-screen-sharing', 'ScreenSharingAccPack');
        },
        annotation: function annotation() {
          return optionalRequire('opentok-annotation', 'AnnotationAccPack');
        },
        archiving: function archiving() {
          return optionalRequire('opentok-archiving', 'ArchivingAccPack');
        }
      };

      var packages = {};
      (path('packages', options) || []).forEach(function (acceleratorPack) {
        if (availablePackages[acceleratorPack]) {
          // eslint-disable-next-line no-param-reassign
          packages[properCase(acceleratorPack)] = availablePackages[acceleratorPack]();
        } else {
          message(acceleratorPack + ' is not a valid accelerator pack');
        }
      });

      /**
       * Get containers for streams, controls, and the chat widget
       */
      var getDefaultContainer = function getDefaultContainer(pubSub) {
        return document.getElementById(pubSub + 'Container');
      };
      var getContainerElements = function getContainerElements() {
        // Need to use path to check for null values
        var controls = pathOr('#videoControls', 'controlsContainer', options);
        var chat = pathOr('#chat', 'textChat.container', options);
        var stream = pathOr(getDefaultContainer, 'streamContainers', options);
        return { stream: stream, controls: controls, chat: chat };
      };
      /** *** *** *** *** */

      /**
       * Return options for the specified package
       * @param {String} packageName
       * @returns {Object}
       */
      var packageOptions = function packageOptions(packageName) {
        /**
         * Methods to expose to accelerator packs
         */
        var accPack = {
          registerEventListener: on, // Legacy option
          on: on,
          registerEvents: registerEvents,
          triggerEvent: triggerEvent,
          setupExternalAnnotation: setupExternalAnnotation,
          linkAnnotation: linkAnnotation
        };

        /**
         * If options.controlsContainer/containers.controls is null,
         * accelerator packs should not append their controls.
         */
        var containers = getContainerElements();
        var appendControl = !!containers.controls;
        var controlsContainer = containers.controls; // Legacy option
        var streamContainers = containers.stream;
        var baseOptions = {
          session: session,
          core: accPack,
          accPack: accPack,
          controlsContainer: controlsContainer,
          appendControl: appendControl,
          streamContainers: streamContainers
        };

        switch (packageName) {
          /* beautify ignore:start */
          case 'communication':
            {
              return Object.assign({}, baseOptions, { state: internalState, analytics: analytics }, options.communication);
            }
          case 'textChat':
            {
              var textChatOptions = {
                textChatContainer: path('textChat.container', options),
                waitingMessage: path('textChat.waitingMessage', options),
                sender: { alias: path('textChat.name', options) },
                alwaysOpen: path('textChat.alwaysOpen', options)
              };
              return Object.assign({}, baseOptions, textChatOptions);
            }
          case 'screenSharing':
            {
              var screenSharingContainer = { screenSharingContainer: streamContainers };
              return Object.assign({}, baseOptions, screenSharingContainer, options.screenSharing);
            }
          case 'annotation':
            {
              return Object.assign({}, baseOptions, options.annotation);
            }
          case 'archiving':
            {
              return Object.assign({}, baseOptions, options.archiving);
            }
          default:
            return {};
          /* beautify ignore:end */
        }
      };

      /** Create instances of each package */
      // eslint-disable-next-line global-require,import/no-extraneous-dependencies

      _this.communication = new Communication(packageOptions('communication'));
      _this.textChat = packages.TextChat ? new packages.TextChat(packageOptions('textChat')) : null;
      _this.screenSharing = packages.ScreenSharing ? new packages.ScreenSharing(packageOptions('screenSharing')) : null;
      _this.annotation = packages.Annotation ? new packages.Annotation(packageOptions('annotation')) : null;
      _this.archiving = packages.Archiving ? new packages.Archiving(packageOptions('archiving')) : null;

      analytics.log(logAction.initPackages, logVariation.success);
    }
  });
  Object.defineProperty(this, 'connect', {
    enumerable: true,
    writable: true,
    value: function value() {
      var analytics = _this.analytics,
          getSession = _this.getSession,
          initPackages = _this.initPackages,
          triggerEvent = _this.triggerEvent,
          getCredentials = _this.getCredentials;

      return new Promise(function (resolve, reject) {
        analytics.log(logAction.connect, logVariation.attempt);
        var session = getSession();

        var _getCredentials = getCredentials(),
            token = _getCredentials.token;

        session.connect(token, function (error) {
          if (error) {
            message(error);
            analytics.log(logAction.connect, logVariation.fail);
            return reject(error);
          }
          var sessionId = session.sessionId,
              apiKey = session.apiKey;

          analytics.update(sessionId, path('connection.connectionId', session), apiKey);
          analytics.log(logAction.connect, logVariation.success);
          initPackages();
          triggerEvent('connected', session);
          return resolve({ connections: session.connections.length() });
        });
      });
    }
  });
  Object.defineProperty(this, 'disconnect', {
    enumerable: true,
    writable: true,
    value: function value() {
      var analytics = _this.analytics,
          getSession = _this.getSession,
          internalState = _this.internalState;

      analytics.log(logAction.disconnect, logVariation.attempt);
      getSession().disconnect();
      internalState.reset();
      analytics.log(logAction.disconnect, logVariation.success);
    }
  });
  Object.defineProperty(this, 'forceDisconnect', {
    enumerable: true,
    writable: true,
    value: function value(connection) {
      var analytics = _this.analytics,
          getSession = _this.getSession;

      return new Promise(function (resolve, reject) {
        analytics.log(logAction.forceDisconnect, logVariation.attempt);
        getSession().forceDisconnect(connection, function (error) {
          if (error) {
            analytics.log(logAction.forceDisconnect, logVariation.fail);
            reject(error);
          } else {
            analytics.log(logAction.forceDisconnect, logVariation.success);
            resolve();
          }
        });
      });
    }
  });
  Object.defineProperty(this, 'startCall', {
    enumerable: true,
    writable: true,
    value: function value(publisherProps) {
      return _this.communication.startCall(publisherProps);
    }
  });
  Object.defineProperty(this, 'endCall', {
    enumerable: true,
    writable: true,
    value: function value() {
      return _this.communication.endCall();
    }
  });
  Object.defineProperty(this, 'state', {
    enumerable: true,
    writable: true,
    value: function value() {
      return _this.internalState.all();
    }
  });
  Object.defineProperty(this, 'subscribe', {
    enumerable: true,
    writable: true,
    value: function value(stream, subscriberProperties) {
      var networkTest = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      return _this.communication.subscribe(stream, subscriberProperties, networkTest);
    }
  });
  Object.defineProperty(this, 'unsubscribe', {
    enumerable: true,
    writable: true,
    value: function value(subscriber) {
      return _this.communication.unsubscribe(subscriber);
    }
  });
  Object.defineProperty(this, 'forceUnpublish', {
    enumerable: true,
    writable: true,
    value: function value(stream) {
      var analytics = _this.analytics,
          getSession = _this.getSession;

      return new Promise(function (resolve, reject) {
        analytics.log(logAction.forceUnpublish, logVariation.attempt);
        getSession().forceUnpublish(stream, function (error) {
          if (error) {
            analytics.log(logAction.forceUnpublish, logVariation.fail);
            reject(error);
          } else {
            analytics.log(logAction.forceUnpublish, logVariation.success);
            resolve();
          }
        });
      });
    }
  });
  Object.defineProperty(this, 'getPublisherForStream', {
    enumerable: true,
    writable: true,
    value: function value(stream) {
      return _this.getSession().getPublisherForStream(stream);
    }
  });
  Object.defineProperty(this, 'getSubscribersForStream', {
    enumerable: true,
    writable: true,
    value: function value(stream) {
      return _this.getSession().getSubscribersForStream(stream);
    }
  });
  Object.defineProperty(this, 'signal', {
    enumerable: true,
    writable: true,
    value: function value(type, data, to) {
      var analytics = _this.analytics,
          getSession = _this.getSession;

      return new Promise(function (resolve, reject) {
        analytics.log(logAction.signal, logVariation.attempt);
        var session = getSession();
        var signalObj = Object.assign({}, type ? { type: type } : null, data ? { data: JSON.stringify(data) } : null, to ? { to: to } : null // eslint-disable-line comma-dangle
        );
        session.signal(signalObj, function (error) {
          if (error) {
            analytics.log(logAction.signal, logVariation.fail);
            reject(error);
          } else {
            analytics.log(logAction.signal, logVariation.success);
            resolve();
          }
        });
      });
    }
  });
  Object.defineProperty(this, 'toggleLocalAudio', {
    enumerable: true,
    writable: true,
    value: function value(enable) {
      var analytics = _this.analytics,
          internalState = _this.internalState,
          communication = _this.communication;

      analytics.log(logAction.toggleLocalAudio, logVariation.attempt);

      var _internalState$getPub = internalState.getPubSub(),
          publishers = _internalState$getPub.publishers;

      var toggleAudio = function toggleAudio(id) {
        return communication.enableLocalAV(id, 'audio', enable);
      };
      Object.keys(publishers.camera).forEach(toggleAudio);
      analytics.log(logAction.toggleLocalAudio, logVariation.success);
    }
  });
  Object.defineProperty(this, 'toggleLocalVideo', {
    enumerable: true,
    writable: true,
    value: function value(enable) {
      var analytics = _this.analytics,
          internalState = _this.internalState,
          communication = _this.communication;

      analytics.log(logAction.toggleLocalVideo, logVariation.attempt);

      var _internalState$getPub2 = internalState.getPubSub(),
          publishers = _internalState$getPub2.publishers;

      var toggleVideo = function toggleVideo(id) {
        return communication.enableLocalAV(id, 'video', enable);
      };
      Object.keys(publishers.camera).forEach(toggleVideo);
      analytics.log(logAction.toggleLocalVideo, logVariation.success);
    }
  });
  Object.defineProperty(this, 'toggleRemoteAudio', {
    enumerable: true,
    writable: true,
    value: function value(id, enable) {
      var analytics = _this.analytics,
          communication = _this.communication;

      analytics.log(logAction.toggleRemoteAudio, logVariation.attempt);
      communication.enableRemoteAV(id, 'audio', enable);
      analytics.log(logAction.toggleRemoteAudio, logVariation.success);
    }
  });
  Object.defineProperty(this, 'toggleRemoteVideo', {
    enumerable: true,
    writable: true,
    value: function value(id, enable) {
      var analytics = _this.analytics,
          communication = _this.communication;

      analytics.log(logAction.toggleRemoteVideo, logVariation.attempt);
      communication.enableRemoteAV(id, 'video', enable);
      analytics.log(logAction.toggleRemoteVideo, logVariation.success);
    }
  });
};

if (global === window) {
  window.AccCore = AccCore;
}

module.exports = AccCore;