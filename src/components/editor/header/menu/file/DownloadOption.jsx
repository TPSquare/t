import { useRef, useCallback } from "react";

import { Option } from "../options";
import useProjectData from "@/store/projectData";

const EXT = process.env.NEXT_PUBLIC_PROJECT_EXTENSION;

export default function DownloadOption() {
  const projectData = useProjectData((state) => state);
  const aRef = useRef();

  const handleDownloadData = useCallback(() => {
    const a = aRef.current;
    if (!a) return;

    const data = { ...projectData };
    if (data.video.url) URL.revokeObjectURL(data.video.url);
    if (data.audio.url) URL.revokeObjectURL(data.audio.url);
    data.video = structuredClone(projectData.video);
    data.audio = structuredClone(projectData.audio);
    delete data.video.url;
    delete data.audio.url;
    const json = JSON.stringify(data);

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    a.href = url;
    a.click();

    URL.revokeObjectURL(url);
  }, [projectData]);

  return (
    <>
      <a ref={aRef} href="" title="Download data" download={`${projectData.name}.${EXT}`} className="hidden"></a>
      <Option onClick={handleDownloadData} closeMenuOnClick>
        Download project
      </Option>
    </>
  );
}
