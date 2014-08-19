'use strict';

var AsyncExecService = require("./AsyncExecService");
var InMemoryStorage = require("./InMemoryStorage");
var ConsoleLogger = require("./ConsoleLogger");
var GuidGenerator = require("./GuidGenerator");
var ObfuscatingStorageWrapper = require("./ObfuscatingStorageWrapper");
var UnreachableError = require("./UnreachableError");

/**
 * Extract a random sample of a list of items (uses reservoir sampling, so it's fast)
 *
 * @param fromSet The list to randomly choose items from
 * @param setSize The maximum number of items to sample
 * @returns {Array}
 */
exports.randomSample = function (fromSet, setSize) {
    var resultSet = [];

    for (var i = 0; i < fromSet.length; i++) {
        if (resultSet.length < setSize) {
            resultSet.push(fromSet[i]);
        }
        else {
            var insertAt = Math.floor(Math.random() * i);
            if (insertAt < resultSet.length) {
                resultSet[insertAt] = fromSet[i];
            }
        }
    }

    return resultSet;
};

/**
 * Convenience for checking the number of arguments to a function
 *
 * @param argumentsArray
 * @param expectedCount
 */
exports.checkArguments = function (argumentsArray, expectedCount) {
    if (argumentsArray.length !== expectedCount) {
        throw new Error("Invalid number of arguments provided for function! (expected " + expectedCount + ", got " + argumentsArray.length + ")");
    }
};

/**
 * Get the singleton console logger instance
 *
 * @returns {null}
 */
var loggerInstance = null;
exports.consoleLogger = function () {
    if (loggerInstance === null) {
        loggerInstance = new ConsoleLogger();
    }
    return loggerInstance;
};

/**
 * Factory method for instances of the in-memory DOM storage API implementation
 *
 * @returns {*}
 */
exports.newInMemoryStorage = function () {
    return new InMemoryStorage();
};

/**
 * Get the singleton AsyncExecService instance
 */
var asyncExecServiceInstance = null;
exports.asyncExecService = function () {
    if (asyncExecServiceInstance === null) {
        asyncExecServiceInstance = new AsyncExecService();
    }
    return asyncExecServiceInstance;
};

exports.generateGuid = GuidGenerator;

/**
 * Return the DOM storage object wrapped in an obfuscating decorator
 *
 * @param storage
 * @returns {ObfuscatingStorageWrapper}
 */
exports.obfuscateStorage = function (storage) {
    return new ObfuscatingStorageWrapper(storage);
};

/**
 * Shuffle an array in place
 *
 * http://jsfromhell.com/array/shuffle [v1.0]
 */
exports.shuffleArray = function (o) {
    //noinspection StatementWithEmptyBodyJS
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) {
    }
    return o;
};

/**
 * The error used when a node is unreachable
 */
exports.UnreachableError = UnreachableError;
