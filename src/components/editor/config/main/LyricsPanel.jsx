import { Children } from "react";

import useProjectData from "@/store/projectData";
import HexColorPicker from "@/components/color-pickers/hex";
import { Panel } from "../layout-kit";
import InputNumberWidthLabel from "../InputNumberWithLabel";
import GoogleFontPicker from "@/components/GoogleFontPicker";
import { generateLyricsTextShadow } from "@/utilities/generate-text-shadow";

const LyricsStyleVisualization = () => {
  const lyricsStyle = useProjectData(({ lyricsStyle }) => lyricsStyle);

  return (
    <div className="bg-checkerboard rounded-md px-2 pt-0.5 pb-1" style={{ fontWeight: lyricsStyle.fontWeight, fontFamily: lyricsStyle.fontFamily }}>
      <span className="block" style={{ color: lyricsStyle.static.color, textShadow: generateLyricsTextShadow(lyricsStyle.outlineWidth, lyricsStyle.static.outlineColor) }}>
        Lyrics-style visualization
      </span>
      <div className="relative">
        <span style={{ color: lyricsStyle.static.color, textShadow: generateLyricsTextShadow(lyricsStyle.outlineWidth, lyricsStyle.static.outlineColor) }}>Lyrics-style visualization</span>
        <div className="absolute top-0 left-0 w-24 overflow-hidden rounded-[inherit] p-[inherit]">
          <span className="whitespace-nowrap" style={{ color: lyricsStyle.active.color, textShadow: generateLyricsTextShadow(lyricsStyle.outlineWidth, lyricsStyle.active.outlineColor) }}>
            Lyrics-style visualization
          </span>
        </div>
      </div>
    </div>
  );
};

const Table = {
  Row: ({ children, type = "content" }) => {
    const [child1, child2, child3] = Children.toArray(children);
    return (
      <tr className="mb-1 flex">
        <Table.Wrapper className="w-15" type={type}>
          {child1}
        </Table.Wrapper>
        <Table.Wrapper className="flex-1 text-center" type={type}>
          {child2}
        </Table.Wrapper>
        <Table.Wrapper className="flex-1 text-center" type={type}>
          {child3}
        </Table.Wrapper>
      </tr>
    );
  },
  Wrapper: ({ children, className, type }) => {
    if (type === "heading") return <Table.Heading className={className}>{children}</Table.Heading>;
    return <Table.Content className={className}>{children}</Table.Content>;
  },
  Content: ({ children, className }) => <td className={className}>{children}</td>,
  Heading: ({ children, className }) => <th className={className}>{children}</th>,
};

const LyricsEditor = () => {
  const updateProjectData = useProjectData(({ update }) => update);
  const lyricsStyle = useProjectData(({ lyricsStyle }) => lyricsStyle);

  const hexColorPickerClassName = "h-6 w-10 rounded-md border-[1.5px] border-[var(--button-background-color)]";
  const inputNumberClassName = "inline-block rounded-md border-[1.5px] border-[var(--button-background-color)] bg-[var(--input-background-color)]";

  return (
    <div className="space-y-1">
      <table className="w-full">
        <thead>
          <Table.Row type="heading">
            &nbsp;
            <span>Static</span>
            <span>Active</span>
          </Table.Row>
        </thead>
        <tbody>
          <Table.Row>
            <span>Color</span>
            <HexColorPicker className={hexColorPickerClassName} color={lyricsStyle.static.color} onChange={(color) => updateProjectData("lyricsStyle.static.color", color)} />
            <HexColorPicker className={hexColorPickerClassName} color={lyricsStyle.active.color} onChange={(color) => updateProjectData("lyricsStyle.active.color", color)} />
          </Table.Row>
          <Table.Row>
            <span>Outline</span>
            <HexColorPicker className={hexColorPickerClassName} color={lyricsStyle.static.outlineColor} onChange={(color) => updateProjectData("lyricsStyle.static.outlineColor", color)} />
            <HexColorPicker className={hexColorPickerClassName} color={lyricsStyle.active.outlineColor} onChange={(color) => updateProjectData("lyricsStyle.active.outlineColor", color)} />
          </Table.Row>
        </tbody>
      </table>
      <GoogleFontPicker className="h-7 w-full bg-[var(--input-background-color)]" fontFamily={lyricsStyle.fontFamily} onChange={(fontFamily) => updateProjectData("lyricsStyle.fontFamily", fontFamily)} />
      <InputNumberWidthLabel label="Font size" className={inputNumberClassName} onChange={(fontSize) => updateProjectData("lyricsStyle.fontSize", fontSize)} value={lyricsStyle.fontSize} />
      <InputNumberWidthLabel label="Outline width" className={inputNumberClassName} onChange={(outlineWidth) => updateProjectData("lyricsStyle.outlineWidth", outlineWidth)} value={lyricsStyle.outlineWidth} />
    </div>
  );
};

export default function LyricsPanel({ activeKey }) {
  return (
    <Panel className="flex flex-col space-y-2 p-4 text-sm text-[var(--foreground-color)]" panelKey="lyrics" activeKey={activeKey}>
      <LyricsStyleVisualization />
      <LyricsEditor />
    </Panel>
  );
}
