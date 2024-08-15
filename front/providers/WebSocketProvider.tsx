import { useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { WebSocketService } from "@/services/ws";
import { WebSocketContext } from "@/context/WebSocketContext";
import { useSessionStore } from "@/stores/session";

export default function WebSocketProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session] = useState<string>(useSessionStore((state) => state.session));
  const [ws] = useState<WebSocketService>(new WebSocketService(session));

  const value = useMemo(
    () => ({
      ws,
    }),
    [ws]
  );

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}
