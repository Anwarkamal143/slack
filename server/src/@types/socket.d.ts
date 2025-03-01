// First import the original Socket

import { Socket } from "socket.io";
import { IServerCookieType } from "./cookie";
type ISocket = Socket & {
  user?: IServerCookieType;
};

// export {};
