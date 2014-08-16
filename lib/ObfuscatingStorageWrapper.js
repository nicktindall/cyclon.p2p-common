'use strict';

var CryptoJS = require("crypto-js");
var GuidGenerator = require("./GuidGenerator");

/**
 * You don't need to be a genius to break this "security" but it should
 * slow tinkerers down a little
 *
 * @param GuidService
 * @returns {{wrapStorage: Function}}
 * @constructor
 */
function ObfuscatingStorageWrapper(storage) {

    function getSecretKey() {
        var secretKeyName = scrambleWellKnownKey("___XX");
        var secretKey = storage.getItem(secretKeyName);
        if (secretKey === null) {
            secretKey = GuidGenerator();
            storage.setItem(secretKeyName, secretKey);
        }
        return secretKey;
    }

    function scrambleWellKnownKey(key) {
        return CryptoJS.SHA1(key).toString();
    }

    function scrambleKey(key) {
        return CryptoJS.HmacMD5(key, getSecretKey()).toString();
    }

    function encrypt(value) {
        return  CryptoJS.AES.encrypt(JSON.stringify(value), getSecretKey()).toString();
    }

    function decrypt(value) {
        if (value === null) {
            return null;
        }
        try {
            var decryptedValue = CryptoJS.AES.decrypt(value, getSecretKey()).toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedValue);
        }
        catch (e) {
            return null;
        }
    }

    this.getItem = function (key) {
        return decrypt(storage.getItem(scrambleKey(key)));
    };

    this.setItem = function (key, value) {
        storage.setItem(scrambleKey(key), encrypt(value));
    };

    this.removeItem = function (key) {
        storage.removeItem(scrambleKey(key));
    };

    this.clear = function () {
        storage.clear();
    };

    getSecretKey();
}

module.exports = ObfuscatingStorageWrapper;