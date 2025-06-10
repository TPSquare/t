import useProjectData from "@/store/projectData";
import { Option } from "../options";
import defaultProjectData from "@/configs/default-project-data";

export default function NewOption() {
  const setProjectData = useProjectData(({ set }) => set);
  const handleClick = () => setProjectData(defaultProjectData);
  return (
    <Option onClick={handleClick} closeMenuOnClick>
      New project
    </Option>
  );
}
