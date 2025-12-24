import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import '@/globals.css';
// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Write or Bye - Writing Productivity Tool",
  description: "The ultimate writing productivity tool. Keep writing or face the consequences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-gray-100 dark:bg-gray-900">
        {children}
      </body>
    </html>
  );
}
