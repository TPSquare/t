export const countdownLyricsHandling = (lyrics, countdown, reflexDuration, fps) => {
  const reflexDurationInFrames = reflexDuration * fps;
  const countdownDurationInFrames = countdown.duration * fps;
  return [...lyrics].map((line) => {
    if (!line.timing || !countdown.indexes.includes(line.index) || line.hasCountdown) return line;
    line.hasCountdown = true;
    const firstWordStart = line.timing[0].start;
    const remainingSpace = firstWordStart - line.start - reflexDurationInFrames;
    if (remainingSpace < countdownDurationInFrames)
      line.start = Math.max(firstWordStart - countdownDurationInFrames - reflexDurationInFrames, 0);
    return line;
  });
};
