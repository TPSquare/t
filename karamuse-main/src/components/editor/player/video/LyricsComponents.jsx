import { Fragment, useContext } from "react";

import FadeInOut from "./transitions/FadeInOut";
import KaraokeWord from "./transitions/KaraokeWord";
import VideoContext from "./VideoContext";
import Countdown from "./Countdown";

const KaraokeWordList = ({ lyrics, timing, currentFrame }) => {
  const words = lyrics.split(" ");
  const { lyricsStyle } = useContext(VideoContext);

  return words.map((word, i) => {
    const { start, end } = timing[i];
    return (
      <Fragment key={i}>
        <KaraokeWord start={start} end={end} lyricsStyle={lyricsStyle} currentFrame={currentFrame}>
          {word}
        </KaraokeWord>
        <span>&nbsp;</span>
      </Fragment>
    );
  });
};

const LyricLine = ({ line, side, index, currentFrame }) => {
  const { lyrics, timing, start, end, index: lyricsIndex } = line;
  const { lyricsStyle, countdown } = useContext(VideoContext);
  return (
    <FadeInOut key={index} start={start} end={end} style={{ position: "absolute", [side]: 0, top: 0, fontFamily: lyricsStyle.fontFamily }} currentFrame={currentFrame}>
      {countdown.indexes.includes(lyricsIndex) && <Countdown start={start} firstWordStart={timing[0].start} currentFrame={currentFrame} />}
      <KaraokeWordList lyrics={lyrics} timing={timing} currentFrame={currentFrame} />
    </FadeInOut>
  );
};

const LyricsBlock = ({ rows, side, index, currentFrame }) => (
  <div style={{ position: "relative", marginInline: "2em" }} key={index}>
    <span style={{ opacity: "0" }}>|</span>
    {rows.map((line, i) => (
      <LyricLine key={i} line={line} side={side} index={i} currentFrame={currentFrame} />
    ))}
  </div>
);

export default function LyricsComponents({ classifiedLyrics, currentFrame }) {
  const { lyricsStyle } = useContext(VideoContext);
  return (
    <div style={{ position: "absolute", bottom: "1.5em", width: "100%", fontSize: `${lyricsStyle.fontSize}em`, fontWeight: lyricsStyle.fontWeight }}>
      {classifiedLyrics.map((rows, k) => {
        const side = k % 2 === 0 ? "left" : "right";
        return <LyricsBlock key={k} rows={rows} side={side} index={k} currentFrame={currentFrame} />;
      })}
    </div>
  );
}
