import { useCallback, useEffect, useMemo, useState } from "react";

import useProjectData, { useDurationInFrames, useVideoInputProps } from "@/store/projectData";
import createApiUrl from "@/utilities/create-api-url";
import formatTime from "@/utilities/format-time";
import renderOptions from "@/configs/render-options";
import CircleLoader from "@/components/loaders/Circle";
import Modal from "@/components/Modal";
import { HighlightButton } from "./buttons";

const ModalExportButton = ({ handleRender }) => {
  return (
    <button className="pb rounded-sm bg-[var(--highlight-color)] px-2 text-sm font-medium text-[var(--in-highlight-color)]" onClick={handleRender} type="button" title="Export">
      Export
    </button>
  );
};

const SelectWrapper = ({ title, defaultValue, setValue, children }) => {
  const handleChange = useCallback(({ target }) => setValue(target.value), []);
  return (
    <div className="flex items-center space-x-2">
      <span>{title}</span>
      <div className="rounded-sm bg-[var(--input-background-color)] px-1 py-0.5">
        <select className="bg-[inherit] pl-1" title={title} defaultValue={defaultValue} name={title.toLowerCase()} onChange={handleChange}>
          {children}
        </select>
      </div>
    </div>
  );
};

const SelectOption = ({ value, text }) => {
  return <option value={value}>{text}</option>;
};

export default function ExportController() {
  const durationInFrames = useDurationInFrames();
  const projectName = useProjectData(({ name }) => name);
  const fps = useProjectData(({ fps }) => fps);
  const videoInputProps = useVideoInputProps({ render: true });

  const [resultVideoUrl, setResultVideoUrl] = useState(null);
  const [activePanel, setActivePanel] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => {
    setIsOpen(true);
    setActivePanel("config");
  };
  const closeModal = () => {
    if (activePanel === "render") return;
    setIsOpen(false);
    if (resultVideoUrl) {
      setResultVideoUrl(null);
      URL.revokeObjectURL(resultVideoUrl);
    }
  };

  const filename = useMemo(() => `${projectName}.mp4`, [projectName]);
  const [resolution, setResolution] = useState(720);

  const fetchApi = useCallback(async () => {
    const query = { width: Math.round((resolution * 16) / 9), height: resolution, fps, durationInFrames };
    const url = createApiUrl("/api/render", query);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(videoInputProps),
    });

    if (!response.ok) {
      alert("Have an error!");
      throw new Error("Have an error!");
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
  }, [videoInputProps, resolution, durationInFrames]);

  const handleRender = useCallback(async () => {
    setActivePanel("render");
    const videoUrl = await fetchApi();
    setResultVideoUrl(videoUrl);
    setActivePanel("result");
  }, [fetchApi]);

  useEffect(() => {
    return () => {
      if (resultVideoUrl) URL.revokeObjectURL(resultVideoUrl);
    };
  }, [resultVideoUrl]);

  return (
    <>
      <HighlightButton onClick={openModal}>Export</HighlightButton>
      <Modal overlayClassName="z-999 bg-[#000000aa] flex" className="inset-none static z-1000 m-auto rounded-lg bg-[var(--brighter-layout-background-color)] px-4 py-2 text-[var(--foreground-color)]" title="Export" isOpen={isOpen} onRequestClose={closeModal}>
        <div style={{ display: activePanel !== "config" ? "none" : null }}>
          <div className="mb-2 rounded-md bg-[var(--layout-background-color)] px-8 py-4 text-sm">
            <SelectWrapper title="Resolution" defaultValue={resolution} setValue={setResolution}>
              {renderOptions.resolution.map((p) => (
                <SelectOption value={p} text={`${p}p`} key={p} />
              ))}
            </SelectWrapper>
          </div>
          <div className="flex items-center justify-end space-x-8">
            <span className="text-sm">Duration: {formatTime(durationInFrames, fps)}</span>
            <ModalExportButton handleRender={handleRender} />
          </div>
        </div>
        <div style={{ display: activePanel !== "render" ? "none" : null }}>
          <div className="flex items-center space-x-2 rounded-md bg-[var(--layout-background-color)] px-8 py-4 text-sm">
            <span>{filename}</span>
            <CircleLoader className="w-6 stroke-[var(--highlight-color)]" />
          </div>
        </div>
        <div style={{ display: activePanel !== "result" ? "none" : null }}>
          <div className="space-y-2 rounded-md bg-[var(--layout-background-color)] px-8 py-4 text-sm">
            <video width="427" height="240" autoPlay loop src={resultVideoUrl}></video>
            <div className="flex justify-end space-x-2">
              <span>{filename}</span>
              <a className="rounded-sm bg-[var(--highlight-color)] px-2 text-sm font-medium text-[var(--in-highlight-color)]" href={resultVideoUrl} download={filename}>
                Download
              </a>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
