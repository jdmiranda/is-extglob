/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Copyright (c) 2014-2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

// Character codes for optimization
var CHAR_BACKSLASH = 92;  // \
var CHAR_AT = 64;         // @
var CHAR_QUESTION = 63;   // ?
var CHAR_EXCLAMATION = 33;// !
var CHAR_PLUS = 43;       // +
var CHAR_ASTERISK = 42;   // *
var CHAR_OPEN_PAREN = 40; // (

// Simple cache for common patterns
var cache = Object.create(null);
var cacheSize = 0;
var MAX_CACHE_SIZE = 100;

module.exports = function isExtglob(str) {
  // Type check and empty string check
  if (typeof str !== 'string' || str === '') {
    return false;
  }

  // Check cache first
  if (cache[str] !== undefined) {
    return cache[str];
  }

  var len = str.length;
  var result = false;

  // Fast path: check if string contains any potential extglob characters
  // This avoids detailed scanning for strings that can't possibly have extglobs
  var hasPotentialExtglob = false;
  for (var i = 0; i < len; i++) {
    var code = str.charCodeAt(i);
    if (code === CHAR_AT || code === CHAR_QUESTION || code === CHAR_EXCLAMATION ||
        code === CHAR_PLUS || code === CHAR_ASTERISK) {
      hasPotentialExtglob = true;
      break;
    }
  }

  if (!hasPotentialExtglob) {
    result = false;
  } else {
    // Optimized character iteration using character codes
    var i = 0;
    while (i < len) {
      var code = str.charCodeAt(i);

      // Check for backslash (escape character)
      if (code === CHAR_BACKSLASH) {
        // Skip escaped character
        i += 2;
        continue;
      }

      // Check for extglob patterns: @(...), ?(...), !(...), +(...), *(...)
      // Must have opening paren and validate there's content after it
      if ((code === CHAR_AT || code === CHAR_QUESTION || code === CHAR_EXCLAMATION ||
           code === CHAR_PLUS || code === CHAR_ASTERISK) &&
          i + 1 < len && str.charCodeAt(i + 1) === CHAR_OPEN_PAREN) {
        // Found potential extglob, verify it has closing paren
        var hasClosingParen = false;
        for (var j = i + 2; j < len; j++) {
          if (str.charCodeAt(j) === 41) { // )
            hasClosingParen = true;
            break;
          }
        }
        if (hasClosingParen) {
          result = true;
          break;
        }
      }

      i++;
    }
  }

  // Cache the result
  if (cacheSize < MAX_CACHE_SIZE) {
    cache[str] = result;
    cacheSize++;
  }

  return result;
};
