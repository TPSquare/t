import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import Wrapper from "./Wrapper";
import normalizeSpaces from "@/utilities/normalize-spaces";
import useProjectData from "@/store/projectData";

const InputArea = forwardRef(({ onContentChange }, ref) => {
  const lyricsData = useProjectData(({ lyrics }) => lyrics);

  const [lyrics, setLyrics] = useState("");

  useEffect(() => {
    setLyrics(lyricsData.map(({ lyrics }) => lyrics).join("\n"));
  }, [lyricsData]);

  const handleChange = (e) => {
    setLyrics(e.target.value);
    onContentChange?.(e);
  };

  const style = { height: "auto" };
  return <textarea ref={ref} name="Lyrics" className="custom-scrollbar w-full flex-1 resize-none rounded-[var(--layout-rounded)] bg-[var(--input-background-color)] p-2 text-sm text-[var(--foreground-color)] placeholder:text-[var(--foreground-color)] focus:outline-none" value={lyrics} placeholder="Enter lyrics..." wrap="off" onChange={handleChange} style={style} />;
});

const SaveButton = ({ onClick, disabled }) => {
  const activeStyle = {
    backgroundColor: "var(--highlight-color)",
    color: "var(--in-highlight-color)",
    cursor: null,
  };
  const disabledStyle = {
    backgroundColor: "var(--disable-color)",
    color: "var(--in-disable-color)",
    cursor: "not-allowed",
  };
  const style = disabled ? disabledStyle : activeStyle;

  return (
    <button className="rounded-md px-1.5 text-sm font-medium" style={style} onClick={onClick} type="button" title="Save lyrics" disabled={disabled}>
      Save
    </button>
  );
};

export default function LyricsPanel({ panelKey, activeKey }) {
  const inputRef = useRef();
  const [isSaveDisabled, setSaveDisabled] = useState(true);

  const lyricsData = useProjectData(({ lyrics }) => lyrics);
  const updateProjectData = useProjectData(({ update }) => update);

  const getNormalizedInput = () => normalizeSpaces(inputRef.current?.value || "");

  const handleSave = () => {
    const lyrics = getNormalizedInput();
    const lines = lyrics.split("\n").map((line, index) => ({ lyrics: line, index }));
    updateProjectData("lyrics", lines);
    setSaveDisabled(true);
  };

  const handleInputChange = useCallback(() => {
    const current = getNormalizedInput();
    const original = lyricsData.map(({ lyrics }) => lyrics).join("\n");
    const shouldDisable = current === "" || current === normalizeSpaces(original);
    setSaveDisabled(shouldDisable);
  }, [lyricsData]);

  useEffect(() => setSaveDisabled(true), []);

  return (
    <Wrapper className="flex h-full w-full flex-col space-y-1 p-2" panelKey={panelKey} activeKey={activeKey}>
      <InputArea ref={inputRef} onContentChange={handleInputChange} />
      <div className="text-right">
        <SaveButton onClick={handleSave} disabled={isSaveDisabled} />
      </div>
    </Wrapper>
  );
}
