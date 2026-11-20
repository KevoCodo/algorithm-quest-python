import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Algorithm Quest | Python Maze Challenge",
  description: "Learn computational thinking with a hands-on Python maze challenge.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
