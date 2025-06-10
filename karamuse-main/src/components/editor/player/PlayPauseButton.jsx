import { useCallback, useEffect, useState } from "react";

import Button from "./Button";

export default function PlayPauseButton({ playerRef }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const current = playerRef.current;
    setPlaying(current?.isPlaying() ?? false);
    if (!current) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    current.addEventListener("play", onPlay);
    current.addEventListener("pause", onPause);
    return () => {
      current.removeEventListener("play", onPlay);
      current.removeEventListener("pause", onPause);
    };
  }, []);

  const handleToggle = () => playerRef.current?.toggle();

  return <Button onClick={handleToggle} icon={playing ? "faPause" : "faPlay"} title="Play / Pause" />;
}
