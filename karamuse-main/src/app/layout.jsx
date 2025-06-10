import "@/styles/globals.css";
import { Source_Sans_3 } from "next/font/google";

const sourceSans3 = Source_Sans_3({ display: "swap", subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={["overflow-hidden", sourceSans3.className].join(" ")}>
      <body className="h-[100vh] bg-[var(--background-color)]">{children}</body>
    </html>
  );
}
