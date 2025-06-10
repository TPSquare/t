import { interpolate } from "remotion";

import { generateLyricsTextShadow } from "../../../../../utilities/generate-text-shadow";

export default function KaraokeWord({ children, start, end, lyricsStyle, currentFrame }) {
  const progress = interpolate(currentFrame, [start, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outlineWidth = lyricsStyle.outlineWidth / 20;
  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{ color: lyricsStyle.static.color, textShadow: generateLyricsTextShadow(lyricsStyle.outlineWidth, lyricsStyle.static.outlineColor) }}>{children}</span>
      <span style={{ position: "absolute", top: "0", left: "0", clipPath: `inset(0 ${100 - progress * 100}% 0 0)`, padding: `${outlineWidth}em`, margin: `-${outlineWidth}em` }}>
        <span style={{ color: lyricsStyle.active.color, textShadow: generateLyricsTextShadow(lyricsStyle.outlineWidth, lyricsStyle.active.outlineColor) }}>{children}</span>
      </span>
    </span>
  );
}
