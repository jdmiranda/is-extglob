/*!
 * is-extglob <https://github.com/jonschlinkert/is-extglob>
 *
 * Performance benchmark for optimized extglob detection
 */

'use strict';

var isExtglob = require('./index.js');

// Test cases representing different scenarios
var testCases = [
  // Positive cases (has extglob)
  '?(abc)',
  '@(abc)',
  '!(abc)',
  '*(abc)',
  '+(abc)',
  'xyz/?(abc)/xyz',
  'xyz/@(abc|def)/xyz',

  // Negative cases (no extglob)
  'simple.js',
  '*.js',
  '**/*.js',
  'abc/def/ghi.js',
  '[a-z].js',
  'path/to/file.txt',
  'no-extglob-here',

  // Edge cases
  '',
  'a',
  '\\?(abc)',
  'very/long/path/with/many/segments/but/no/extglob/pattern.js'
];

function benchmark(name, fn, iterations) {
  var start = Date.now();
  for (var i = 0; i < iterations; i++) {
    fn();
  }
  var end = Date.now();
  var duration = end - start;
  var opsPerSec = Math.round((iterations / duration) * 1000);

  console.log(name + ':');
  console.log('  Total time: ' + duration + 'ms');
  console.log('  Iterations: ' + iterations);
  console.log('  Ops/sec: ' + opsPerSec.toLocaleString());
  console.log('');

  return { duration: duration, opsPerSec: opsPerSec };
}

console.log('='.repeat(60));
console.log('Performance Benchmark - is-extglob (optimized)');
console.log('='.repeat(60));
console.log('');

// Warm up
for (var i = 0; i < 10000; i++) {
  testCases.forEach(function(testCase) {
    isExtglob(testCase);
  });
}

console.log('Running benchmarks...\n');

// Benchmark individual test cases
var iterations = 1000000;

benchmark('All test cases combined', function() {
  testCases.forEach(function(testCase) {
    isExtglob(testCase);
  });
}, iterations / 10);

benchmark('Positive case (has extglob)', function() {
  isExtglob('?(abc)');
}, iterations);

benchmark('Negative case (simple path)', function() {
  isExtglob('simple.js');
}, iterations);

benchmark('Negative case (wildcard)', function() {
  isExtglob('*.js');
}, iterations);

benchmark('Escaped extglob', function() {
  isExtglob('\\?(abc)');
}, iterations);

benchmark('Long path without extglob', function() {
  isExtglob('very/long/path/with/many/segments/but/no/extglob/pattern.js');
}, iterations);

// Cache effectiveness test
console.log('Testing cache effectiveness...\n');

var cacheTestIterations = 1000000;
var repeatedPattern = '?(abc)';

var result = benchmark('Repeated pattern (cache test)', function() {
  isExtglob(repeatedPattern);
}, cacheTestIterations);

console.log('='.repeat(60));
console.log('Benchmark complete!');
console.log('='.repeat(60));
