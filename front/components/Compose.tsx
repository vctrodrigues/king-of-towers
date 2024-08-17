"use client";

import WebSocketProvider from "@/providers/WebSocketProvider";

export default function Compose({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <WebSocketProvider>{children}</WebSocketProvider>;
}
