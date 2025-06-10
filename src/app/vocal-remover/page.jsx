"use client";

import { useRef } from "react";

export default function VocalRemover() {
  const inputRef = useRef();

  const handleButtonClick = () => inputRef.current?.click();

  const handleImport = async ({ target }) => {
    const file = target.files[0];
    if (!file) return;

    const response = await fetch("/api/remove-vocal", {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!response.ok) {
      alert("Have an error!");
      throw new Error("Have an error!");
    }

    const result = await response.json();
    console.log(result);
  };

  return (
    <div id="root" className="flex h-full w-full items-center">
      <main className="flex w-full flex-col items-center">
        <button className="rounded-2xl border-2 border-[var(--highlight-color)] px-4 py-2 text-xl font-bold text-[var(--foreground-color)]" onClick={handleButtonClick} type="button" title="Import audio file">
          Import audio file
        </button>
        <input ref={inputRef} type="file" accept="audio/*" onChange={handleImport} title="Import audio file" className="hidden" />
      </main>
    </div>
  );
}
