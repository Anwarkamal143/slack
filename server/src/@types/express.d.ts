// import { Language, User } from "../custom";
import { user } from "@/db/schema";
import { Request } from "express";
import { Server } from "socket.io";
import { ISocket } from "./socket";
type IUser = typeof user.$inferSelect;
// to make the file a module and avoid the TypeScript error
// export {};
type IRequest = Request & {
  user?: IUser;
};
declare global {
  namespace Express {
    export interface Request {
      //   language?: Language;
      user?: IUser;
      skt?: ISocket;
      io?: Server;
    }
  }
}
