"use client";

import ReactModal from "react-modal";
import { useEffect } from "react";

import "@/styles/editor.css";
import Header from "@/components/editor/header";
import Main from "@/components/editor/Main";

export default function Editor() {
  useEffect(() => ReactModal.setAppElement("#root"), []);

  return (
    <div id="root" className="h-full w-full">
      <Header />
      <Main />
    </div>
  );
}
