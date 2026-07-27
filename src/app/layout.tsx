import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "./globals.css";
import { Container } from "@/components/container";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

const comfortaa = Comfortaa({
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Replay Analyzer",
  description: "osu! replay frametimes analyzer for detecting timewarp cheats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${comfortaa.className} min-h-screen antialiased grid grid-rows-[auto_1fr_auto]`}>
        <Header />
        <Container>
          {children}
        </Container>
        <Footer />
      </body>
    </html>
  );
}
