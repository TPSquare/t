import { useCallback, useEffect, useState } from "react";

import Button from "./Button";

export default function FullscreenButton({ playerWrapperRef }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const current = playerWrapperRef.current;
    if (!current) return;
    const onFullscreenChange = () => setIsFullscreen(document.fullscreenElement !== null);
    current.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      current.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, []);

  const handleClick = useCallback(() => {
    const current = playerWrapperRef.current;
    if (!current) return;
    if (isFullscreen) document.exitFullscreen();
    else current.requestFullscreen();
  }, [isFullscreen]);

  return <Button onClick={handleClick} icon={isFullscreen ? "faCompress" : "faExpand"} title="Fullscreen" />;
}
