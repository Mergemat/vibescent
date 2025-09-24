import "~/styles/globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ConvexClientProvider } from "./_providers/convex-client-provider";
import ReactQueryProvider from "./_providers/react-query-provider";

export const metadata: Metadata = {
  title: "Vibescent",
  description: "Describe your vibe or image to discover perfume notes.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${geist.variable} dark antialiased`} lang="en">
      <body>
        <ConvexClientProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
