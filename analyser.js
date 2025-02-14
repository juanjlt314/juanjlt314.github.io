export class Analyser {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.analyser = audioContext.createAnalyser();
  }

  setInput(source) {
    source.connect(this.analyser);
  }

  getByteFrequencyData(dataArray) {
    this.analyser.getByteFrequencyData(dataArray);
  }

  set fftSize(size) {
    this.analyser.fftSize = size;
  }

  get frequencyBinCount() {
    return this.analyser.frequencyBinCount;
  }
}