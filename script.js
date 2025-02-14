import { Analyser } from './analyser.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let analyser;
let bufferLength;
let dataArray;

async function init() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);

    analyser = new Analyser(audioContext);
    analyser.setInput(source);
    analyser.fftSize = 2048;  // Increased for better resolution
    bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);
    
    resizeCanvas();
    visualize();
  } catch (err) {
    console.error("Error accessing microphone:", err);
    alert("Microphone access denied! Please allow microphone access to use this feature.");
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.8;
  canvas.height = window.innerHeight * 0.6;
}

function visualize() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  analyser.getByteFrequencyData(dataArray);

  const barWidth = (canvas.width / bufferLength) * 2.5;
  let barHeight;
  let x = 0;

  // Calculate center for mirrored effect
  const centerY = canvas.height / 2;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = dataArray[i];

    // Improved color and visual style - Vibrant gradient
    const hue = i / bufferLength * 360;
    const saturation = 80 + (barHeight / 255) * 20; // Vary saturation based on height
    const lightness = 50 + (barHeight / 255) * 10;  // Vary lightness based on height

    ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    // Mirrored bars with subtle gradient
    const gradient = ctx.createLinearGradient(x, centerY - barHeight / 2, x, centerY + barHeight / 2);
    gradient.addColorStop(0, `hsl(${hue}, ${saturation}%, ${lightness - 5}%)`);
    gradient.addColorStop(0.5, `hsl(${hue}, ${saturation}%, ${lightness + 10}%)`);
    gradient.addColorStop(1, `hsl(${hue}, ${saturation}%, ${lightness - 5}%)`);
    ctx.fillStyle = gradient;

    ctx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight / 2); // Top half
    ctx.fillRect(x, centerY, barWidth, barHeight / 2); // Bottom half, mirrored

    x += barWidth + 1;
  }

  requestAnimationFrame(visualize);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  visualize(); // Re-draw the visualization after resize
});

init();