document.addEventListener('DOMContentLoaded', function() {
  // Helper: Show tool content in the section's display area.
  function showToolContent(link, createContentFn) {
    const section = link.closest('section');
    if (!section) return;
    const displayContainer = section.querySelector('.tool-display');
    // Toggle off if the same tool is already active.
    if (displayContainer.dataset.tool === link.dataset.tool) {
      displayContainer.innerHTML = '';
      delete displayContainer.dataset.tool;
      return;
    }
    displayContainer.innerHTML = '';
    displayContainer.dataset.tool = link.dataset.tool;
    createContentFn(displayContainer);
  }

  // Set up event listeners for each tool link.
  const toolLinks = document.querySelectorAll('.tool-grid a');
  toolLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      const toolName = this.dataset.tool;
      switch (toolName) {
        // === AUDIO TOOLS ===
        case 'audio-recorder': openAudioRecorder(this); break;
        case 'audio-speed-changer': openAudioSpeedChanger(this); break;
        case 'audio-cutter': openAudioCutter(this); break;
        case 'audio-joiner': openAudioJoiner(this); break;
        case 'audio-converter': openAudioConverter(this); break;
        case 'audio-equalizer': openAudioEqualizer(this); break;
        case 'audio-normalizer': openAudioNormalizer(this); break;
        case 'audio-channel-splitter': openAudioChannelSplitter(this); break;

        // === IMAGE TOOLS ===
        case 'image-cropper': openImageCropper(this); break;
        case 'image-resizer': openImageResizer(this); break;
        case 'image-compressor': openImageCompressor(this); break;
        case 'image-format-converter': openImageFormatConverter(this); break;
        case 'image-rotator': openImageRotator(this); break;
        case 'image-watermark-adder': openImageWatermarkAdder(this); break;
        case 'image-color-inverter': openImageColorInverter(this); break;
        case 'qr-code-generator': openQrCodeGenerator(this); break;
        case 'image-pixelator': openImagePixelator(this); break;
        case 'image-filter-effects': openImageFilterEffects(this); break;
        case 'image-background-remover': openImageBackgroundRemover(this); break;
        case 'image-denoiser': openImageDenoiser(this); break;
        case 'image-enhancer': openImageEnhancer(this); break;
        case 'image-metadata-viewer': openImageMetadataViewer(this); break;
        case 'image-batch-processor': openImageBatchProcessor(this); break;
        case 'image-collage-maker': openImageCollageMaker(this); break;
        case 'image-overlay-tool': openImageOverlayTool(this); break;

        // === VIDEO TOOLS ===
        case 'video-speed-changer': openVideoSpeedChanger(this); break;
        case 'frame-extractor': openFrameExtractor(this); break;

        // === DOCUMENT TOOLS ===
        case 'text-to-pdf-converter': openTextToPdfConverter(this); break;

        // === UTILITY TOOLS ===
        case 'barcode-generator': openBarcodeGenerator(this); break;
        case 'morse-code-converter': openMorseCodeConverter(this); break;
        case 'random-number-generator': openRandomNumberGenerator(this); break;
        case 'text-encryptor-decryptor': openTextEncryptorDecryptor(this); break;
        case 'uuid-generator': openUuidGenerator(this); break;
        case 'character-counter': openCharacterCounter(this); break;

        default:
          showToolContent(this, function(container) {
            container.innerHTML = `<h3>${toolName.replace(/-/g, ' ')}</h3><p>This tool is under development!</p>`;
          });
      }
    });
  });

  // -------------------------
  // AUDIO TOOLS IMPLEMENTATIONS
  function openAudioRecorder(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Audio Recorder</h3>
        <button id="ar_startBtn">Start Recording</button>
        <button id="ar_stopBtn" disabled>Stop Recording</button>
        <br><br>
        <audio id="ar_audioPlayback" controls></audio>
        <br>
        <a id="ar_downloadLink" href="#" download="recording.webm" style="display:none;">Download Recording</a>
      `;
      let mediaRecorder;
      let audioChunks = [];
      const startBtn = container.querySelector('#ar_startBtn');
      const stopBtn = container.querySelector('#ar_stopBtn');
      const audioPlayback = container.querySelector('#ar_audioPlayback');
      const downloadLink = container.querySelector('#ar_downloadLink');
      startBtn.addEventListener('click', async function() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.start();
          startBtn.disabled = true;
          stopBtn.disabled = false;
          audioChunks = [];
          mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
          });
          mediaRecorder.addEventListener('stop', () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            audioPlayback.src = audioUrl;
            downloadLink.href = audioUrl;
            downloadLink.style.display = 'inline';
          });
        } else {
          alert('Audio recording not supported in your browser.');
        }
      });
      stopBtn.addEventListener('click', function() {
        mediaRecorder.stop();
        startBtn.disabled = false;
        stopBtn.disabled = true;
      });
    });
  }

  function openAudioSpeedChanger(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Audio Speed Changer</h3>
        <input type="file" id="asc_audioFile" accept="audio/*">
        <br><br>
        <audio id="asc_audioPlayer" controls></audio>
        <br><br>
        <label for="asc_speedRange">Playback Speed:</label>
        <input type="range" id="asc_speedRange" min="0.5" max="2" step="0.1" value="1">
        <span id="asc_speedValue">1.0x</span>
      `;
      const fileInput = container.querySelector('#asc_audioFile');
      const audioPlayer = container.querySelector('#asc_audioPlayer');
      const speedRange = container.querySelector('#asc_speedRange');
      const speedValue = container.querySelector('#asc_speedValue');
      fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) { audioPlayer.src = URL.createObjectURL(file); }
      });
      speedRange.addEventListener('input', function() {
        const speed = parseFloat(this.value);
        audioPlayer.playbackRate = speed;
        speedValue.textContent = speed.toFixed(1) + 'x';
      });
    });
  }

  function openAudioCutter(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Audio Cutter</h3>
        <input type="file" id="ac_audioFile" accept="audio/*">
        <br><br>
        <label>Start Time (sec):</label>
        <input type="number" id="ac_start" value="0" step="0.1">
        <br><br>
        <label>End Time (sec):</label>
        <input type="number" id="ac_end" value="10" step="0.1">
        <br><br>
        <button id="ac_cutBtn">Cut Audio</button>
        <br><br>
        <audio id="ac_audioPlayer" controls></audio>
        <br>
        <a id="ac_downloadLink" href="#" download="cut_audio.wav" style="display:none;">Download Cut Audio</a>
      `;
      const fileInput = container.querySelector('#ac_audioFile');
      const startInput = container.querySelector('#ac_start');
      const endInput = container.querySelector('#ac_end');
      const cutBtn = container.querySelector('#ac_cutBtn');
      const audioPlayer = container.querySelector('#ac_audioPlayer');
      const downloadLink = container.querySelector('#ac_downloadLink');
      let audioBuffer;
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
          file.arrayBuffer().then(arrayBuffer => {
            audioContext.decodeAudioData(arrayBuffer, function(buffer) {
              audioBuffer = buffer;
            });
          });
        }
      });
      cutBtn.addEventListener('click', function() {
        if (!audioBuffer) return;
        const start = parseFloat(startInput.value);
        const end = parseFloat(endInput.value);
        const duration = end - start;
        if (duration <= 0 || start < 0 || end > audioBuffer.duration) {
          alert("Invalid times");
          return;
        }
        const numChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const frameCount = duration * sampleRate;
        const newBuffer = audioContext.createBuffer(numChannels, frameCount, sampleRate);
        for (let channel = 0; channel < numChannels; channel++) {
          const oldData = audioBuffer.getChannelData(channel);
          const newData = newBuffer.getChannelData(channel);
          newData.set(oldData.subarray(start * sampleRate, end * sampleRate));
        }
        function bufferToWav(buffer) {
          const numOfChan = buffer.numberOfChannels;
          const length = buffer.length * numOfChan * 2 + 44;
          const bufferArray = new ArrayBuffer(length);
          const view = new DataView(bufferArray);
          let pos = 0;
          function setUint16(data) { view.setUint16(pos, data, true); pos += 2; }
          function setUint32(data) { view.setUint32(pos, data, true); pos += 4; }
          setUint32(0x46464952);
          setUint32(length - 8);
          setUint32(0x45564157);
          setUint32(0x20746d66);
          setUint32(16);
          setUint16(1);
          setUint16(numOfChan);
          setUint32(buffer.sampleRate);
          setUint32(buffer.sampleRate * 2 * numOfChan);
          setUint16(numOfChan * 2);
          setUint16(16);
          setUint32(0x61746164);
          setUint32(length - pos - 4);
          const channels = [];
          for (let i = 0; i < numOfChan; i++) {
            channels.push(buffer.getChannelData(i));
          }
          let offset = 0;
          while (pos < length) {
            for (let i = 0; i < numOfChan; i++) {
              let sample = Math.max(-1, Math.min(1, channels[i][offset]));
              sample = (0.5 + sample * 0.5) * 0xFFFF;
              view.setUint16(pos, sample, true);
              pos += 2;
            }
            offset++;
          }
          return new Blob([view], { type: 'audio/wav' });
        }
        const wavBlob = bufferToWav(newBuffer);
        const url = URL.createObjectURL(wavBlob);
        audioPlayer.src = url;
        downloadLink.href = url;
        downloadLink.style.display = 'inline';
      });
    });
  }

  function openAudioJoiner(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Audio Joiner</h3>
        <input type="file" id="aj_audioFiles" accept="audio/*" multiple>
        <br><br>
        <button id="aj_joinBtn">Join Audio Files</button>
        <br><br>
        <audio id="aj_audioPlayer" controls></audio>
        <br>
        <a id="aj_downloadLink" href="#" download="joined_audio.wav" style="display:none;">Download Joined Audio</a>
      `;
      const fileInput = container.querySelector('#aj_audioFiles');
      const joinBtn = container.querySelector('#aj_joinBtn');
      const audioPlayer = container.querySelector('#aj_audioPlayer');
      const downloadLink = container.querySelector('#aj_downloadLink');
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      joinBtn.addEventListener('click', async function() {
        const files = fileInput.files;
        if (files.length < 2) { alert("Select at least 2 files"); return; }
        let buffers = [];
        for (let i = 0; i < files.length; i++) {
          const arrayBuffer = await files[i].arrayBuffer();
          const buffer = await audioContext.decodeAudioData(arrayBuffer);
          buffers.push(buffer);
        }
        const numChannels = buffers[0].numberOfChannels;
        let totalLength = buffers.reduce((sum, buf) => sum + buf.length, 0);
        const outputBuffer = audioContext.createBuffer(numChannels, totalLength, buffers[0].sampleRate);
        let offset = 0;
        buffers.forEach(buf => {
          for (let channel = 0; channel < numChannels; channel++) {
            outputBuffer.getChannelData(channel).set(buf.getChannelData(channel), offset);
          }
          offset += buf.length;
        });
        function bufferToWav(buffer) {
          const numOfChan = buffer.numberOfChannels;
          const length = buffer.length * numOfChan * 2 + 44;
          const bufferArray = new ArrayBuffer(length);
          const view = new DataView(bufferArray);
          let pos = 0;
          function setUint16(data) { view.setUint16(pos, data, true); pos += 2; }
          function setUint32(data) { view.setUint32(pos, data, true); pos += 4; }
          setUint32(0x46464952);
          setUint32(length - 8);
          setUint32(0x45564157);
          setUint32(0x20746d66);
          setUint32(16);
          setUint16(1);
          setUint16(numOfChan);
          setUint32(buffer.sampleRate);
          setUint32(buffer.sampleRate * 2 * numOfChan);
          setUint16(numOfChan * 2);
          setUint16(16);
          setUint32(0x61746164);
          setUint32(length - pos - 4);
          const channels = [];
          for(let i = 0; i < buffer.numberOfChannels; i++) {
            channels.push(buffer.getChannelData(i));
          }
          let offset = 0;
          while(pos < length) {
            for(let i = 0; i < numOfChan; i++) {
              let sample = Math.max(-1, Math.min(1, channels[i][offset]));
              sample = (0.5 + sample * 0.5) * 0xFFFF;
              view.setUint16(pos, sample, true);
              pos += 2;
            }
            offset++;
          }
          return new Blob([view], { type: 'audio/wav' });
        }
        const wavBlob = bufferToWav(outputBuffer);
        const url = URL.createObjectURL(wavBlob);
        audioPlayer.src = url;
        downloadLink.href = url;
        downloadLink.style.display = 'inline';
      });
    });
  }

  function openAudioConverter(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Audio Converter (to WAV)</h3>
        <input type="file" id="aconv_audioFile" accept="audio/*">
        <br><br>
        <button id="aconv_convertBtn">Convert to WAV</button>
        <br><br>
        <audio id="aconv_audioPlayer" controls></audio>
        <br>
        <a id="aconv_downloadLink" href="#" download="converted_audio.wav" style="display:none;">Download Converted Audio</a>
      `;
      const fileInput = container.querySelector('#aconv_audioFile');
      const convertBtn = container.querySelector('#aconv_convertBtn');
      const audioPlayer = container.querySelector('#aconv_audioPlayer');
      const downloadLink = container.querySelector('#aconv_downloadLink');
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      convertBtn.addEventListener('click', async function() {
        const file = fileInput.files[0];
        if (!file) return;
        const arrayBuffer = await file.arrayBuffer();
        const buffer = await audioContext.decodeAudioData(arrayBuffer);
        function bufferToWav(buffer) {
          const numOfChan = buffer.numberOfChannels;
          const length = buffer.length * numOfChan * 2 + 44;
          const bufferArray = new ArrayBuffer(length);
          const view = new DataView(bufferArray);
          let pos = 0;
          function setUint16(data) { view.setUint16(pos, data, true); pos += 2; }
          function setUint32(data) { view.setUint32(pos, data, true); pos += 4; }
          setUint32(0x46464952);
          setUint32(length - 8);
          setUint32(0x45564157);
          setUint32(0x20746d66);
          setUint32(16);
          setUint16(1);
          setUint16(numOfChan);
          setUint32(buffer.sampleRate);
          setUint32(buffer.sampleRate * 2 * numOfChan);
          setUint16(numOfChan * 2);
          setUint16(16);
          setUint32(0x61746164);
          setUint32(length - pos - 4);
          const channels = [];
          for(let i = 0; i < buffer.numberOfChannels; i++){
            channels.push(buffer.getChannelData(i));
          }
          let offset = 0;
          while(pos < length) {
            for(let i = 0; i < numOfChan; i++){
              let sample = Math.max(-1, Math.min(1, channels[i][offset]));
              sample = (0.5 + sample * 0.5) * 0xFFFF;
              view.setUint16(pos, sample, true);
              pos += 2;
            }
            offset++;
          }
          return new Blob([view], { type: 'audio/wav' });
        }
        const wavBlob = bufferToWav(buffer);
        const url = URL.createObjectURL(wavBlob);
        audioPlayer.src = url;
        downloadLink.href = url;
        downloadLink.style.display = 'inline';
      });
    });
  }

  function openAudioEqualizer(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Audio Equalizer</h3>
        <input type="file" id="ae_audioFile" accept="audio/*">
        <br><br>
        <audio id="ae_audioPlayer" controls></audio>
        <br><br>
        <label>Bass Gain: <input type="range" id="ae_bass" min="-20" max="20" value="0"></label>
        <br><br>
        <label>Treble Gain: <input type="range" id="ae_treble" min="-20" max="20" value="0"></label>
        <br><br>
        <button id="ae_applyBtn">Apply Equalizer</button>
      `;
      const fileInput = container.querySelector('#ae_audioFile');
      const audioPlayer = container.querySelector('#ae_audioPlayer');
      const bassSlider = container.querySelector('#ae_bass');
      const trebleSlider = container.querySelector('#ae_treble');
      const applyBtn = container.querySelector('#ae_applyBtn');
      let audioContext, source, bassFilter, trebleFilter;
      fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) { audioPlayer.src = URL.createObjectURL(file); }
      });
      applyBtn.addEventListener('click', function() {
        if (!audioPlayer.src) return;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        source = audioContext.createMediaElementSource(audioPlayer);
        bassFilter = audioContext.createBiquadFilter();
        bassFilter.type = "lowshelf";
        bassFilter.frequency.value = 200;
        bassFilter.gain.value = parseFloat(bassSlider.value);
        trebleFilter = audioContext.createBiquadFilter();
        trebleFilter.type = "highshelf";
        trebleFilter.frequency.value = 3000;
        trebleFilter.gain.value = parseFloat(trebleSlider.value);
        source.connect(bassFilter);
        bassFilter.connect(trebleFilter);
        trebleFilter.connect(audioContext.destination);
        audioPlayer.play();
      });
    });
  }

  function openAudioNormalizer(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Audio Normalizer</h3>
        <input type="file" id="an_audioFile" accept="audio/*">
        <br><br>
        <audio id="an_audioPlayer" controls></audio>
        <br><br>
        <label>Gain: <input type="range" id="an_gain" min="0" max="2" step="0.1" value="1"></label>
      `;
      const fileInput = container.querySelector('#an_audioFile');
      const audioPlayer = container.querySelector('#an_audioPlayer');
      const gainSlider = container.querySelector('#an_gain');
      let audioContext, source, gainNode;
      fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) { audioPlayer.src = URL.createObjectURL(file); }
      });
      gainSlider.addEventListener('input', function() {
        const gainValue = parseFloat(this.value);
        if (gainNode) { gainNode.gain.value = gainValue; }
      });
      audioPlayer.addEventListener('play', function() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        source = audioContext.createMediaElementSource(audioPlayer);
        gainNode = audioContext.createGain();
        gainNode.gain.value = parseFloat(gainSlider.value);
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
      });
    });
  }

  function openAudioChannelSplitter(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Audio Channel Splitter</h3>
        <input type="file" id="acs_audioFile" accept="audio/*">
        <br><br>
        <button id="acs_splitBtn">Split Channels</button>
        <br><br>
        <audio id="acs_leftChannel" controls></audio>
        <br><br>
        <audio id="acs_rightChannel" controls></audio>
      `;
      const fileInput = container.querySelector('#acs_audioFile');
      const splitBtn = container.querySelector('#acs_splitBtn');
      const leftAudio = container.querySelector('#acs_leftChannel');
      const rightAudio = container.querySelector('#acs_rightChannel');
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      let audioBuffer;
      fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) {
          file.arrayBuffer().then(arrayBuffer => {
            audioContext.decodeAudioData(arrayBuffer, function(buffer) {
              audioBuffer = buffer;
            });
          });
        }
      });
      splitBtn.addEventListener('click', function() {
        if (!audioBuffer) return;
        const leftChannel = audioBuffer.getChannelData(0);
        const rightChannel = audioBuffer.numberOfChannels > 1 ? audioBuffer.getChannelData(1) : leftChannel;
        const newBuffer = audioContext.createBuffer(1, audioBuffer.length, audioBuffer.sampleRate);
        newBuffer.copyToChannel(leftChannel, 0);
        function bufferToWav(buffer) {
          const numOfChan = buffer.numberOfChannels;
          const length = buffer.length * numOfChan * 2 + 44;
          const bufferArray = new ArrayBuffer(length);
          const view = new DataView(bufferArray);
          let pos = 0;
          function setUint16(data) { view.setUint16(pos, data, true); pos += 2; }
          function setUint32(data) { view.setUint32(pos, data, true); pos += 4; }
          setUint32(0x46464952);
          setUint32(length - 8);
          setUint32(0x45564157);
          setUint32(0x20746d66);
          setUint32(16);
          setUint16(1);
          setUint16(numOfChan);
          setUint32(buffer.sampleRate);
          setUint32(buffer.sampleRate * 2 * numOfChan);
          setUint16(numOfChan * 2);
          setUint16(16);
          setUint32(0x61746164);
          setUint32(length - pos - 4);
          const channels = [];
          for(let i = 0; i < buffer.numberOfChannels; i++) {
            channels.push(buffer.getChannelData(i));
          }
          let offset = 0;
          while(pos < length) {
            for(let i = 0; i < numOfChan; i++) {
              let sample = Math.max(-1, Math.min(1, channels[i][offset]));
              sample = (0.5 + sample * 0.5) * 0xFFFF;
              view.setUint16(pos, sample, true);
              pos += 2;
            }
            offset++;
          }
          return new Blob([view], { type: 'audio/wav' });
        }
        const leftWav = bufferToWav(newBuffer);
        leftAudio.src = URL.createObjectURL(leftWav);
        const newBufferRight = audioContext.createBuffer(1, audioBuffer.length, audioBuffer.sampleRate);
        newBufferRight.copyToChannel(rightChannel, 0);
        const rightWav = bufferToWav(newBufferRight);
        rightAudio.src = URL.createObjectURL(rightWav);
      });
    });
  }

  // ====================
  // IMAGE TOOLS IMPLEMENTATIONS
  function openImageCropper(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Image Cropper</h3>
        <input type="file" id="ic_imageInput" accept="image/*">
        <br><br>
        <canvas id="ic_canvas" style="max-width:100%; border:1px solid #ccc;"></canvas>
        <br><br>
        <label>X: <input type="number" id="ic_cropX" value="0"></label>
        <label>Y: <input type="number" id="ic_cropY" value="0"></label>
        <label>Width: <input type="number" id="ic_cropWidth" value="100"></label>
        <label>Height: <input type="number" id="ic_cropHeight" value="100"></label>
        <br><br>
        <button id="ic_cropBtn">Crop Image</button>
        <br><br>
        <img id="ic_croppedResult" alt="Cropped Image" style="max-width:100%;">
      `;
      let image = new Image();
      const imageInput = container.querySelector('#ic_imageInput');
      const canvas = container.querySelector('#ic_canvas');
      const ctx = canvas.getContext('2d');
      imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            image.onload = function() {
              canvas.width = image.width;
              canvas.height = image.height;
              ctx.drawImage(image, 0, 0);
              container.querySelector('#ic_cropWidth').value = image.width;
              container.querySelector('#ic_cropHeight').value = image.height;
            }
            image.src = e.target.result;
          }
          reader.readAsDataURL(file);
        }
      });
      container.querySelector('#ic_cropBtn').addEventListener('click', function() {
        const x = parseInt(container.querySelector('#ic_cropX').value);
        const y = parseInt(container.querySelector('#ic_cropY').value);
        const width = parseInt(container.querySelector('#ic_cropWidth').value);
        const height = parseInt(container.querySelector('#ic_cropHeight').value);
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCanvas.width = width;
        croppedCanvas.height = height;
        croppedCtx.drawImage(canvas, x, y, width, height, 0, 0, width, height);
        container.querySelector('#ic_croppedResult').src = croppedCanvas.toDataURL();
      });
    });
  }

  function openImageResizer(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Image Resizer</h3>
        <input type="file" id="ir_imageInput" accept="image/*">
        <br><br>
        <canvas id="ir_canvas" style="max-width:100%; border:1px solid #ccc;"></canvas>
        <br><br>
        <label>New Width: <input type="number" id="ir_newWidth"></label>
        <label>New Height: <input type="number" id="ir_newHeight"></label>
        <br><br>
        <button id="ir_resizeBtn">Resize Image</button>
        <br><br>
        <img id="ir_resizedResult" alt="Resized Image" style="max-width:100%;">
      `;
      let image = new Image();
      const imageInput = container.querySelector('#ir_imageInput');
      const canvas = container.querySelector('#ir_canvas');
      const ctx = canvas.getContext('2d');
      imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            image.onload = function() {
              canvas.width = image.width;
              canvas.height = image.height;
              ctx.drawImage(image, 0, 0);
              container.querySelector('#ir_newWidth').value = image.width;
              container.querySelector('#ir_newHeight').value = image.height;
            }
            image.src = e.target.result;
          }
          reader.readAsDataURL(file);
        }
      });
      container.querySelector('#ir_resizeBtn').addEventListener('click', function() {
        const newWidth = parseInt(container.querySelector('#ir_newWidth').value);
        const newHeight = parseInt(container.querySelector('#ir_newHeight').value);
        const resizedCanvas = document.createElement('canvas');
        const resizedCtx = resizedCanvas.getContext('2d');
        resizedCanvas.width = newWidth;
        resizedCanvas.height = newHeight;
        resizedCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, newWidth, newHeight);
        container.querySelector('#ir_resizedResult').src = resizedCanvas.toDataURL();
      });
    });
  }

  function openImageCompressor(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Image Compressor</h3>
        <input type="file" id="icomp_imageInput" accept="image/*">
        <br><br>
        <canvas id="icomp_canvas" style="max-width:100%; border:1px solid #ccc;"></canvas>
        <br><br>
        <label for="icomp_qualityRange">Quality (0.1 to 1.0):</label>
        <input type="range" id="icomp_qualityRange" min="0.1" max="1" step="0.1" value="0.8">
        <span id="icomp_qualityValue">0.8</span>
        <br><br>
        <button id="icomp_compressBtn">Compress Image</button>
        <br><br>
        <img id="icomp_compressedResult" alt="Compressed Image" style="max-width:100%;">
      `;
      const qualityRange = container.querySelector('#icomp_qualityRange');
      const qualityValue = container.querySelector('#icomp_qualityValue');
      qualityRange.addEventListener('input', function() {
        qualityValue.textContent = this.value;
      });
      let image = new Image();
      const imageInput = container.querySelector('#icomp_imageInput');
      const canvas = container.querySelector('#icomp_canvas');
      const ctx = canvas.getContext('2d');
      imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            image.onload = function() {
              canvas.width = image.width;
              canvas.height = image.height;
              ctx.drawImage(image, 0, 0);
            }
            image.src = e.target.result;
          }
          reader.readAsDataURL(file);
        }
      });
      container.querySelector('#icomp_compressBtn').addEventListener('click', function() {
        const quality = parseFloat(qualityRange.value);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        container.querySelector('#icomp_compressedResult').src = compressedDataUrl;
      });
    });
  }

  function openImageFormatConverter(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Image Format Converter</h3>
        <input type="file" id="ifc_imageInput" accept="image/*">
        <br><br>
        <canvas id="ifc_canvas" style="max-width:100%; border:1px solid #ccc;"></canvas>
        <br><br>
        <label for="ifc_formatSelect">Output Format:</label>
        <select id="ifc_formatSelect">
          <option value="image/png">PNG</option>
          <option value="image/jpeg">JPEG</option>
        </select>
        <br><br>
        <button id="ifc_convertBtn">Convert Format</button>
        <br><br>
        <img id="ifc_convertedResult" alt="Converted Image" style="max-width:100%;">
      `;
      let image = new Image();
      const imageInput = container.querySelector('#ifc_imageInput');
      const canvas = container.querySelector('#ifc_canvas');
      const ctx = canvas.getContext('2d');
      imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            image.onload = function() {
              canvas.width = image.width;
              canvas.height = image.height;
              ctx.drawImage(image, 0, 0);
            }
            image.src = e.target.result;
          }
          reader.readAsDataURL(file);
        }
      });
      container.querySelector('#ifc_convertBtn').addEventListener('click', function() {
        const format = container.querySelector('#ifc_formatSelect').value;
        const dataUrl = canvas.toDataURL(format);
        container.querySelector('#ifc_convertedResult').src = dataUrl;
      });
    });
  }

  function openImageRotator(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Image Rotator</h3>
        <input type="file" id="ir_imageInput" accept="image/*">
        <br><br>
        <label for="ir_angleInput">Rotation Angle (degrees):</label>
        <input type="number" id="ir_angleInput" value="0">
        <br><br>
        <button id="ir_rotateBtn">Rotate Image</button>
        <br><br>
        <canvas id="ir_canvas" style="max-width:100%; border:1px solid #ccc;"></canvas>
        <br><br>
        <img id="ir_rotatedResult" alt="Rotated Image" style="max-width:100%;">
      `;
      let image = new Image();
      const imageInput = container.querySelector('#ir_imageInput');
      const canvas = container.querySelector('#ir_canvas');
      const ctx = canvas.getContext('2d');
      imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            image.onload = function() {
              canvas.width = image.width;
              canvas.height = image.height;
              ctx.drawImage(image, 0, 0);
            }
            image.src = e.target.result;
          }
          reader.readAsDataURL(file);
        }
      });
      container.querySelector('#ir_rotateBtn').addEventListener('click', function() {
        const angle = parseFloat(container.querySelector('#ir_angleInput').value) * Math.PI / 180;
        const offscreenCanvas = document.createElement('canvas');
        const offscreenCtx = offscreenCanvas.getContext('2d');
        const sin = Math.abs(Math.sin(angle));
        const cos = Math.abs(Math.cos(angle));
        offscreenCanvas.width = image.width * cos + image.height * sin;
        offscreenCanvas.height = image.width * sin + image.height * cos;
        offscreenCtx.translate(offscreenCanvas.width / 2, offscreenCanvas.height / 2);
        offscreenCtx.rotate(angle);
        offscreenCtx.drawImage(image, -image.width / 2, -image.height / 2);
        container.querySelector('#ir_rotatedResult').src = offscreenCanvas.toDataURL();
      });
    });
  }

  function openImageWatermarkAdder(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Image Watermark Adder</h3>
        <input type="file" id="iwa_imageInput" accept="image/*">
        <br><br>
        <label for="iwa_watermarkText">Watermark Text:</label>
        <input type="text" id="iwa_watermarkText" placeholder="Enter watermark">
        <br><br>
        <button id="iwa_addBtn">Add Watermark</button>
        <br><br>
        <canvas id="iwa_canvas" style="max-width:100%; border:1px solid #ccc;"></canvas>
        <br><br>
        <img id="iwa_result" alt="Watermarked Image" style="max-width:100%;">
      `;
      let image = new Image();
      const imageInput = container.querySelector('#iwa_imageInput');
      const canvas = container.querySelector('#iwa_canvas');
      const ctx = canvas.getContext('2d');
      imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            image.onload = function() {
              canvas.width = image.width;
              canvas.height = image.height;
              ctx.drawImage(image, 0, 0);
            }
            image.src = e.target.result;
          }
          reader.readAsDataURL(file);
        }
      });
      container.querySelector('#iwa_addBtn').addEventListener('click', function() {
        const watermark = container.querySelector('#iwa_watermarkText').value;
        ctx.drawImage(image, 0, 0);
        ctx.font = "30px Arial";
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.textAlign = "right";
        ctx.fillText(watermark, canvas.width - 10, canvas.height - 10);
        container.querySelector('#iwa_result').src = canvas.toDataURL();
      });
    });
  }

  function openImageColorInverter(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Image Color Inverter</h3>
        <input type="file" id="ici_imageInput" accept="image/*">
        <br><br>
        <canvas id="ici_canvas" style="max-width:100%; border:1px solid #ccc;"></canvas>
        <br><br>
        <button id="ici_invertBtn">Invert Colors</button>
        <br><br>
        <img id="ici_result" alt="Inverted Image" style="max-width:100%;">
      `;
      const imageInput = container.querySelector('#ici_imageInput');
      const canvas = container.querySelector('#ici_canvas');
      const ctx = canvas.getContext('2d');
      let image = new Image();
      imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            image.onload = function() {
              canvas.width = image.width;
              canvas.height = image.height;
              ctx.drawImage(image, 0, 0);
            }
            image.src = e.target.result;
          }
          reader.readAsDataURL(file);
        }
      });
      container.querySelector('#ici_invertBtn').addEventListener('click', function() {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];
          data[i+1] = 255 - data[i+1];
          data[i+2] = 255 - data[i+2];
        }
        ctx.putImageData(imageData, 0, 0);
        container.querySelector('#ici_result').src = canvas.toDataURL();
      });
    });
  }

  function openQrCodeGenerator(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>QR Code Generator</h3>
        <label for="qr_text">Enter text or URL:</label>
        <input type="text" id="qr_text" style="width:80%;">
        <button id="qr_generateBtn">Generate QR Code</button>
        <div id="qr_code" style="margin-top:10px;"></div>
      `;
      container.querySelector('#qr_generateBtn').addEventListener('click', function() {
        const text = container.querySelector('#qr_text').value;
        const qrDiv = container.querySelector('#qr_code');
        qrDiv.innerHTML = '';
        if (text.trim() !== '') {
          new QRCode(qrDiv, {
            text: text,
            width: 128,
            height: 128
          });
        }
      });
    });
  }

  function openImagePixelator(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Image Pixelator</h3>
        <input type="file" id="ip_imageInput" accept="image/*">
        <br><br>
        <label for="ip_pixelSize">Pixel Size:</label>
        <input type="number" id="ip_pixelSize" value="10">
        <br><br>
        <canvas id="ip_canvas" style="max-width:100%; border:1px solid #ccc;"></canvas>
        <br><br>
        <img id="ip_result" alt="Pixelated Image" style="max-width:100%;">
      `;
      const imageInput = container.querySelector('#ip_imageInput');
      const pixelSizeInput = container.querySelector('#ip_pixelSize');
      const canvas = container.querySelector('#ip_canvas');
      const ctx = canvas.getContext('2d');
      let image = new Image();
      imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            image.onload = function() {
              canvas.width = image.width;
              canvas.height = image.height;
              ctx.drawImage(image, 0, 0);
            }
            image.src = e.target.result;
          }
          reader.readAsDataURL(file);
        }
      });
      function pixelate() {
        const pixelSize = parseInt(pixelSizeInput.value);
        if (!pixelSize || pixelSize <= 0) return;
        const width = canvas.width;
        const height = canvas.height;
        const offscreen = document.createElement('canvas');
        offscreen.width = width / pixelSize;
        offscreen.height = height / pixelSize;
        const offscreenCtx = offscreen.getContext('2d');
        offscreenCtx.drawImage(canvas, 0, 0, offscreen.width, offscreen.height);
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(offscreen, 0, 0, offscreen.width, offscreen.height, 0, 0, width, height);
        container.querySelector('#ip_result').src = canvas.toDataURL();
      }
      pixelSizeInput.addEventListener('change', pixelate);
      pixelSizeInput.addEventListener('input', pixelate);
    });
  }

  function openImageFilterEffects(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Image Filter & Effects</h3>
        <input type="file" id="ife_imageInput" accept="image/*">
        <br><br>
        <canvas id="ife_canvas" style="max-width:100%; border:1px solid #ccc;"></canvas>
        <br><br>
        <button id="ife_grayscaleBtn">Apply Grayscale</button>
        <button id="ife_sepiaBtn">Apply Sepia</button>
        <br><br>
        <img id="ife_result" alt="Filtered Image" style="max-width:100%;">
      `;
      const imageInput = container.querySelector('#ife_imageInput');
      const canvas = container.querySelector('#ife_canvas');
      const ctx = canvas.getContext('2d');
      let image = new Image();
      imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            image.onload = function() {
              canvas.width = image.width;
              canvas.height = image.height;
              ctx.drawImage(image, 0, 0);
            }
            image.src = e.target.result;
          }
          reader.readAsDataURL(file);
        }
      });
      container.querySelector('#ife_grayscaleBtn').addEventListener('click', function() {
        const imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          let avg = (data[i] + data[i+1] + data[i+2]) / 3;
          data[i] = data[i+1] = data[i+2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);
        container.querySelector('#ife_result').src = canvas.toDataURL();
      });
      container.querySelector('#ife_sepiaBtn').addEventListener('click', function() {
        const imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          let red = data[i], green = data[i+1], blue = data[i+2];
          data[i] = red * 0.393 + green * 0.769 + blue * 0.189;
          data[i+1] = red * 0.349 + green * 0.686 + blue * 0.168;
          data[i+2] = red * 0.272 + green * 0.534 + blue * 0.131;
        }
        ctx.putImageData(imageData, 0, 0);
        container.querySelector('#ife_result').src = canvas.toDataURL();
      });
    });
  }

  function openImageBackgroundRemover(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Image Background Remover</h3>
        <input type="file" id="ibr_imageInput" accept="image/*">
        <br><br>
        <label>Key Color (hex):</label>
        <input type="text" id="ibr_keyColor" value="#ffffff">
        <br><br>
        <button id="ibr_removeBtn">Remove Background</button>
        <br><br>
        <canvas id="ibr_canvas" style="max-width:100%; border:1px solid #ccc;"></canvas>
        <br><br>
        <img id="ibr_result" alt="Background Removed" style="max-width:100%;">
      `;
      const imageInput = container.querySelector('#ibr_imageInput');
      const keyColorInput = container.querySelector('#ibr_keyColor');
      const removeBtn = container.querySelector('#ibr_removeBtn');
      const canvas = container.querySelector('#ibr_canvas');
      const ctx = canvas.getContext('2d');
      let image = new Image();
      imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            image.onload = function() {
              canvas.width = image.width;
              canvas.height = image.height;
              ctx.drawImage(image, 0, 0);
            }
            image.src = e.target.result;
          }
          reader.readAsDataURL(file);
        }
      });
      removeBtn.addEventListener('click', function() {
        const keyColor = keyColorInput.value.toLowerCase();
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for(let i=0; i<data.length; i+=4) {
          const r = data[i].toString(16).padStart(2, '0');
          const g = data[i+1].toString(16).padStart(2, '0');
          const b = data[i+2].toString(16).padStart(2, '0');
          const hex = '#' + r + g + b;
          if(hex === keyColor) { data[i+3] = 0; }
        }
        ctx.putImageData(imageData, 0, 0);
        container.querySelector('#ibr_result').src = canvas.toDataURL();
      });
    });
  }

  function openImageDenoiser(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Image Denoiser</h3>
        <input type="file" id="id_imageInput" accept="image/*">
        <br><br>
        <button id="id_denoiseBtn">Apply Denoise (Blur)</button>
        <br><br>
        <canvas id="id_canvas" style="max-width:100%; border:1px solid #ccc;"></canvas>
        <br><br>
        <img id="id_result" alt="Denoised Image" style="max-width:100%;">
      `;
      const imageInput = container.querySelector('#id_imageInput');
      const denoiseBtn = container.querySelector('#id_denoiseBtn');
      const canvas = container.querySelector('#id_canvas');
      const ctx = canvas.getContext('2d');
      let image = new Image();
      imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            image.onload = function() {
              canvas.width = image.width;
              canvas.height = image.height;
              ctx.drawImage(image, 0, 0);
            }
            image.src = e.target.result;
          }
          reader.readAsDataURL(file);
        }
      });
      denoiseBtn.addEventListener('click', function() {
        ctx.filter = 'blur(2px)';
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = 'none';
        container.querySelector('#id_result').src = canvas.toDataURL();
      });
    });
  }

  function openImageEnhancer(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Image Enhancer</h3>
        <input type="file" id="ie_imageInput" accept="image/*">
        <br><br>
        <label>Brightness (0-200%):</label>
        <input type="range" id="ie_brightness" min="0" max="200" value="100">
        <br><br>
        <label>Contrast (0-200%):</label>
        <input type="range" id="ie_contrast" min="0" max="200" value="100">
        <br><br>
        <button id="ie_applyBtn">Enhance Image</button>
        <br><br>
        <canvas id="ie_canvas" style="max-width:100%; border:1px solid #ccc;"></canvas>
        <br><br>
        <img id="ie_result" alt="Enhanced Image" style="max-width:100%;">
      `;
      const imageInput = container.querySelector('#ie_imageInput');
      const brightnessSlider = container.querySelector('#ie_brightness');
      const contrastSlider = container.querySelector('#ie_contrast');
      const applyBtn = container.querySelector('#ie_applyBtn');
      const canvas = container.querySelector('#ie_canvas');
      const ctx = canvas.getContext('2d');
      let image = new Image();
      imageInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            image.onload = function() {
              canvas.width = image.width;
              canvas.height = image.height;
              ctx.drawImage(image, 0, 0);
            }
            image.src = e.target.result;
          }
          reader.readAsDataURL(file);
        }
      });
      applyBtn.addEventListener('click', function() {
        const brightness = brightnessSlider.value;
        const contrast = contrastSlider.value;
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        ctx.filter = 'none';
        container.querySelector('#ie_result').src = canvas.toDataURL();
      });
    });
  }

  function openImageMetadataViewer(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Image Metadata Viewer</h3>
        <input type="file" id="imv_imageInput" accept="image/*">
        <br><br>
        <button id="imv_viewBtn">View Metadata</button>
        <br><br>
        <pre id="imv_result"></pre>
      `;
      const imageInput = container.querySelector('#imv_imageInput');
      const viewBtn = container.querySelector('#imv_viewBtn');
      const resultPre = container.querySelector('#imv_result');
      viewBtn.addEventListener('click', function() {
        const file = imageInput.files[0];
        if(file) {
          EXIF.getData(file, function() {
            const allMetaData = EXIF.getAllTags(this);
            resultPre.textContent = JSON.stringify(allMetaData, null, 2);
          });
        }
      });
    });
  }

  function openImageBatchProcessor(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Image Batch Processor (Resize to 800x600)</h3>
        <input type="file" id="ibp_imageInput" accept="image/*" multiple>
        <br><br>
        <button id="ibp_processBtn">Process Images</button>
        <br><br>
        <div id="ibp_results"></div>
      `;
      const fileInput = container.querySelector('#ibp_imageInput');
      const processBtn = container.querySelector('#ibp_processBtn');
      const resultsDiv = container.querySelector('#ibp_results');
      processBtn.addEventListener('click', function() {
        resultsDiv.innerHTML = '';
        const files = fileInput.files;
        for(let i = 0; i < files.length; i++){
          const file = files[i];
          const reader = new FileReader();
          reader.onload = function(e) {
            let img = new Image();
            img.onload = function() {
              let offscreen = document.createElement('canvas');
              offscreen.width = 800;
              offscreen.height = 600;
              let offscreenCtx = offscreen.getContext('2d');
              offscreenCtx.drawImage(img, 0, 0, offscreen.width, offscreen.height);
              let resultImg = document.createElement('img');
              resultImg.src = offscreen.toDataURL();
              resultImg.style.margin = "10px";
              resultsDiv.appendChild(resultImg);
            }
            img.src = e.target.result;
          }
          reader.readAsDataURL(file);
        }
      });
    });
  }

  function openImageCollageMaker(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Image Collage Maker</h3>
        <input type="file" id="icm_imageInput" accept="image/*" multiple>
        <br><br>
        <button id="icm_makeBtn">Make Collage</button>
        <br><br>
        <canvas id="icm_canvas" style="max-width:100%; border:1px solid #ccc;"></canvas>
        <br><br>
        <img id="icm_result" alt="Collage" style="max-width:100%;">
      `;
      const fileInput = container.querySelector('#icm_imageInput');
      const makeBtn = container.querySelector('#icm_makeBtn');
      const canvas = container.querySelector('#icm_canvas');
      const ctx = canvas.getContext('2d');
      const resultImg = container.querySelector('#icm_result');
      makeBtn.addEventListener('click', function() {
        const files = fileInput.files;
        if(files.length === 0) return;
        const images = [];
        let loaded = 0;
        for(let i = 0; i < files.length; i++){
          const reader = new FileReader();
          reader.onload = function(e){
            const img = new Image();
            img.onload = function(){
              images.push(img);
              loaded++;
              if(loaded === files.length){
                const cols = 2;
                const rows = Math.ceil(images.length / cols);
                canvas.width = cols * 200;
                canvas.height = rows * 200;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for(let j = 0; j < images.length; j++){
                  const x = (j % cols) * 200;
                  const y = Math.floor(j / cols) * 200;
                  ctx.drawImage(images[j], x, y, 200, 200);
                }
                resultImg.src = canvas.toDataURL();
              }
            }
            img.src = e.target.result;
          }
          reader.readAsDataURL(files[i]);
        }
      });
    });
  }

  function openImageOverlayTool(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Image Overlay Tool</h3>
        <label>Background Image:</label>
        <input type="file" id="io_background" accept="image/*">
        <br><br>
        <label>Overlay Image:</label>
        <input type="file" id="io_overlay" accept="image/*">
        <br><br>
        <label>Overlay Opacity:</label>
        <input type="range" id="io_opacity" min="0" max="1" step="0.1" value="0.5">
        <br><br>
        <button id="io_applyBtn">Apply Overlay</button>
        <br><br>
        <canvas id="io_canvas" style="max-width:100%; border:1px solid #ccc;"></canvas>
        <br><br>
        <img id="io_result" alt="Overlay Result" style="max-width:100%;">
      `;
      const bgInput = container.querySelector('#io_background');
      const overlayInput = container.querySelector('#io_overlay');
      const opacityInput = container.querySelector('#io_opacity');
      const applyBtn = container.querySelector('#io_applyBtn');
      const canvas = container.querySelector('#io_canvas');
      const ctx = canvas.getContext('2d');
      const resultImg = container.querySelector('#io_result');
      let bgImage = new Image(), overlayImage = new Image();
      bgInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            bgImage.onload = function() {
              canvas.width = bgImage.width;
              canvas.height = bgImage.height;
              ctx.drawImage(bgImage, 0, 0);
            }
            bgImage.src = e.target.result;
          }
          reader.readAsDataURL(file);
        }
      });
      overlayInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            overlayImage.onload = function() {};
            overlayImage.src = e.target.result;
          }
          reader.readAsDataURL(file);
        }
      });
      applyBtn.addEventListener('click', function() {
        ctx.drawImage(bgImage, 0, 0);
        ctx.globalAlpha = parseFloat(opacityInput.value);
        ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
        resultImg.src = canvas.toDataURL();
      });
    });
  }

  // ====================
  // VIDEO TOOLS IMPLEMENTATIONS
  function openVideoSpeedChanger(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Video Speed Changer</h3>
        <input type="file" id="vsc_videoFile" accept="video/*">
        <br><br>
        <video id="vsc_videoPlayer" controls style="max-width:100%;"></video>
        <br><br>
        <label for="vsc_speedRange">Playback Speed:</label>
        <input type="range" id="vsc_speedRange" min="0.5" max="2" step="0.1" value="1">
        <span id="vsc_speedValue">1.0x</span>
      `;
      const fileInput = container.querySelector('#vsc_videoFile');
      const videoPlayer = container.querySelector('#vsc_videoPlayer');
      const speedRange = container.querySelector('#vsc_speedRange');
      const speedValue = container.querySelector('#vsc_speedValue');
      fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) { videoPlayer.src = URL.createObjectURL(file); }
      });
      speedRange.addEventListener('input', function() {
        const speed = parseFloat(this.value);
        videoPlayer.playbackRate = speed;
        speedValue.textContent = speed.toFixed(1) + 'x';
      });
    });
  }

  function openFrameExtractor(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Frame Extractor</h3>
        <input type="file" id="fe_videoFile" accept="video/*">
        <br><br>
        <video id="fe_videoPlayer" controls style="max-width:100%;"></video>
        <br><br>
        <button id="fe_captureBtn">Capture Frame</button>
        <br><br>
        <canvas id="fe_canvas" style="display:none;"></canvas>
        <br><br>
        <img id="fe_result" alt="Captured Frame" style="max-width:100%;">
      `;
      const fileInput = container.querySelector('#fe_videoFile');
      const videoPlayer = container.querySelector('#fe_videoPlayer');
      const canvas = container.querySelector('#fe_canvas');
      const resultImg = container.querySelector('#fe_result');
      fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if(file) { videoPlayer.src = URL.createObjectURL(file); }
      });
      container.querySelector('#fe_captureBtn').addEventListener('click', function() {
        const context = canvas.getContext('2d');
        canvas.width = videoPlayer.videoWidth;
        canvas.height = videoPlayer.videoHeight;
        context.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
        resultImg.src = canvas.toDataURL();
      });
    });
  }

  // ====================
  // DOCUMENT TOOLS IMPLEMENTATIONS
  function openTextToPdfConverter(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Text to PDF Converter</h3>
        <label>Enter Text:</label><br>
        <textarea id="ttp_text" rows="10" cols="50"></textarea>
        <br><br>
        <button id="ttp_convertBtn">Convert to PDF</button>
        <br><br>
        <iframe id="ttp_pdf" style="width:100%; height:400px;"></iframe>
      `;
      container.querySelector('#ttp_convertBtn').addEventListener('click', function() {
        const text = container.querySelector('#ttp_text').value;
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        pdf.text(text, 10, 10);
        const pdfDataUri = pdf.output('datauristring');
        container.querySelector('#ttp_pdf').src = pdfDataUri;
      });
    });
  }

  // ====================
  // UTILITY TOOLS IMPLEMENTATIONS
  function openBarcodeGenerator(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Barcode Generator</h3>
        <label>Enter text:</label>
        <input type="text" id="bg_text" style="width:80%;">
        <button id="bg_generateBtn">Generate Barcode</button>
        <div id="bg_barcode" style="margin-top:10px;"></div>
      `;
      container.querySelector('#bg_generateBtn').addEventListener('click', function() {
        const text = container.querySelector('#bg_text').value;
        const barcodeDiv = container.querySelector('#bg_barcode');
        barcodeDiv.innerHTML = '';
        JsBarcode(barcodeDiv, text, { format: "CODE128", width: 2, height: 40 });
      });
    });
  }

  function openMorseCodeConverter(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Morse Code Converter</h3>
        <label>Enter text:</label>
        <input type="text" id="mc_text" style="width:80%;">
        <br><br>
        <button id="mc_toMorse">To Morse</button>
        <button id="mc_fromMorse">From Morse</button>
        <br><br>
        <textarea id="mc_result" rows="5" cols="50" readonly></textarea>
      `;
      const textInput = container.querySelector('#mc_text');
      const resultArea = container.querySelector('#mc_result');
      const toMorseBtn = container.querySelector('#mc_toMorse');
      const fromMorseBtn = container.querySelector('#mc_fromMorse');
      const morseMap = {
        'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.',
        'F': '..-.', 'G': '--.', 'H': '....', 'I': '..', 'J': '.---',
        'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---',
        'P': '.--.', 'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-',
        'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-', 'Y': '-.--',
        'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--',
        '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..',
        '9': '----.'
      };
      const reverseMorseMap = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]));
      toMorseBtn.addEventListener('click', function() {
        const text = textInput.value.toUpperCase();
        const morse = text.split('').map(ch => morseMap[ch] || (ch === ' ' ? '/' : '')).join(' ');
        resultArea.value = morse;
      });
      fromMorseBtn.addEventListener('click', function() {
        const morse = textInput.value.trim();
        const words = morse.split(' / ');
        const text = words.map(word => word.split(' ').map(code => reverseMorseMap[code] || '').join('')).join(' ');
        resultArea.value = text;
      });
    });
  }

  function openRandomNumberGenerator(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Random Number Generator</h3>
        <label>Min:</label>
        <input type="number" id="rng_min" value="1">
        <br><br>
        <label>Max:</label>
        <input type="number" id="rng_max" value="100">
        <br><br>
        <button id="rng_generateBtn">Generate</button>
        <br><br>
        <div id="rng_result"></div>
      `;
      const minInput = container.querySelector('#rng_min');
      const maxInput = container.querySelector('#rng_max');
      const generateBtn = container.querySelector('#rng_generateBtn');
      const resultDiv = container.querySelector('#rng_result');
      generateBtn.addEventListener('click', function() {
        const min = parseInt(minInput.value);
        const max = parseInt(maxInput.value);
        const rand = Math.floor(Math.random() * (max - min + 1)) + min;
        resultDiv.textContent = "Random Number: " + rand;
      });
    });
  }

  function openTextEncryptorDecryptor(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Text Encryptor & Decryptor (Caesar Cipher)</h3>
        <label>Enter Text:</label>
        <input type="text" id="ted_text" style="width:80%;">
        <br><br>
        <label>Shift:</label>
        <input type="number" id="ted_shift" value="3">
        <br><br>
        <button id="ted_encryptBtn">Encrypt</button>
        <button id="ted_decryptBtn">Decrypt</button>
        <br><br>
        <div id="ted_result"></div>
      `;
      const textInput = container.querySelector('#ted_text');
      const shiftInput = container.querySelector('#ted_shift');
      const encryptBtn = container.querySelector('#ted_encryptBtn');
      const decryptBtn = container.querySelector('#ted_decryptBtn');
      const resultDiv = container.querySelector('#ted_result');
      function caesarCipher(str, shift) {
        return str.split('').map(char => {
          if (char.match(/[a-z]/i)) {
            let code = char.charCodeAt(0);
            let lower = (code >= 97);
            let start = lower ? 97 : 65;
            return String.fromCharCode(((code - start + shift) % 26 + 26) % 26 + start);
          }
          return char;
        }).join('');
      }
      encryptBtn.addEventListener('click', function() {
        const shift = parseInt(shiftInput.value);
        resultDiv.textContent = "Encrypted: " + caesarCipher(textInput.value, shift);
      });
      decryptBtn.addEventListener('click', function() {
        const shift = parseInt(shiftInput.value);
        resultDiv.textContent = "Decrypted: " + caesarCipher(textInput.value, -shift);
      });
    });
  }

  function openUuidGenerator(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>UUID Generator</h3>
        <button id="ug_generateBtn">Generate UUID</button>
        <br><br>
        <div id="ug_result"></div>
      `;
      const generateBtn = container.querySelector('#ug_generateBtn');
      const resultDiv = container.querySelector('#ug_result');
      function generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      generateBtn.addEventListener('click', function() {
        resultDiv.textContent = generateUUID();
      });
    });
  }

  function openCharacterCounter(link) {
    showToolContent(link, function(container) {
      container.innerHTML = `
        <h3>Character Counter</h3>
        <label>Enter Text:</label>
        <textarea id="cc_text" rows="5" cols="50"></textarea>
        <br><br>
        <button id="cc_countBtn">Count</button>
        <br><br>
        <div id="cc_result"></div>
      `;
      const textArea = container.querySelector('#cc_text');
      const countBtn = container.querySelector('#cc_countBtn');
      const resultDiv = container.querySelector('#cc_result');
      countBtn.addEventListener('click', function() {
        const text = textArea.value;
        const charCount = text.length;
        const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
        resultDiv.textContent = `Characters: ${charCount}, Words: ${wordCount}`;
      });
    });
  }
});
