export default function Wrapper({ children, className = "", panelKey, activeKey }) {
  const style = { display: panelKey !== activeKey ? "none" : null };
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
