"use client";

import { SOCKET_URL } from "@/config";
import { createContext } from "react";
import { Socket, connect } from "socket.io-client";
export type ISocketContextProps = {
  isConnected: boolean;
  socket?: Socket;
  send: Socket["emit"];
  subscribe: Socket["on"];
  disconnect: Socket["disconnect"];
};
export const socket = connect(SOCKET_URL);
export const SocketContext = createContext<Partial<ISocketContextProps>>({
  socket: undefined,
  isConnected: false,
});
