import type { Metadata, Viewport } from "next";
import { Tilt_Warp, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";

const tiltWarp = Tilt_Warp({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-tilt-warp",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hunt8K — Scroll-Stopping Thumbnails",
  description:
    "Hunt8K designs high-octane YouTube thumbnails for gaming & IRL creators — engineered to stop the scroll and earn the click.",
  metadataBase: new URL("https://hunt8k.vercel.app"),
  openGraph: {
    title: "Hunt8K — Scroll-Stopping Thumbnails",
    description:
      "High-octane YouTube thumbnails for gaming & IRL creators. Engineered for the click.",
    images: ["/branding/about.png"],
    type: "website",
  },
  icons: {
    icon: "/branding/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#060607",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${tiltWarp.variable} ${inter.variable} ${mono.variable}`}
    >
      <body className="grain antialiased">
        <Preloader />
        <SmoothScroll>
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
