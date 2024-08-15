import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Theme } from "@radix-ui/themes";

import Compose from "@/components/Compose";

import "@radix-ui/themes/styles.css";
import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "King of Towers",
  description: "Save the kingdom from the evil forces.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme accentColor="orange" radius="small" appearance="dark">
          <Compose>{children}</Compose>
        </Theme>
      </body>
    </html>
  );
}
