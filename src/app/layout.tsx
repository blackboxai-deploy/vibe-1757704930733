import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pomodoro Timer - Focus & Productivity",
  description: "A beautiful Pomodoro timer app with custom intervals, smooth animations, and productivity tracking.",
  keywords: "pomodoro, timer, productivity, focus, work, break, study",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-sans">
        {children}
      </body>
    </html>
  );
}