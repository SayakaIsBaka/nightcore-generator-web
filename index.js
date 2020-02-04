'use strict';

const ffmpeg = require("ffmpeg.js/ffmpeg-mp4.js");
const fs = require("fs");

const speedupSong = (file, data) => {
    var result = ffmpeg({
        MEMFS: [{
            name: file,
            data: data
        }],
        arguments: ["-i", file, "-filter:a", "asetrate=44100*1.25", "-vn", "out.mp3"],
        stdin: function() {},
    });

    var out = result.MEMFS[0];
    alert(out);
};

const fileSelectHandler = evt => {
    var file = evt.target.files[0];
    file.arrayBuffer().then(function(data) {
        speedupSong(file.name, data);
    });
};

if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('audioin').addEventListener('change', fileSelectHandler, false);
} else {
    alert('The File APIs are not fully supported in this browser.');
}

/*
https://github.com/Kagami/ffmpeg.js
https://github.com/browserify/browserify
https://www.html5rocks.com/en/tutorials/file/dndfiles/

TODO: compile a custom version of ffmpeg.js
*/