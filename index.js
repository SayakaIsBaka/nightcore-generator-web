'use strict';

const fs = require("fs");

const saveData = (fileName, data) => {
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    const blob = new Blob([data], {type: "audio/ogg"});
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
};

const speedupSong = (file, data) => {
    var result = ffmpeg_run({
        arguments: ["-i", file, "-filter:a", "asetrate=44100*1.25", "-vn", "out.ogg"],
        files: [{
            name: file,
            data: new Uint8Array(data)
        }],
        stdin: function(){}
    });

    var out = result[0];
    saveData(out.name, out.data);
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
