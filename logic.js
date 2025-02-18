document.addEventListener('DOMContentLoaded', () => {
    // Audio Recording
    let audioContext, audioRecorder, chunks = [];

    const recordAudioBtn = document.getElementById('recordAudio');
    const stopAudioBtn = document.getElementById('stopAudio');
    const audioPlayer = document.getElementById('audioPlayer');

    recordAudioBtn.addEventListener('click', startAudioRecording);
    stopAudioBtn.addEventListener('click', stopAudioRecording);

    function startAudioRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            audioContext = new AudioContext();
            audioRecorder = new MediaRecorder(stream);
            audioRecorder.ondataavailable = e => chunks.push(e.data);
            audioRecorder.onstop = exportAudioData;
            audioRecorder.start();
            recordAudioBtn.disabled = true;
            stopAudioBtn.disabled = false;
        })
        .catch(err => console.error('Error accessing microphone:', err));
    }

    function stopAudioRecording() {
        if (audioRecorder && audioRecorder.state === "recording") {
            audioRecorder.stop();
            recordAudioBtn.disabled = false;
            stopAudioBtn.disabled = true;
        }
    }

    function exportAudioData() {
        let blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
        audioPlayer.src = URL.createObjectURL(blob);
        chunks = [];
    }

    // Image Processing (Grayscale Conversion)
    const imageInput = document.getElementById('imageInput');
    const imageCanvas = document.getElementById('imageCanvas');
    const grayscaleBtn = document.getElementById('grayscale');

    imageInput.addEventListener('change', handleImageUpload);
    grayscaleBtn.addEventListener('click', convertToGrayscale);

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            img.onload = function() {
                const ctx = imageCanvas.getContext('2d');
                ctx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);
            };
            img.src = URL.createObjectURL(file);
        }
    }

    function convertToGrayscale() {
        const ctx = imageCanvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
        for (let i = 0; i < imgData.data.length; i += 4) {
            const avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
            imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = avg;
        }
        ctx.putImageData(imgData, 0, 0);
    }

    // Video Streaming
    const startVideoBtn = document.getElementById('startVideo');
    const stopVideoBtn = document.getElementById('stopVideo');
    const videoPlayer = document.getElementById('videoPlayer');

    startVideoBtn.addEventListener('click', startVideoStream);
    stopVideoBtn.addEventListener('click', stopVideoStream);

    function startVideoStream() {
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            videoPlayer.srcObject = stream;
            startVideoBtn.disabled = true;
            stopVideoBtn.disabled = false;
        })
        .catch(err => console.error('Error accessing camera:', err));
    }

    function stopVideoStream() {
        const stream = videoPlayer.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            videoPlayer.srcObject = null;
            startVideoBtn.disabled = false;
            stopVideoBtn.disabled = true;
        }
    }
});
