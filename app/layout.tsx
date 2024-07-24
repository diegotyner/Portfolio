import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: "Portfolio",
  description: "A portfolio to organize all my projects in one place",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className='main'>
          <div className='gradient'/>
        </div>

        <div className='app'>
          <Nav />
          {children}
        </div>
      </body>
    </html>
  );
}
