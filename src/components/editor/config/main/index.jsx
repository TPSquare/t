import { useState } from "react";

import { Wrapper, Header, HeaderButton } from "../layout-kit";
import ProjectInfoPanel from "./ProjectInfoPanel";
import GeneralPanel from "./GeneralPanel";
import LyricsPanel from "./LyricsPanel";

export default function Main({ wrapperKey }) {
  const [activeKey, setActiveKey] = useState("info");

  return (
    <Wrapper wrapperKey={wrapperKey}>
      <Header>
        <HeaderButton title="Project info" buttonKey="info" activeKey={activeKey} setActiveKey={setActiveKey} />
        <HeaderButton title="General" buttonKey="general" activeKey={activeKey} setActiveKey={setActiveKey} />
        <HeaderButton title="Lyrics" buttonKey="lyrics" activeKey={activeKey} setActiveKey={setActiveKey} />
        <HeaderButton title="Countdown" buttonKey="countdown" activeKey={activeKey} setActiveKey={setActiveKey} />
      </Header>
      <ProjectInfoPanel activeKey={activeKey} />
      <GeneralPanel activeKey={activeKey} />
      <LyricsPanel activeKey={activeKey} />
    </Wrapper>
  );
}
