cyclon.p2p-common
====================

[![Build Status](https://travis-ci.org/nicktindall/cyclon.p2p-common.svg)](https://travis-ci.org/nicktindall/cyclon.p2p-common)
[![Dependencies](https://david-dm.org/nicktindall/cyclon.p2p-common.png)](https://david-dm.org/nicktindall/cyclon.p2p-common)

Some utilities used by various [cyclon.p2p](https://github.com/nicktindall/cyclon.p2p) modules

How to use
----------
First install cyclon.p2p-common as a runtime dependency

```javascript
npm install cyclon.p2p-common --save
```

Then you can

```javascript
var cyclonUtils = require('cyclon.p2p-common');

/**
 *  Select a random subset of an array using reservoir sampling
 */
var subset = cyclonUtils.randomSample(['some', 'elements', 'to', 'choose', 'from'], 3);


/**
 *  Check that an arguments array has the specified number of arguments
 */
cyclonUtils.checkArguments(arguments, 4);   // This throws an error if the size is wrong


/**
 *  Get the singleton console logger instance
 */
var logger = cyclonUtils.consoleLogger().info('Reticulating Splines...');
//  ... and change its threshold
logger.setLevelToWarning();


/**
 *  Create instances of an in-memory implementation of the DOM storage API
 */
var storage = cyclonUtils.newInMemoryStorage();


/**
 *  Get the singleton instance of the asyncExecService interface that's used in a lot of places
 */
var asyncExecService = cyclonUtils.asyncExecService;
asyncExecService.setTimeout(function() {
    console.log('I am delayed');
}, 3000);


/**
 *  Wrap implementations of the DOM storage API with an obfuscating layer
 */
var obfuscatedSessionStorage = cyclonUtils.obfuscateStorage(sessionStorage);


/**
 *  Shuffle an array in place
 */
var shuffledArray = cyclonUtils.shuffleArray(['one', 'two', 'three']);

````


