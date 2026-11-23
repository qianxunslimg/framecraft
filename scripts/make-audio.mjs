// Original deterministic electronic beat. No downloaded music or API keys.
import { writeFileSync, mkdirSync } from "node:fs";
const rate = 44100;
const seconds = 18;
const samples = new Float64Array(rate * seconds);
const tau = 2 * Math.PI;
const beat = 0.4;
const notes = [
  220, 261.6256, 329.6276, 391.9954, 440, 391.9954, 329.6276, 261.6256,
];
for (let b = 0; b < seconds / beat; b++) {
  const start = Math.round(b * beat * rate);
  for (let j = 0; j < rate * beat && start + j < samples.length; j++) {
    const t = j / rate;
    const kick =
      b % 2 === 0
        ? Math.sin(tau * (48 * t + (16 * (1 - Math.exp(-t * 30))) / 30)) *
          Math.exp(-t * 16) *
          0.22
        : 0;
    const note = notes[b % notes.length];
    const pluck =
      (Math.sin(tau * note * t) + 0.25 * Math.sin(tau * note * 2 * t)) *
      Math.exp(-t * 9) *
      Math.min(t * 200, 1) *
      0.12;
    const noise = Math.sin(j * 127.1 + b * 311.7) * Math.sin(j * 87.3);
    const hat = noise * Math.exp(-t * 85) * 0.055;
    samples[start + j] += kick + pluck + hat;
  }
}
// A short rising chime emphasizes each scene change.
for (const startSec of [0.1, 4.4, 8.8, 13.8]) {
  const start = Math.round(startSec * rate);
  for (let j = 0; j < rate * 0.55 && start + j < samples.length; j++) {
    const t = j / rate;
    samples[start + j] +=
      Math.sin(tau * (660 * t + 330 * t * t)) *
      Math.sin((Math.PI * t) / 0.55) *
      Math.exp(-t * 4) *
      0.12;
  }
}
const data = Buffer.alloc(samples.length * 2);
for (let i = 0; i < samples.length; i++) {
  const t = i / rate;
  const fade = Math.min(1, t / 0.08, Math.max(0, (seconds - t) / 0.9));
  data.writeInt16LE(
    Math.round(Math.max(-1, Math.min(1, samples[i] * fade)) * 32767),
    i * 2,
  );
}
const header = Buffer.alloc(44);
header.write("RIFF");
header.writeUInt32LE(data.length + 36, 4);
header.write("WAVE", 8);
header.write("fmt ", 12);
header.writeUInt32LE(16, 16);
header.writeUInt16LE(1, 20);
header.writeUInt16LE(1, 22);
header.writeUInt32LE(rate, 24);
header.writeUInt32LE(rate * 2, 28);
header.writeUInt16LE(2, 32);
header.writeUInt16LE(16, 34);
header.write("data", 36);
header.writeUInt32LE(data.length, 40);
mkdirSync(new URL("../public/idea-to-motion/owned/", import.meta.url), {
  recursive: true,
});
writeFileSync(
  new URL("../public/idea-to-motion/owned/motion-beat.wav", import.meta.url),
  Buffer.concat([header, data]),
);
console.log(`Created ${seconds}s original soundtrack`);
