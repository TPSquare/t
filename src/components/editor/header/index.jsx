import ExportController from "./ExportController";
import FileMenu from "./menu/file";

export default function Header() {
  return (
    <header className="flex h-[var(--header-height)] justify-between px-5 py-[var(--header-layout-space)]">
      <div className="flex h-full items-center gap-2">
        <FileMenu />
      </div>
      <div className="flex h-full items-center gap-2">
        <ExportController />
      </div>
    </header>
  );
}
