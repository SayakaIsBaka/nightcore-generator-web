'use strict';

const proxyUrl = "https://cors-anywhere.herokuapp.com/";

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

const getRequestUrl = (page, tag) => {
    return proxyUrl + "https://safebooru.org/index.php?page=dapi&s=post&q=index&pid=" +
        page + "&tags=width:1920+height:1080+-swimsuit+-feet+-text+score:>=1+" + tag;
};

const request = async (url) => {
    let res = await window.fetch(url, {method: "GET", mode: "cors"});
    let resText = await res.text();
    return new DOMParser().parseFromString(resText, "text/xml");
};

const getImage = async (url) => {
    let res = await window.fetch(proxyUrl + url, {method: "GET", mode: "cors"});
    return await res.arrayBuffer();
};

const getRandomImage = async () => {
    const tags = ['looking_at_another', '1girl', 'vocaloid', '1girl+1boy', '2girls'];
    const tag = tags[Math.floor(Math.random() * tags.length)];
    let xmlDoc = await request(getRequestUrl(1, tag));
    
    const count = xmlDoc.getElementsByTagName('posts')[0].getAttribute('count');
    if (count === 0) {
        alert("No suitable images found, reloading...");
        document.location.reload();
    } else {
        const imageId = Math.floor(Math.random() * count) + 1;
        const page = Math.floor(imageId / 100);
        xmlDoc = await request(getRequestUrl(page, tag));
        const imageList = xmlDoc.getElementsByTagName("post");
        const imageUrl = imageList[imageId % 100].getAttribute("file_url");
        return getImage(imageUrl);
    }
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

    return result[0];
};

const fileSelectHandler = evt => {
    var file = evt.target.files[0];
    file.arrayBuffer().then(async (data) => {
        const audio = speedupSong(file.name, data);
        const image = await getRandomImage();
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
