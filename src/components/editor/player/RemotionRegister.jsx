import { Composition, registerRoot } from "remotion";
import Video from "./video";

registerRoot(() => <Composition id="Video" component={Video} width={1920} height={1080} fps={30} durationInFrames={1106} />);
