"use strict";

var spawn = require('child_process').spawn;

function trace(host, opts, cb) {
  if (!opts.cycles) {
    opts.cycles = 3;
  }
  var mtr = spawn('mtr', ['--raw', '--report-cycles', opts.cycles, host]);
  mtr.stderr.on('data', function (data) {
    console.error("ERROR: " + data);
  });
  mtr.stdout.on('data', function (data) {
    var lines = data.toString().split('\n');
//    console.log("lines", lines);
    for (var i = 0; i < lines.length; i++) {
      if (lines[i] === '') {
        break;
      }
      var r = lines[i].split(' ');
      r[1] = parseInt(r[1], 10);
      if (r[0] === 'p') {
        r[2] = parseInt(r[2], 10);
      }
      cb(lines, r);
    }
  });
  mtr.on('exit', function (code) {
//    console.log("mtr done!");
    cb(null, ["x", code]);
    if (code !== 0) {
      console.error('mtr process exited with code ' + code);
    }
  });
}

exports.trace_raw = function (host, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  trace(host, opts, cb);
};