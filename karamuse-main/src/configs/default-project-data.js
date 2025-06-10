import version from "./version";
const defaultProjectData = {
  name: "Unknown",
  fps: 30,
  videoBackgroundColor: "#000000",
  reflexDuration: 0.4,
  countdown: {
    icon: "🎤",
    indexes: [0],
    quantity: 4,
    duration: 4,
    outlineColor: "white",
  },
  lyricsStyle: {
    fontSize: 6,
    fontWeight: 700,
    fontFamily: "Open Sans",
    outlineWidth: 5,
    static: { color: "#e6e6e6", outlineColor: "#000000" },
    active: { color: "#0000FE", outlineColor: "#FFFFFF" },
  },
  audio: {},
  video: {},
  image: {},
  lyrics: [],
  classifiedLyrics: [],
  version,
};
export default defaultProjectData;
