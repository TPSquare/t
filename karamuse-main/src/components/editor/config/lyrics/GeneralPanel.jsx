import { useContext } from "react";

import useProjectData from "@/store/projectData";
import { Panel } from "../layout-kit";
import CheckBoxWithLabel from "../CheckBoxWithLabel";
import ConfigContext from "../ConfigContext";

export default function GeneralPanel({ activeKey }) {
  const updateProjectData = useProjectData(({ update }) => update);
  const { lyricsIndex } = useContext(ConfigContext);
  const lyricsData = useProjectData(({ lyrics }) => lyrics);

  const handleCheckedChange = (checked) => {
    updateProjectData("countdown.indexes", (draftIndexes) => {
      if (checked && !draftIndexes.includes(lyricsIndex)) draftIndexes.push(lyricsIndex);
      if (!checked && draftIndexes.includes(lyricsIndex)) {
        const start = draftIndexes.findIndex((value) => value === lyricsIndex);
        draftIndexes.splice(start, 1);
      }
    });
    updateProjectData(`lyrics[${lyricsIndex}].hasCountdown`, checked ? true : null);
  };

  return (
    <Panel panelKey="general" activeKey={activeKey} className="flex flex-col space-y-1 p-4 text-sm text-[var(--foreground-color)]">
      <div></div>
      <CheckBoxWithLabel label="Has countdown" checked={lyricsData[lyricsIndex]?.hasCountdown || false} onChange={handleCheckedChange} />
    </Panel>
  );
}
