import { useContext, useMemo } from "react";
import { interpolate, useVideoConfig } from "remotion";

import VideoContext from "../VideoContext";

export default function FadeInOut({ children, start, end, style, currentFrame }) {
  if (currentFrame < start || currentFrame > end) return null;
  const { reflexDuration } = useContext(VideoContext);
  const { fps } = useVideoConfig();
  const timing = useMemo(() => reflexDuration * fps, [fps, reflexDuration]);
  const fadeIn = interpolate(currentFrame, [start, start + timing], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(currentFrame, [end - timing / 2, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(fadeIn, fadeOut);
  return <div style={{ opacity, ...style }}>{children}</div>;
}
