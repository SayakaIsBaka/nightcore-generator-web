'use strict';

const ffmpeg = require("ffmpeg.js/ffmpeg-mp4.js");
const fs = require("fs");

let testData = new Uint8Array(fs.readFileSync("test.webm"));
var result = ffmpeg({
  MEMFS: [{name: "test.webm", data: testData}],
  arguments: ["-i", "test.webm", "-filter:a", "\"asetrate=44100*1.25\"", "-vn", "out.mp3"],
  // Ignore stdin read requests.
  stdin: function() {},
});
// Write out.webm to disk.
var out = result.MEMFS[0];
fs.writeFileSync(out.name, Buffer(out.data));
