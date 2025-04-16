const audioFileInput = document.getElementById('audioFile');
let audioContext, analyser, dataArray;

export function setupAudio(audioFileInput) {
  audioFileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const audio = new Audio(e.target.result);
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioSource = audioContext.createMediaElementSource(audio);
        analyser = audioContext.createAnalyser();
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        audio.play();
      };
      reader.readAsDataURL(file);
    }
  });
}

export { analyser, dataArray }; 