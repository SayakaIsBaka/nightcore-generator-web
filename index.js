'use strict';

const proxyUrl = "https://cors-anywhere-safebooru.herokuapp.com/";

const saveData = (fileName, data) => {
    const a = document.createElement("a");
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

        return imageUrl;
    }
};

const writeVideo = (audio, image) => {
    ffmpeg_run({
        arguments: ['-i', image.name, '-i', audio.name, '-c:v', 'libx264', "-filter:a", "asetrate=44100*" + slider.value / 100 + ",aresample=44100", '-c:a', 'aac', '-pix_fmt', 'yuv420p', 'nightcore.mp4'],
        files: [audio, image],
        stdin: function(){},
        TOTAL_MEMORY: 536870912,
        returnCallback: (result) => {
            const video = result[0];
            if (video === undefined) {
                alert("Something went wrong")
            } else {
                saveData(video.name, video.data);
            }
        }
    });
};

const fileSelectHandler = evt => {
    const file = document.getElementById("audioin").files[0];
    slider.disabled = true;
    file.arrayBuffer().then(async (data) => {
        const audio = {
            name: file.name,
            data: new Uint8Array(data)
        }
        const imageUrl = await getRandomImage();
        makeVideo(audio, imageUrl);
    });
};

const convertImageToCanvas = image => {
	const canvas = document.getElementById("canvas");
	canvas.width = image.width;
	canvas.height = image.height;
	canvas.getContext("2d").drawImage(image, 0, 0);

	return canvas;
};

const makeVideo = (audio, url) => {
    const img = new Image();
    img.onload = () => {
        const canvas = convertImageToCanvas(img);
        const newImg = new Image();
        newImg.src = canvas.toBlob(async blob => {
            const data = await blob.arrayBuffer();
            const image = {
                name: url.substring(url.lastIndexOf('/') + 1),
                data: new Uint8Array(data)
            };
            writeVideo(audio, image);
        }, 'image/jpeg');
    };
    img.src = proxyUrl + url;
    img.crossOrigin = "anonymous";
};

if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('start').addEventListener('click', fileSelectHandler, false);
} else {
    alert('The File APIs are not fully supported in this browser.');
}

const slider = document.getElementById("rate");
const output = document.getElementById("rateValue");
output.innerHTML = 'x' + slider.value / 100;

slider.oninput = function() {
    output.innerHTML = 'x' + this.value / 100;
}