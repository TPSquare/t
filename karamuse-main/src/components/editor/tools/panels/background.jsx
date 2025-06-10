import { useRef, useEffect } from "react";

import Wrapper from "./Wrapper";
import useProjectData from "@/store/projectData";
import getMetadata from "@/utilities/get-metadata";
import fileToArrayBuffer from "@/utilities/file-to-array-buffer";
import convertToDataUrl from "@/utilities/convert-to-data-url";
import defaultProjectData from "@/configs/default-project-data";

const ImportButton = ({ onImport }) => {
  const inputRef = useRef();
  const videoBlobUrl = useProjectData(({ video }) => video.url);

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = async ({ target }) => {
    const file = target.files[0];
    if (!file) return;
    if (videoBlobUrl) URL.revokeObjectURL(videoBlobUrl);
    if (file.type.startsWith("video"))
      try {
        const blobUrl = URL.createObjectURL(file);
        const buffer = await fileToArrayBuffer(file);
        const metadata = (await getMetadata(file)).video;
        onImport({
          type: file.type,
          filename: file.name,
          url: blobUrl,
          duration: metadata.Duration,
          bitrate: Math.floor(metadata.BitRate / 1e3),
          encoder: metadata.Encoded_Library_Name,
          resolution: { width: metadata.Width, height: metadata.Height },
          buffer,
        });
      } catch (err) {
        alert("Failed to import video!");
      }
    else
      try {
        const dataUrl = await convertToDataUrl(file);
        const metadata = (await getMetadata(file)).image;
        onImport({
          type: file.type,
          filename: file.name,
          url: dataUrl,
          resolution: { width: metadata.Width, height: metadata.Height },
        });
      } catch (err) {
        alert("Failed to import image!");
      }
  };

  useEffect(() => {
    return () => {
      if (videoBlobUrl) URL.revokeObjectURL(videoBlobUrl);
    };
  }, []);

  return (
    <>
      <button className="h-full rounded-md bg-[var(--highlight-color)] px-2 font-medium text-[var(--in-highlight-color)]" onClick={handleClick} type="button" title="Import background">
        <span>Import background</span>
      </button>
      <input ref={inputRef} type="file" accept="video/*,image/*" className="hidden" onChange={handleFileChange} placeholder="Input" title="Input" />
    </>
  );
};

const BackgroundInfo = () => {
  const videoData = useProjectData(({ video }) => video);
  const imageData = useProjectData(({ image }) => image);
  const { filename, bitrate, encoder, resolution } = Object.assign({}, videoData, imageData);

  if (!filename) return <p>Not imported yet.</p>;
  return (
    <>
      <p>Filename: {filename}</p>
      {bitrate && <p>Bitrate: {bitrate} kbps</p>}
      {encoder && <p>Encoder: {encoder}</p>}
      <p>
        Resolution: {resolution.width} x {resolution.height}
      </p>
    </>
  );
};

export default function BackgroundPanel({ panelKey, activeKey }) {
  const updateProjectData = useProjectData(({ update }) => update);

  const handleImport = ({ type, filename, url, duration, bitrate, encoder, resolution, buffer }) => {
    if (type.startsWith("video")) {
      updateProjectData("image", defaultProjectData.image);
      updateProjectData("video", { filename, type, url, duration, buffer, bitrate, encoder, resolution });
    } else {
      updateProjectData("image", { filename, type, url, resolution });
      updateProjectData("video", defaultProjectData.video);
    }
  };

  return (
    <Wrapper className="flex h-full w-full flex-col p-4 text-sm" panelKey={panelKey} activeKey={activeKey}>
      <div className="text-center">
        <ImportButton onImport={handleImport} />
      </div>
      <div className="pt-2 text-[var(--foreground-color)]">
        <BackgroundInfo />
      </div>
    </Wrapper>
  );
}
