import useProjectData, { useDurationInFrames } from "@/store/projectData";
import formatTime from "@/utilities/format-time";
import { Panel } from "../layout-kit";

export default function ProjectInfoPanel({ activeKey }) {
  const durationInFrames = useDurationInFrames();
  const fps = useProjectData(({ fps }) => fps);
  const projectName = useProjectData(({ name }) => name);
  return (
    <Panel panelKey="info" activeKey={activeKey} className="flex flex-col px-4 py-2 text-sm text-[var(--foreground-color)]">
      <span>Project name: {projectName}</span>
      <span>Frame rate: {fps}</span>
      <span>Duration: {formatTime(durationInFrames, fps)}</span>
    </Panel>
  );
}
