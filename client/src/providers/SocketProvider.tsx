"use client";
import { SOCKET_URL } from "@/config";
import { ISocketContextProps, SocketContext } from "@/context/socket";
import { useRefreshStoreGetTokens } from "@/store/useRefreshTokens";
import { useUserStoreIsAuthenticated } from "@/store/userUserStore";
import { ReactNode, useEffect, useState } from "react";
import { connect } from "socket.io-client";
export const socket = connect(SOCKET_URL, {
  // withCredentials: true,
  autoConnect: false,
});
export default function SocketContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const isAuthenticated = useUserStoreIsAuthenticated();
  const tokens = useRefreshStoreGetTokens();

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
    if (socket?.disconnected && isAuthenticated && tokens.accessToken) {
      socket.auth = { token: tokens.accessToken };
      socket.connect();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, [isAuthenticated, tokens.isRefreshing]);

  return (
    <SocketContext.Provider
      value={
        {
          socket,
          isConnected,
        } as ISocketContextProps
      }
    >
      {children}
    </SocketContext.Provider>
  );
}
