import { create } from "zustand";
import { produce } from "immer";

import defaultProjectData from "@/configs/default-project-data";
import classifyingLyrics from "@/utilities/classifying-lyrics";

const useProjectData = create((set) => ({
  ...defaultProjectData,
  set: (updater) =>
    set(
      produce((draft) => {
        const value = typeof updater === "function" ? updater(draft) : updater;
        Object.keys(draft).forEach((key) => delete draft[key]);
        Object.assign(draft, value);
      }),
    ),
  update: (path, updater) =>
    set(
      produce((draft) => {
        const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".");
        let current = draft;
        for (let i = 0; i < parts.length - 1; i++) {
          const key = parts[i];
          if (!(key in current)) current[key] = isNaN(Number(parts[i + 1])) ? {} : [];
          current = current[key];
        }
        const lastKey = parts[parts.length - 1];
        if (typeof updater === "function") {
          const value = updater(current[lastKey]);
          if (value) current[lastKey] = value;
        } else if (updater === null) delete current[lastKey];
        else current[lastKey] = updater;

        if (path.startsWith("lyrics")) draft.classifiedLyrics = classifyingLyrics(draft.lyrics);
      }),
    ),
}));

export const useDuration = () => {
  const videoDuration = useProjectData(({ video }) => video.duration) || 0;
  const audioDuration = useProjectData(({ audio }) => audio.duration) || 0;
  return Math.max(videoDuration, audioDuration);
};

export const useDurationInFrames = () => {
  const duration = useDuration();
  const fps = useProjectData(({ fps }) => fps);
  if (duration === 0) return 1;
  return Math.floor(fps * duration);
};

export const useVideoInputProps = (options = { render: false }) => {
  const isRender = options.render;
  const projectData = useProjectData((state) => state);

  const inputProps = {
    seed: Math.floor(Math.random() * 1e9),
    videoBackgroundColor: projectData.videoBackgroundColor,
    classifiedLyrics: projectData.classifiedLyrics,
    lyricsStyle: projectData.lyricsStyle,
    countdown: projectData.countdown,
    reflexDuration: projectData.reflexDuration,
  };

  if (Boolean(projectData.audio.url))
    inputProps.audio = isRender
      ? { buffer: projectData.audio.buffer }
      : { url: projectData.audio.url };

  if (Boolean(projectData.video.url)) {
    const videoSource = isRender
      ? { buffer: projectData.video.buffer }
      : { url: projectData.video.url };
    inputProps.video = { duration: projectData.video.duration, ...videoSource };
  }

  if (Boolean(projectData.image.url)) inputProps.image = { url: projectData.image.url };

  return inputProps;
};

export default useProjectData;
