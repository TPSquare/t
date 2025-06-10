import useProjectData from "@/store/projectData";
import ColorPickerWithLabel from "../ColorPickerWithLabel";
import { Panel } from "../layout-kit";

export default function GeneralPanel({ activeKey }) {
  const updateProjectData = useProjectData(({ update }) => update);
  const videoBackgroundColor = useProjectData(({ videoBackgroundColor }) => videoBackgroundColor);

  const handleSelectBackgroundColor = (color) => updateProjectData("videoBackgroundColor", color);

  return (
    <Panel panelKey="general" activeKey={activeKey} className="flex flex-col space-y-1 p-4 text-sm text-[var(--foreground-color)]">
      <ColorPickerWithLabel label="Background color" color={videoBackgroundColor} onChange={handleSelectBackgroundColor} />
    </Panel>
  );
}
