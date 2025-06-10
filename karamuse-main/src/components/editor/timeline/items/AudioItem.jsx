import { useEffect, useRef, useMemo, useContext } from "react";

import Item from "./Item";
import useProjectData from "@/store/projectData";
import TimelineContext from "../TimelineContext";

export default function AudioItem({ startFrame, audioData }) {
  const fps = useProjectData(({ fps }) => fps);
  const { convertFramesToPixels } = useContext(TimelineContext);

  const itemRef = useRef(null);
  const canvasRef = useRef(null);

  const canvasBarWidth = useMemo(() => convertFramesToPixels(1), [convertFramesToPixels]);
  const durationInFrames = useMemo(() => audioData.duration * fps, [audioData.duration, fps]);

  const name = useMemo(() => {
    const filename = audioData.filename || "";
    const lastDot = filename.lastIndexOf(".");
    return lastDot !== -1 ? filename.substring(0, lastDot) : filename;
  }, [audioData.filename]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const item = itemRef.current;
    if (!audioData.url || !item || !canvas) return;

    const canvasCtx = canvas.getContext("2d");
    if (!canvasCtx) return;

    const fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--highlight-color").trim();

    canvas.width = convertFramesToPixels(durationInFrames);
    canvas.height = item.clientHeight / 2;
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.fillStyle = fillStyle;

    let cancelled = false;

    const drawWaveform = async () => {
      try {
        const response = await fetch(audioData.url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await new AudioContext().decodeAudioData(arrayBuffer);

        if (cancelled) return;

        const rawData = audioBuffer.getChannelData(0);
        const samples = durationInFrames;
        const blockSize = Math.floor(rawData.length / samples);
        const waveform = [];

        for (let i = 0; i < samples; i++) {
          let sum = 0;
          for (let j = 0; j < blockSize; j++) sum += Math.abs(rawData[i * blockSize + j]);
          const avg = sum / blockSize;
          if (!isNaN(avg)) waveform.push(avg);
        }

        const max = Math.max(...waveform);
        waveform.forEach((value, index) => {
          const scaledHeight = (value / max) * canvas.height;
          const x = index * canvasBarWidth;
          const y = canvas.height - scaledHeight;
          canvasCtx.fillRect(x, y, canvasBarWidth, scaledHeight);
        });
      } catch (error) {
        console.warn("Failed to draw waveform!");
      }
    };

    drawWaveform();

    return () => {
      cancelled = true;
    };
  }, [audioData, durationInFrames, canvasBarWidth, convertFramesToPixels]);

  return (
    <Item ref={itemRef} type="audio" name={name} startFrame={startFrame} durationInFrames={durationInFrames}>
      <canvas ref={canvasRef} className="absolute bottom-0" />
    </Item>
  );
}
