import { useRef } from "react";

import { Option } from "../options";
import useProjectData from "@/store/projectData";
import arrayBufferToBlob from "@/utilities/array-buffer-to-blob";

const EXT = process.env.NEXT_PUBLIC_PROJECT_EXTENSION;

export default function OpenOption() {
  const fileInputRef = useRef(null);
  const setProjectData = useProjectData(({ set }) => set);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ({ target }) => {
      try {
        const result = target?.result;
        const data = JSON.parse(result);

        if (data.video.buffer) {
          const blob = arrayBufferToBlob(data.video.buffer, data.video.type);
          data.video.url = URL.createObjectURL(blob);
        }
        if (data.audio.buffer) {
          const blob = arrayBufferToBlob(data.audio.buffer, data.audio.type);
          data.audio.url = URL.createObjectURL(blob);
        }

        setProjectData(data);
      } catch (error) {
        alert("Unable to parse file: " + file.name);
      }
    };
    reader.readAsText(file);
  };

  const openFileDialog = () => fileInputRef.current?.click();

  return (
    <>
      <Option onClick={openFileDialog} closeMenuOnClick>
        Open project
      </Option>
      <input type="file" accept={`.${EXT}`} ref={fileInputRef} onChange={handleFileSelect} className="hidden" />
    </>
  );
}
