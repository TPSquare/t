import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";

const TYPE_ICON_MAP = {
  audio: fas.faMusic,
  lyrics: fas.faQuoteLeft,
  video: fas.faFilm,
  image: fas.faImage
};

export const TrackHeader = ({ type, name }) => {
  const icon = TYPE_ICON_MAP[type];

  return (
    <div className="h-12 w-full bg-[var(--layout-sidebar-background-color)] px-2 py-1 text-sm text-[var(--foreground-color)]">
      <div className="flex items-center space-x-2">
        <FontAwesomeIcon icon={icon} />
        <span>{name}</span>
      </div>
    </div>
  );
};

export const TimelineRow = ({ children }) => {
  return <div className="relative h-12 w-[var(--timeline-width)]">{children}</div>;
};
