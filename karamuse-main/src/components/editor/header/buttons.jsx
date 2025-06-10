const Template = ({ children, title, onClick, style }) => {
  return (
    <button className="flex h-[70%] items-center rounded-sm px-2 text-sm font-medium" style={style} onClick={onClick} type="button" title={title || children}>
      {children}
    </button>
  );
};

export const Button = ({ children = "", title = "", onClick }) => {
  const style = {
    backgroundColor: "var(--button-background-color)",
    color: "var(--foreground-color)",
  };
  return (
    <Template title={title} onClick={onClick} style={style}>
      {children}
    </Template>
  );
};

export const HighlightButton = ({ children = "", title = "", onClick }) => {
  const style = {
    backgroundColor: "var(--highlight-color)",
    color: "var(--in-highlight-color)",
  };
  return (
    <Template title={title} onClick={onClick} style={style}>
      {children}
    </Template>
  );
};
