'use strict';

const ffmpeg = require("ffmpeg.js/ffmpeg-mp4.js");
const fs = require("fs");

const speedupSong = () => {
  let testData = new Uint8Array(fs.readFileSync("test.webm"));
  var result = ffmpeg({
    MEMFS: [{
      name: "in.mp3",
      data: testData
    }],
    arguments: ["-i", "in.mp3", "-filter:a", "\"asetrate=44100*1.25\"", "-vn", "out.mp3"],
    stdin: function () {},
  });

  var out = result.MEMFS[0];
  fs.writeFileSync(out.name, Buffer(out.data));
}

if (window.File && window.FileReader && window.FileList && window.Blob) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.');
}

/*
https://github.com/Kagami/ffmpeg.js
https://github.com/browserify/browserify
https://www.html5rocks.com/en/tutorials/file/dndfiles/
*/