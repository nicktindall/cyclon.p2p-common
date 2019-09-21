'use strict';

const {EventEmitter} = require("events");

function BufferingEventEmitter(logger = console, maxBufferSize = 50) {
    this._bufferedEvents = [];
    this._eventEmitter = new EventEmitter();
    this._logger = logger;
    this._maxBufferSize = maxBufferSize;
}

BufferingEventEmitter.prototype.once = function (eventType, callback) {
    const unhandledMessage = this._popUnhandledMessage(eventType);
    if (unhandledMessage != null) {
        callback(...unhandledMessage);
    } else {
        this._eventEmitter.once(eventType, callback);
    }
};

BufferingEventEmitter.prototype.on = function (eventType, callback) {
    let unhandledMessage;
    while ((unhandledMessage = this._popUnhandledMessage(eventType)) != null) {
        callback(...unhandledMessage);
    }
    this._eventEmitter.on(eventType, callback);
};

BufferingEventEmitter.prototype._popUnhandledMessage = function (type) {
    const index = this._bufferedEvents.findIndex(function (message) {
        return message.type === type
    });
    if (index >= 0) {
        this._logger.debug("Releasing buffered message of type '" + type + "'");
        return this._bufferedEvents.splice(index, 1)[0].payload;
    } else {
        return null;
    }
};

BufferingEventEmitter.prototype.emit = function (eventType, ...args) {
    if (this._eventEmitter.listenerCount(eventType) === 0) {
        this._logger.debug("No listener registered for '" + eventType + "', buffering");
        this._bufferEvent(eventType, args);
    } else {
        this._eventEmitter.emit(eventType, ...args);
    }
};

BufferingEventEmitter.prototype._bufferEvent = function (eventType, args) {
    if (this._bufferedEvents.length === this._maxBufferSize) {
        this._logger.debug(`Buffered event handler overflowing, expiring '${this._bufferedEvents.shift().type}' event`);
    }
    this._bufferedEvents.push({
        type: eventType,
        payload: args
    });
};

BufferingEventEmitter.prototype.removeListener = function (eventType, callback) {
    this._eventEmitter.removeListener(eventType, callback);
};

BufferingEventEmitter.prototype.removeAllListeners = function (eventType) {
    this._eventEmitter.removeAllListeners(eventType);
};

BufferingEventEmitter.prototype.setMaxListeners = function (maxListeners) {
    this._eventEmitter.setMaxListeners(maxListeners);
};

module.exports = BufferingEventEmitter;