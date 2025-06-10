export default function AppearInOut({ children, start, end, style, currentFrame }) {
  if (currentFrame < start || currentFrame > end) return null;
  return <div style={{ ...style }}>{children}</div>;
}
