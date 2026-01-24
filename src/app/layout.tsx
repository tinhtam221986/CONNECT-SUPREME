import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import Script from "next/script"; // Tạm thời đóng để fix lỗi build nếu chưa cài types

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CONNECT-PI-SUPREME",
  description: "Social Commerce on Pi Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <script src="https://sdk.minepi.com/pi-sdk.js" async />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
