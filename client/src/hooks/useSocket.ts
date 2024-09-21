import { ISocketContextProps, SocketContext } from "@/context/socket";
import { useContext } from "react";

const useSocket = () => {
  const socket = useContext(SocketContext) as ISocketContextProps;

  if (!socket) {
    throw Error("Socket is used outside of the context");
  }

  return socket;
};

export default useSocket;
