
//app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import ThemeProvider from "@/theme/ThemeProvider";
import localFont from "next/font/local";
import SessionProvider from "./SessionProvider";

export const notoSansLao = localFont({
  src: "./fonts/NotoSansLao.ttf",
  variable: "--font-thai-nato",
  weight: "100 900",
});


export const metadata: Metadata = {
  title: "Portfolio",
  description: "portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${notoSansLao.className}  antialiased`}
      >
        <StoreProvider>
          <SessionProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </SessionProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
