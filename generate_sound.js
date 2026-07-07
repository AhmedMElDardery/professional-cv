const fs = require('fs');

const sampleRate = 44100;
const duration = 0.05; // seconds
const numSamples = Math.floor(sampleRate * duration);

const buffer = Buffer.alloc(44 + numSamples * 2);

// WAV header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + numSamples * 2, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // Subchunk1Size
buffer.writeUInt16LE(1, 20); // AudioFormat (PCM)
buffer.writeUInt16LE(1, 22); // NumChannels
buffer.writeUInt32LE(sampleRate, 24); // SampleRate
buffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate
buffer.writeUInt16LE(2, 32); // BlockAlign
buffer.writeUInt16LE(16, 34); // BitsPerSample
buffer.write('data', 36);
buffer.writeUInt32LE(numSamples * 2, 40);

// Audio data
let offset = 44;
for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 100);
    const freq = 800 - (600 * (i / numSamples));
    const val = Math.floor(envelope * Math.sin(2 * Math.PI * freq * t) * 32767);
    buffer.writeInt16LE(val, offset);
    offset += 2;
}

const b64 = buffer.toString('base64');
console.log(`data:audio/wav;base64,${b64}`);
