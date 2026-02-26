import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fluent - Learn German with AI",
  description: "AI-powered German conversation practice from A1 to C1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
