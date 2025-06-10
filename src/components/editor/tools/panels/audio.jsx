import { useRef, useEffect } from "react";
import Wrapper from "./Wrapper";
import getMetadata from "@/utilities/get-metadata";
import useProjectData from "@/store/projectData";
import fileToArrayBuffer from "@/utilities/file-to-array-buffer";

function ImportButton({ onImport }) {
  const inputRef = useRef();
  const audioBlobUrl = useProjectData(({ audio }) => audio.url);

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = async ({ target }) => {
    const file = target.files[0];
    if (!file) return;

    try {
      const metadata = (await getMetadata(file)).audio;
      const buffer = await fileToArrayBuffer(file);
      const blobUrl = URL.createObjectURL(file);

      if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl);

      onImport({
        filename: file.name,
        type: file.type,
        url: blobUrl,
        duration: metadata.Duration,
        bitrate: Math.floor(metadata.BitRate / 1000),
        buffer,
      });
    } catch (err) {
      alert("Failed to import audio!");
    }
  };

  useEffect(() => {
    return () => {
      if (audioBlobUrl) URL.revokeObjectURL(audioBlobUrl);
    };
  }, []);

  return (
    <>
      <button className="rounded-md bg-[var(--highlight-color)] px-2 font-medium text-[var(--in-highlight-color)]" onClick={handleClick} type="button" title="Import audio">
        Import Audio
      </button>
      <input ref={inputRef} type="file" accept="audio/*" className="hidden" onChange={handleFileChange} title="Audio input" />
    </>
  );
}

function AudioInfo() {
  const { filename, bitrate } = useProjectData(({ audio }) => audio);
  if (!filename) return <p>Not imported yet.</p>;
  return (
    <>
      <p>Filename: {filename}</p>
      <p>Bitrate: {bitrate} kbps</p>
    </>
  );
}

export default function AudioPanel({ panelKey, activeKey }) {
  const updateProjectData = useProjectData(({ update }) => update);

  const handleImport = ({ filename, url, duration, bitrate, buffer, type }) => updateProjectData("audio", { filename, url, duration, buffer, bitrate, type });

  return (
    <Wrapper className="flex h-full w-full flex-col p-4 text-sm" panelKey={panelKey} activeKey={activeKey}>
      <div className="text-center">
        <ImportButton onImport={handleImport} />
      </div>
      <div className="pt-2 text-[var(--foreground-color)]">
        <AudioInfo />
      </div>
    </Wrapper>
  );
}
