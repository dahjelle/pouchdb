'use strict';
var nodeCrypto = require('crypto');
var Promise = require('../utils').Promise;
var maxInt = 4294967295; //2 ^ 32 -1
module.exports = randomNumber;
function randomNumber(min, max) {
  min = parseInt(min, 10);
  max = parseInt(max, 10);
  if (min !== min) {
    min = 0;
  }
  if (max !== max || max <= min) {
    max = (min || 1) << 1; //doubling
  } else {
    max = max + 1;
  }
  if (process.browser) {
    return browserRandom(min, max);
  }
  return nodeRandom(min, max);
}

function nodeRandom(min, max) {
  return new Promise(function (fulfill, reject) {
    var range = max - min;
    nodeCrypto.randomBytes(4, function (err, random) {
      if (err) {
        return reject(err);
      }
      var newValue = range * (random.readUInt32LE(0) / maxInt) + min;
      fulfill(parseInt(newValue, 10));
    });
  });
}

function browserRandom(min, max) {
  return new Promise(function (fulfill, reject) {
    var ratio;
    var range = max - min;
    if (global.crypto && typeof global.crypto.getRandomValues === 'function') {
      var array = new Uint32Array(1);
      global.crypto.getRandomValues(array);
      ratio = array[0] / maxInt;
    } else {
      ratio = Math.random();
    }
    fulfill(parseInt(range * ratio + min, 10));
  });
}