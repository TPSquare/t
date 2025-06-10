import { useVideoConfig } from "remotion";
import { useContext, useMemo } from "react";

import VideoContext from "./VideoContext";

const baseStyle = {
  position: "absolute",
  fontSize: "1.5em",
  opacity: 0.1,
  color: "white",
  fontWeight: "bold",
  fontFamily: "sans-serif",
};

const generateChangeMoments = (random, durationInFrames, fps) => {
  const minDistance = 20 * fps;
  const result = [];

  while (result.length < 5) {
    const candidate = random() * durationInFrames;
    const isFarEnough = result.every((value) => Math.abs(candidate - value) >= minDistance);
    if (isFarEnough) result.push(candidate);
    const maxPossibleRemaining = Math.floor(durationInFrames / minDistance);
    if (result.length >= maxPossibleRemaining) break;
  }
  return result.sort((a, b) => a - b);
};

const generateRandomPositions = (random, length) =>
  Array.from({ length: length + 1 }, () => {
    const horValue = Math.floor(random() * 50);
    const horSide = Math.floor(random() * 2) ? "left" : "right";
    const verValue = Math.floor(random() * 50);
    const verSide = Math.floor(random() * 2) ? "top" : "bottom";
    return { [verSide]: `${verValue}%`, [horSide]: `${horValue}%` };
  });

export default function Watermark({ currentFrame }) {
  const { durationInFrames, fps } = useVideoConfig();
  const { random } = useContext(VideoContext);

  const { changeFrames, changePositions } = useMemo(() => {
    const changeFrames = generateChangeMoments(random, durationInFrames, fps);
    const changePositions = generateRandomPositions(random, changeFrames.length);
    return { changeFrames, changePositions };
  }, [durationInFrames, fps]);

  const changeIndex = changeFrames.findIndex((f, i) => {
    const next = changeFrames[i + 1] ?? durationInFrames;
    return currentFrame >= f && currentFrame < next;
  });
  const currentIndex = changeIndex === -1 ? 0 : changeIndex;

  return <div style={{ ...baseStyle, ...changePositions[currentIndex] }}>© Made with KaraMuse</div>;
}
