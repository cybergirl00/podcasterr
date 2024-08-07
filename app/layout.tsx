import type { Metadata } from "next";
import {  Manrope } from "next/font/google";
import "./globals.css";
import ConvexClerkProvider from "@/providers/ConvexClerkProvider";
import AudioProvider from "@/providers/AudioProvider";

const inter = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Podcaster",
  description: "Generate your Podcast using AI",
  icons: {
    icon: "/icons/logo.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
    <html lang="en">
      <AudioProvider>
      <body className={`  ${inter.className}`}>
        {children}
      </body>
      </AudioProvider>
    </html>
    </ConvexClerkProvider>
  );
}
