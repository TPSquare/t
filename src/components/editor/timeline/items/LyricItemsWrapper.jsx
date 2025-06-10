import { useMemo, useRef, useState, useEffect, useContext } from "react";

import Item from "./Item";
import useProjectData from "@/store/projectData";
import TimelineContext from "../TimelineContext";

export default function LyricItemsWrapper({ wordsData, lyricsIndex, startFrame, endFrame }) {
  const updateProjectData = useProjectData(({ update }) => update);
  const { setConfigActive } = useContext(TimelineContext);

  const itemRef = useRef();
  const [localStartFrame, setLocalStartFrame] = useState(startFrame);
  useEffect(() => setLocalStartFrame(startFrame), [startFrame]);

  const items = useMemo(() => {
    return wordsData.map((data, wordIndex) => {
      const { text, start, end } = data;
      const relativeStart = start - localStartFrame;
      const relativeDuration = end - start;

      const handleResizeFrames = (newStart, newDuration) => updateProjectData(`lyrics[${lyricsIndex}].timing[${wordIndex}]`, { start: newStart + startFrame, end: newStart + newDuration + startFrame });

      return <Item key={`${text}-${start}`} startFrame={relativeStart} durationInFrames={relativeDuration} onResizeFrames={handleResizeFrames} type="lyric" name={text} />;
    });
  }, [wordsData, localStartFrame]);

  const handleResizeFrames = (newStart, newDuration) =>
    updateProjectData("lyrics", (draftLyrics) => {
      draftLyrics[lyricsIndex].start = newStart;
      draftLyrics[lyricsIndex].end = newStart + newDuration;
    });

  const handleResize = (newStart) => setLocalStartFrame(newStart);

  const handleClick = () => setConfigActive({ key: "lyrics", lyricsIndex });

  return (
    <Item ref={itemRef} startFrame={startFrame} durationInFrames={endFrame - startFrame} attributes={{ "data-lyrics-index": String(lyricsIndex) }} type="lyrics-wrapper" onResizeFrames={handleResizeFrames} onResize={handleResize} onClick={handleClick}>
      {items}
    </Item>
  );
}
