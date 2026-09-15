console.log("emotion.js loaded");

const video = document.getElementById("video");
const startCameraButton = document.getElementById("startCamera");
const detectEmotionButton = document.getElementById("captureEmotion");


// ========================================
// START CAMERA
// ========================================

startCameraButton.addEventListener("click", async function () {

    console.log("Start Camera button clicked");

    try {

        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
        });

        console.log("Camera permission granted");
        console.log(stream);

        video.srcObject = stream;

        video.play();

        console.log("Camera started successfully");

    } catch (error) {

        console.error("Camera error:", error);

        alert(
            "Camera could not be started.\n\n" +
            "Error: " + error.name + "\n" +
            error.message
        );
    }

});


// ========================================
// DETECT EMOTION
// ========================================

detectEmotionButton.addEventListener("click", async function () {

    console.log("Detect Emotion clicked");

    if (!video.srcObject) {

        alert("Please start the camera first.");

        return;
    }

    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const imageData = canvas.toDataURL("image/jpeg");

    console.log("Image captured");

    try {

        const response = await fetch("/Emotion/Detect", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                image: imageData
            })

        });

        const data = await response.json();

        console.log("Server response:", data);

        if (data.success) {

            document.getElementById("emotion").textContent =
                data.emotion;

            document.getElementById("confidence").textContent =
                (data.confidence * 100).toFixed(2) + "%";

            getRecommendations(data.emotion);

        }

    } catch (error) {

        console.error("Detection error:", error);

    }

});


// ========================================
// GET MUSIC
// ========================================

async function getRecommendations(emotion) {

    try {

        const response = await fetch(
            `/Emotion/Recommendations?emotion=${encodeURIComponent(emotion)}`
        );

        const songs = await response.json();

        const songsContainer =
            document.getElementById("songs");

        songsContainer.innerHTML = "";

        songs.forEach(song => {

            const div = document.createElement("div");

            div.className = "card mb-3 p-3";

            div.innerHTML = `
                <h4>🎵 ${song.title}</h4>
                <p>Artist: ${song.artist}</p>
                <p>Genre: ${song.genre}</p>

                <button
                    class="btn btn-primary"
                    onclick="playSong('${song.filePath}')">

                    ▶ Play

                </button>
            `;

            songsContainer.appendChild(div);

        });

    } catch (error) {

        console.error("Music error:", error);

    }

}


// ========================================
// PLAY MUSIC
// ========================================

function playSong(filePath) {

    let audio = document.getElementById("audioPlayer");

    if (!audio) {

        audio = document.createElement("audio");

        audio.id = "audioPlayer";

        audio.controls = true;

        document
            .getElementById("musicSection")
            .appendChild(audio);
    }

    audio.src = filePath;

    audio.play();

}