"use client";
import { ISocketContextProps, socket, SocketContext } from "@/context/socket";
import { ReactNode, useEffect, useState } from "react";

export default function SocketContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  function onConnect() {
    setIsConnected(true);
    setTransport(socket.io.engine.transport.name);

    socket.io.engine.on("upgrade", (transport) => {
      setTransport(transport.name);
    });
  }
  function onDisconnect() {
    setIsConnected(false);
    setTransport("N/A");
  }
  useEffect(() => {
    if (socket?.connected) {
      onConnect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={
        {
          socket,
          disconnect: socket.disconnect,
          isConnected,
          send: socket.emit,
          subscribe: socket.on,
        } as ISocketContextProps
      }
    >
      {children}
    </SocketContext.Provider>
  );
}
