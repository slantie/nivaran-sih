import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Nivaran | Grievance Portal Demo",
  description: "Frontend-only civic service portfolio demonstration",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
