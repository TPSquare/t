export default function formatTime(frame, fps) {
  const totalSeconds = Math.floor(frame / fps);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const frames = frame % fps;
  const pad = (n) => n.toString().padStart(2, "0");
  return `${hours ? pad(hours) + ":" : ""}${pad(minutes)}:${pad(seconds)}.${pad(frames)}`;
}
