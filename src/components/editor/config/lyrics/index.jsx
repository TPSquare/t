import { useState } from "react";

import { Wrapper, Header, HeaderButton } from "../layout-kit";
import GeneralPanel from "./GeneralPanel";

export default function Lyrics({ wrapperKey }) {
  const [activeKey, setActiveKey] = useState("general");

  return (
    <Wrapper wrapperKey={wrapperKey}>
      <Header>
        <HeaderButton title="General" buttonKey="general" activeKey={activeKey} setActiveKey={setActiveKey} />
      </Header>
      <GeneralPanel activeKey={activeKey} />
    </Wrapper>
  );
}
