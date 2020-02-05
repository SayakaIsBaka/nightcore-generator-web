'use strict';

const fs = require("fs");

const createDownloadLink = (file, data) => {
    const blob = new Blob([data], {type: "audio/mpeg"});
    const url = URL.createObjectURL(blob);
    window.location.href = url;
};

const speedupSong = (file, data) => {
    var result = ffmpeg_run({
        arguments: ["-i", file, "-filter:a", "asetrate=44100*1.25", "-vn", "out.mp3"],
        files: [{
            name: file,
            data: new Uint8Array(data)
        }],
    });

    var out = result[0];
    createDownloadLink(out.name, out.data);
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
https://bgrins.github.io/videoconverter.js/
https://github.com/browserify/browserify
https://www.html5rocks.com/en/tutorials/file/dndfiles/

TODO: compile a custom version of ffmpeg.js
*/
