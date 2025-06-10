import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

import Wrapper from "./Wrapper";
import useProjectData, { useDurationInFrames } from "@/store/projectData";
import { countdownLyricsHandling } from "@/utilities/countdown-lyrics-handlers";

const Words = ({ words }) =>
  words.map((word, idx) => (
    <span className="pointer-events-none" key={idx}>
      {word}&nbsp;
    </span>
  ));

const LyricLines = ({ onSelectLine, isRecording }) => {
  const lyricsData = useProjectData(({ lyrics }) => lyrics);
  return lyricsData.map((data, idx) => (
    <div key={idx} className="cursor-pointer rounded-sm px-1 hover:text-white" onClick={() => !isRecording && onSelectLine(idx)}>
      <Words words={data.lyrics.split(" ")} />
    </div>
  ));
};

const StartRecordButton = forwardRef(({ onClick }, ref) => {
  const buttonRef = useRef();

  useImperativeHandle(ref, () => ({
    setDisabled: (disabled) => {
      buttonRef.current.disabled = disabled;
      buttonRef.current.style.backgroundColor = disabled ? "var(--disable-color)" : "var(--highlight-color)";
      buttonRef.current.style.color = disabled ? "var(--in-disable-color)" : "var(--in-highlight-color)";
      buttonRef.current.style.cursor = disabled ? "not-allowed" : null;
    },
    setInnerText: (text) => (buttonRef.current.innerText = text),
  }));

  return (
    <button ref={buttonRef} className="rounded-sm px-2 text-sm font-medium before:content-[var(--content)]" onClick={onClick} type="button" title="Start / Stop recording">
      Start
    </button>
  );
});

