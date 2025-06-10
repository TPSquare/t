export const Option = ({ children, title, onClick, closeMenuOnClick = false }) => {
  return (
    <button className="w-full px-2 pb-0.5 text-left hover:bg-[#ffffff30]" {...(closeMenuOnClick ? { "close-menu-on-click": "true" } : {})} type="button" title={title || children} onClick={onClick}>
      {children}
    </button>
  );
};