export default function RecordPanel({ panelKey, activeKey, playerRef, configOverlayRef, playerOverlayRef, toolsHeaderOverlayRef }) {
  const fps = useProjectData(({ fps }) => fps);
  const updateProjectData = useProjectData(({ update }) => update);
  const lyricsData = useProjectData(({ lyrics }) => lyrics);
  const durationInFrames = useDurationInFrames();
  const reflexDuration = useProjectData(({ reflexDuration }) => reflexDuration);
  const countdownConfig = useProjectData(({ countdown }) => countdown);

  const lyricsContainerRef = useRef(null);
  const lyricsWrapperRef = useRef(null);
  const startButtonRef = useRef(null);

  const [isRecording, setRecording] = useState(false);
  const [selectedLineIndex, setSelectedLineIndex] = useState(-1);

  const bonusTimingConstant = 0.1;
  const allowForTimingConstant = 0.1;
  const [bonusTiming, allowForTiming] = useMemo(() => [Math.floor(fps * bonusTimingConstant), Math.floor(fps * allowForTimingConstant)], [fps]);
  const timingDataRef = useRef([]);
  const timingDataStartIndexRef = useRef(null);

  const cleanupKeyListeners = useRef(() => {});

  const highlightSelectedLine = useCallback(
    (idx) => {
      const wrapper = lyricsWrapperRef.current;
      const container = lyricsContainerRef.current;
      if (!wrapper || !container) return;

      const current = wrapper.querySelector("[data-selected]");
      if (current) {
        current.removeAttribute("data-selected");
        current.style.removeProperty("text-decoration");
      }
      if (idx < 0) return;

      const next = wrapper.childNodes[idx];
      next.setAttribute("data-selected", true);
      next.style.textDecoration = "underline";

      if (isRecording) {
        const { clientHeight, scrollTop } = container;
        const { offsetTop } = next;
        const scrollOptions = { left: 0, behavior: "smooth" };
        if (offsetTop - scrollTop > clientHeight / 2) scrollOptions.top = offsetTop - clientHeight / 2;
        container.scrollTo(scrollOptions);
      }
    },
    [isRecording],
  );

  useEffect(() => {
    highlightSelectedLine(selectedLineIndex);
  }, [highlightSelectedLine, selectedLineIndex]);

  const setWordRecorded = (target, recorded) => {
    if (recorded) target.style.color = "var(--record-timesetted)";
    else target.style.removeProperty("color");
  };

  useEffect(() => {
    const wrapper = lyricsWrapperRef.current;
    if (!wrapper) return;
    for (let lineIndex = 0; lineIndex < lyricsData.length; lineIndex++) {
      const recorded = Boolean(lyricsData[lineIndex].timing);
      for (const word of wrapper.childNodes[lineIndex].childNodes) setWordRecorded(word, recorded);
    }
  }, [lyricsData]);

  useEffect(() => {
    const player = playerRef.current;
    const button = startButtonRef.current;
    if (!player || !button) return;

    const onPlay = () => {
      if (isRecording) return;
      button.setDisabled(true);
    };
    const onPause = () => button.setDisabled(false);

    button.setDisabled(false);
    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);
    return () => {
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
    };
  }, [isRecording]);

  const stopRecording = useCallback(() => {
    cleanupKeyListeners.current();

    const wrapper = lyricsWrapperRef.current;
    const player = playerRef.current;
    if (!wrapper || !player) return;

    const data = timingDataRef.current;
    if (data.length) {
      updateProjectData("lyrics", (prev) => {
        const newData = [...prev];
        for (let i = timingDataStartIndexRef.current; i < data.length; i++) {
          const line = data[i];
          if (!line?.length) continue;
          const lineObj = prev[i];
          const prevLineObjInLine = newData[i - 2];
          newData[i] = {
            ...lineObj,
            timing: line,
            start: Math.max(line[0].start - Math.floor(reflexDuration * 4 * fps), prevLineObjInLine?.end + 1 || 0),
            end: Math.min(line[line.length - 1].end + Math.floor(reflexDuration * fps), durationInFrames),
          };

          if (line.length !== lineObj.lyrics.split(" ").length) {
            delete newData[i].timing;
            for (const word of wrapper.childNodes[i].childNodes) setWordRecorded(word, false);
          }
        }
        return countdownLyricsHandling(newData, countdownConfig, reflexDuration, fps);
      });
      timingDataRef.current = [];
    }

    setRecording(false);
    setSelectedLineIndex(-1);
    player.pause();
    if (startButtonRef.current) startButtonRef.current.setInnerText("Start");
    playerOverlayRef.current?.hide();
    configOverlayRef.current?.hide();
    toolsHeaderOverlayRef.current?.hide();
  }, [durationInFrames]);

  const startRecording = useCallback(() => {
    const wrapper = lyricsWrapperRef.current;
    const player = playerRef.current;
    const container = lyricsContainerRef.current;
    if (!wrapper || !player || !container) return;

    const lines = wrapper.childNodes;
    let currentLineIndex = selectedLineIndex >= 0 ? selectedLineIndex : lyricsData.findIndex((l) => !l.timing);
    if (currentLineIndex < 0) currentLineIndex = 0;

    let currentLine = lines[currentLineIndex];
    let words = currentLine.childNodes;
    let wordIdx = 0;
    let currentWord = words[wordIdx];
    let wordData = {};

    timingDataRef.current = [];
    timingDataRef.current[currentLineIndex] = [];
    timingDataStartIndexRef.current = currentLineIndex;

    let timingExisted = !!lyricsData[currentLineIndex].timing;
    let isKeyDown = false;

    const onKeyDown = (e) => {
      if (e.key !== "Enter" || isKeyDown) return;
      isKeyDown = true;

      if (timingExisted) {
        for (const w of words) setWordRecorded(w, false);
        timingExisted = false;
      }

      setWordRecorded(currentWord, true);
      const offsetLeft = currentWord.offsetLeft;
      const clientWidth = container.clientWidth;
      if (offsetLeft > clientWidth * 0.8) container.scrollTo({ left: offsetLeft - clientWidth / 2, behavior: "smooth" });

      wordData.start = player.getCurrentFrame() - bonusTiming - allowForTiming;

      const prev = wordIdx > 0 ? [currentLineIndex, wordIdx - 1] : timingDataRef.current[currentLineIndex - 1]?.length ? [currentLineIndex - 1, timingDataRef.current[currentLineIndex - 1].length - 1] : null;

      if (prev) {
        const [i, j] = prev;
        if (timingDataRef.current[i][j].end >= wordData.start) timingDataRef.current[i][j].end = wordData.start - 1;
      }
    };

    const onKeyUp = (e) => {
      if (e.key !== "Enter") return;
      isKeyDown = false;

      wordData.end = player.getCurrentFrame() + bonusTiming - allowForTiming;
      timingDataRef.current[currentLineIndex].push(wordData);
      wordData = {};

      if (++wordIdx >= words.length) {
        if (++currentLineIndex >= lines.length) return stopRecording();

        currentLine = lines[currentLineIndex];
        words = currentLine.childNodes;
        wordIdx = 0;
        currentWord = words[0];

        timingDataRef.current[currentLineIndex] = [];
        timingExisted = !!lyricsData[currentLineIndex].timing;
        setSelectedLineIndex(currentLineIndex);
      } else {
        currentWord = words[wordIdx];
      }
    };

    cleanupKeyListeners.current = () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    setRecording(true);
    setSelectedLineIndex(currentLineIndex);
    player.play();
    if (startButtonRef.current) startButtonRef.current.setInnerText("Stop");
    playerOverlayRef.current?.show();
    configOverlayRef.current?.show();
    toolsHeaderOverlayRef.current?.show();
  }, [lyricsData, selectedLineIndex, bonusTiming, stopRecording]);

  const startButtonHandleClick = useCallback(() => (isRecording ? stopRecording() : startRecording()), [isRecording, startRecording, stopRecording]);

  useEffect(() => () => stopRecording(), [stopRecording]);

  useEffect(() => {
    if (lyricsData.length === 0) startButtonRef.current.setDisabled(true);
    else startButtonRef.current.setDisabled(false);
  }, [lyricsData]);

  return (
    <Wrapper className="flex h-full w-full flex-col space-y-1 p-2" {...{ panelKey, activeKey }}>
      <div ref={lyricsContainerRef} className="custom-scrollbar relative flex-1 overflow-auto rounded-[var(--layout-rounded)] bg-[var(--input-background-color)] text-sm text-[var(--foreground-color)]">
        <div className="absolute top-0 left-0 w-full rounded-[inherit] p-2">
          <div ref={lyricsWrapperRef}>
            <LyricLines isRecording={isRecording} onSelectLine={setSelectedLineIndex} />
          </div>
        </div>
      </div>
      <div className="text-right">
        <StartRecordButton ref={startButtonRef} onClick={startButtonHandleClick} />
      </div>
    </Wrapper>
  );
}
